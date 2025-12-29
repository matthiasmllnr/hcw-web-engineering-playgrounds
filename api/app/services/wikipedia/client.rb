require "json"

module Wikipedia
  class Error < StandardError; end

  class Client
    BASE_URL = "https://en.wikipedia.org/w/api.php"

    def initialize
      @conn = Faraday.new(url: BASE_URL) do |f|
        f.request :url_encoded
        f.response :raise_error
        f.adapter Faraday.default_adapter
      end
    end

    def get(params)
      response = @conn.get("", default_params.merge(params))
      JSON.parse(response.body)
    rescue Faraday::Error => e
      raise Wikipedia::Error, e.message
    rescue JSON::ParserError => e
      raise Wikipedia::Error, "Invalid JSON from Wikipedia: #{e.message}"
    end

    private

    def default_params
      {
        "format" => "json",
        "origin" => "*" ## harmless server-side; avoids edge cases
      }
    end
  end
end