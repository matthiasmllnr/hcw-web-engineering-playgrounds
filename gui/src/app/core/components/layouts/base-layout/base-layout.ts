import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconType } from '@app/icons-provider';
import { MenuItem } from '@core/models';
import { ArticleSearchService } from '@core/services';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-base-layout',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
  ],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss',
})
export class BaseLayout implements AfterViewChecked {
  // =========================
  // Declarations
  // =========================

  private fb: FormBuilder = inject(FormBuilder);
  private articleSearch: ArticleSearchService = inject(ArticleSearchService);

  protected readonly date = new Date();

  // signal that holds the current height of the viewport
  private _elHeight = signal<string>('0px');
  protected elHeight = this._elHeight.asReadonly();

  // * -----------------------
  // * >>> MenuItems
  // * -----------------------

  // 'Home', 'Our Team', 'Projects', 'Blog'
  protected menuItems: MenuItem[] = [
    new MenuItem('Home', 'home', {
      icon: NzIconType.Home,
    }),
    new MenuItem('Our Team', 'our-team', {
      icon: NzIconType.Team,
    }),
    new MenuItem('Projects', 'projects', {
      icon: NzIconType.Project,
    }),
    new MenuItem('Blog', 'blog', {
      icon: NzIconType.Comment,
    }),
  ];

  // * -----------------------
  // * >>> Search
  // * -----------------------

  protected value = '';

  onSearch(term: string) {
    this.articleSearch.search(term);
  }

  // =========================
  // LifeCycle Hooks
  // =========================

  ngAfterViewChecked(): void {
    this.updateElHeight();
  }

  // =========================
  // Methods
  // =========================

  private updateElHeight(): void {
    const currentHeight = this._elHeight();
    const newHeight = `${window.innerHeight}px`;
    if (newHeight && currentHeight != newHeight) {
      this._elHeight.set(newHeight);
    }
  }
}
