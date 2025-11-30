import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type QueryParams = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  // =========================
  // Declarations
  // =========================

  private http: HttpClient = inject(HttpClient);

  // =========================
  // Methods
  // =========================

  getJson<T>(url: string, params?: QueryParams): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => (httpParams = httpParams.set(k, String(v))));
    }

    return this.http.get<T>(url, { params: httpParams });
  }
}
