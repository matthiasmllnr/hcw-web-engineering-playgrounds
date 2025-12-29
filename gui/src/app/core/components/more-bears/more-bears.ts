import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MoreBearsService } from '@core/services';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { catchError, finalize, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-more-bears',
  imports: [
    NzCardModule,
    NzTypographyModule,
    NzSpinModule,
    AsyncPipe,
    NzGridModule,
    NzImageModule,
    NzEmptyModule,
    NzAlertModule,
  ],
  templateUrl: './more-bears.html',
  styleUrl: './more-bears.scss',
})
export class MoreBears {
  // =========================
  // Declarations
  // =========================

  protected bearsService: MoreBearsService = inject(MoreBearsService);

  protected loading = true;
  protected error: string | null = null;

  protected bears$ = this.bearsService.loadBears().pipe(
    catchError((err) => {
      console.error(err);
      this.error = 'Failed to load Wikipedia bears.';
      return of([]);
    }),
    finalize(() => (this.loading = false)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor() {
    // When observable completes
    this.bears$.subscribe(() => (this.loading = false));
  }
}
