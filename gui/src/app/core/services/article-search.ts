import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleSearchService {
  // =========================
  // Declarations
  // =========================

  private searchTermSubject = new Subject<string>();
  searchTerm$ = this.searchTermSubject.asObservable();

  // =========================
  // Methods
  // =========================

  search(term: string) {
    this.searchTermSubject.next(term.trim());
  }
}
