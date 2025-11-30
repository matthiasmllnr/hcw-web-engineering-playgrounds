import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { BaseHttpService, QueryParams } from './base-http';

export interface Bear {
  name: string;
  binomial: string;
  image: string;
  rangeText: string;
  rangeImage: string | null;
}

type WikiParseResponse = {
  parse: { wikitext: { '*': string } };
};

type Page = { imageinfo?: { url?: string }[] };
type ImageInfoResponse = {
  query?: { pages?: Record<string, Page> };
};

const BASE_URL = 'https://en.wikipedia.org/w/api.php';
const TITLE = 'List_of_ursids';
const IMAGE_PLACEHOLDER = 'assets/no_image_placeholder.png';

@Injectable({
  providedIn: 'root',
})
export class MoreBearsService {
  // =========================
  // Declarations
  // =========================

  protected http = inject(BaseHttpService);

  // =========================
  // Methods
  // =========================

  loadBears() {
    return this.fetchWikiWikitext().pipe(switchMap((wikitext) => this.extractBears(wikitext)));
  }

  /** Step 1: fetch raw wikitext */
  private fetchWikiWikitext() {
    const params: QueryParams = {
      action: 'parse',
      page: TITLE,
      prop: 'wikitext',
      section: 3,
      format: 'json',
      origin: '*',
    };

    return this.http
      .getJson<WikiParseResponse>(BASE_URL, params)
      .pipe(map((res) => res.parse.wikitext['*']));
  }

  /** Step 2: fetch image URL */
  private fetchImageUrl(fileName: string) {
    if (!fileName) return of(null);

    const params: QueryParams = {
      action: 'query',
      titles: 'File:' + fileName,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    };

    return this.http.getJson<ImageInfoResponse>(BASE_URL, params).pipe(
      map((res) => {
        const pages = res?.query?.pages || {};
        const page = Object.values(pages)[0];
        return page?.imageinfo?.[0]?.url ?? null;
      }),
      catchError(() => of(null)),
    );
  }

  /** Step 3: parse all bear entries as observable */
  private extractBears(wikitext: string) {
    const speciesTables = wikitext.split('{{Species table/end}}');
    let rows: string[] = [];

    speciesTables.forEach((t) => {
      rows = rows.concat(t.split('{{Species table/row'));
    });

    const observables = rows.map((row) => {
      const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
      const binomialMatch = row.match(/\|binomial=(.*?)\n/);
      const rangeMatch = row.match(/\|range=([^|\n]*)\s*\|range-image=([^|\n]*)/);
      const imageMatch = row.match(/\|image=(.*?)\n/);

      if (!(nameMatch && binomialMatch && imageMatch)) {
        return of(null);
      }

      const fileName = imageMatch[1].trim().replace('File:', '');
      const rangeText = rangeMatch ? rangeMatch[1].trim() : 'Unknown';
      const rangeImageName = rangeMatch ? rangeMatch[2].trim().replace('File:', '') : null;

      return forkJoin({
        bearImg: this.fetchImageUrl(fileName),
        rangeImg: this.fetchImageUrl(rangeImageName ?? ''),
      }).pipe(
        map(
          ({ bearImg, rangeImg }) =>
            ({
              name: nameMatch[1],
              binomial: binomialMatch[1],
              image: bearImg || IMAGE_PLACEHOLDER,
              rangeText,
              rangeImage: rangeImg,
            }) as Bear,
        ),
        catchError(() => of(null)),
      );
    });

    return forkJoin(observables).pipe(map((items) => items.filter((i): i is Bear => !!i)));
  }
}
