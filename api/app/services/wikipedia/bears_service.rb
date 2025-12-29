# frozen_string_literal: true

module Wikipedia
  class BearsService
    TITLE = "List_of_ursids"
    SECTION = 3

    DEFAULT_LIMIT = 25
    MAX_LIMIT = 80
    BATCH_SIZE = 40

    def initialize(client: Wikipedia::Client.new)
      @client = client
    end

    def list(limit: nil)
      limit = normalize_limit(limit)

      wikitext = fetch_wikitext
      rows     = extract_rows(wikitext).first(limit)
      parsed   = rows.map { |row| parse_row(row) }.compact

      ## Collect all image file names once
      file_names = parsed
        .flat_map { |b| [b[:image_file], b[:range_image_file]] }
        .compact
        .uniq

      url_map = fetch_image_urls(file_names)

      parsed.map do |b|
        {
          name: b[:name],
          binomial: b[:binomial],
          image: url_map[b[:image_file]],
          rangeText: b[:range_text],
          rangeImage: b[:range_image_file] ? url_map[b[:range_image_file]] : nil
        }
      end
    end

    private

    ## -------------------------
    ## Wikipedia API
    ## -------------------------

    def fetch_wikitext
      data = @client.get(
        "action" => "parse",
        "page" => TITLE,
        "prop" => "wikitext",
        "section" => SECTION
      )

      data.dig("parse", "wikitext", "*") || ""
    end

    ## Batch resolve image filenames => URLs
    def fetch_image_urls(file_names)
      return {} if file_names.empty?

      map = {}

      file_names.each_slice(BATCH_SIZE) do |slice|
        titles = slice.map { |fn| "File:#{fn}" }.join("|")

        data = @client.get(
          "action" => "query",
          "titles" => titles,
          "prop" => "imageinfo",
          "iiprop" => "url"
        )

        pages = data.dig("query", "pages") || {}
        pages.values.each do |page|
          title = page["title"].to_s ## "File:Something.jpg"
          next if title.empty?

          file = title.sub(/\AFile:/, "")
          url  = page.dig("imageinfo", 0, "url")

          map[file] = url if url
        end
      rescue Wikipedia::Error => e
        Rails.logger.warn("[Wikipedia] image batch failed: #{e.message}")
        next
      end

      map
    end

    ## -------------------------
    ## Parsing helpers
    ## -------------------------

    def extract_rows(wikitext)
      tables = wikitext.split("{{Species table/end}}")
      rows = []
      tables.each { |t| rows.concat(t.split("{{Species table/row")) }
      rows
    end

    def parse_row(row)
      name_match     = row.match(/\|name=\[\[(.*?)\]\]/)
      binomial_match = row.match(/\|binomial=(.*?)\n/)
      image_match    = row.match(/\|image=(.*?)\n/)
      range_match    = row.match(/\|range=([^|\n]*)\s*\|range-image=([^|\n]*)/)

      return nil unless name_match && binomial_match && image_match

      image_file = cleanup_file_name(image_match[1])
      range_text = range_match ? range_match[1].to_s.strip : "Unknown"
      range_file = range_match ? cleanup_file_name(range_match[2]) : nil

      {
        name: name_match[1],
        binomial: binomial_match[1].to_s.strip,
        image_file: image_file,
        range_text: range_text,
        range_image_file: range_file
      }
    end

    def cleanup_file_name(value)
      v = value.to_s.strip
      v = v.sub(/\AFile:/, "")
      v = v.split("|").first.to_s.strip
      v.empty? ? nil : v
    end

    ## -------------------------
    ## Utilities
    ## -------------------------

    def normalize_limit(limit)
      n = limit.to_i
      n = DEFAULT_LIMIT if n <= 0
      n.clamp(1, MAX_LIMIT)
    end
  end
end