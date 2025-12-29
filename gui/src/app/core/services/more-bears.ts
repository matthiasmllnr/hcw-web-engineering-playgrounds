import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs';
import { BaseHttpService } from './base-http';

export interface Bear {
  name: string;
  binomial: string;
  image: string;
  rangeText: string;
  rangeImage: string | null;
}

type BearsApiResponse = {
  data: Array<{
    name: string;
    binomial: string;
    image: string | null;
    rangeText: string;
    rangeImage: string | null;
  }>;
};

// Keep this as FE concern (assets live in FE, not in BE)
const IMAGE_PLACEHOLDER = 'no_image_placeholder.png';

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
    const url = `${environment.apiUrl}/bears`;

    return this.http.getJson<BearsApiResponse>(url).pipe(
      map((res) =>
        (res?.data ?? []).map(
          (b) =>
            ({
              name: b.name,
              binomial: b.binomial,
              image: b.image || IMAGE_PLACEHOLDER,
              rangeText: b.rangeText,
              rangeImage: b.rangeImage,
            }) satisfies Bear,
        ),
      ),
    );
  }
}
