// =========================
// Imports
// =========================

import { buildUrl, fetchJson } from '@/utils'

// =========================
// Types
// =========================

type Page = { imageinfo?: { url?: string }[] }
type ImageInfoResponse = {
  query?: { pages?: Record<string, Page> }
}

// =========================
// Global Variables
// =========================

const baseUrl: string = 'https://en.wikipedia.org/w/api.php'
const title: string = 'List_of_ursids'

var params: any = {
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
  const url = buildUrl(baseUrl, params)
  return await fetchJson(url, 'load Wikipedia bear list')
}

export const fetchImageUrl = async (fileName: string) => {
  const imageParams = {
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
    origin: '*',
  }

  const url = buildUrl(baseUrl, imageParams)
  const data = (await fetchJson(url, `resolve image URL for ${fileName}`)) as ImageInfoResponse

  const pages = data?.query?.pages || {}
  const page = Object.values(pages)[0]

  const imageUrl = page?.imageinfo?.[0]?.url || null
  return imageUrl
}
