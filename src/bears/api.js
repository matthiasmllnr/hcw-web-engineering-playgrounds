var baseUrl = 'https://en.wikipedia.org/w/api.php'
var title = 'List_of_ursids'

var params = {
  action: 'parse',
  page: title,
  prop: 'wikitext',
  section: 3,
  format: 'json',
  origin: '*',
}

// =========================
// Public
// =========================

export const fetchWikiEntries = async () => {
  const res = await fetch(baseUrl + '?' + new URLSearchParams(params).toString())
  return await res.json()
}

export const fetchImageUrl = async fileName => {
  const imageParams = {
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
    origin: '*',
  }

  const url = baseUrl + '?' + new URLSearchParams(imageParams).toString()
  const res = await fetch(url)
  const data = await res.json()
  const pages = data.query.pages
  const page = Object.values(pages)[0]
  return page.imageinfo[0].url
}
