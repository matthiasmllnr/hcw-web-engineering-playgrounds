// =========================
// Imports
// =========================

import { buildUrl, fetchJson, type QueryParams } from '@/utils';

// =========================
// Types
// =========================

type Page = { imageinfo?: { url?: string }[] };
type ImageInfoResponse = {
  query?: { pages?: Record<string, Page> };
};
type WikiParseResponse = {
  parse: { wikitext: { '*': string } };
};

// =========================
// Global Variables
// =========================

const baseUrl: string = 'https://en.wikipedia.org/w/api.php';
const title: string = 'List_of_ursids';

const params: QueryParams = {
  action: 'parse',
  page: title,
  prop: 'wikitext',
  section: 3,
  format: 'json',
  origin: '*',
};

// =========================
// Public
// =========================

export const fetchWikiEntries = async (): Promise<WikiParseResponse> => {
  const url = buildUrl(baseUrl, params);
  return await fetchJson<WikiParseResponse>(url, 'load Wikipedia bear list');
};

export const fetchImageUrl = async (fileName: string) => {
  const imageParams: QueryParams = {
    action: 'query',
    titles: 'File:' + fileName,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
    origin: '*',
  };

  const url = buildUrl(baseUrl, imageParams);
  const data = await fetchJson<ImageInfoResponse>(
    url,
    `resolve image URL for ${fileName}`
  );

  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];

  const imageUrl = page?.imageinfo?.[0]?.url || null;
  return imageUrl;
};
