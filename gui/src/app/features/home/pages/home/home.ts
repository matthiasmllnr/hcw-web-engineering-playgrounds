import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommentsSection, MoreBears } from '@core/components';
import { ArticleSearchService } from '@core/services';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Subscription } from 'rxjs';

type BearRow = {
  type: string;
  coat: string;
  size: string;
  habitat: string;
  lifespan: string;
  diet: string;
};

@Component({
  selector: 'app-home',
  imports: [
    NzGridModule,
    NzCardModule,
    NzTableModule,
    NzImageModule,
    NzTypographyModule,
    NzListModule,
    NzDividerModule,
    CommentsSection,
    MoreBears,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // =========================
  // Declarations
  // =========================

  private articleSearch: ArticleSearchService = inject(ArticleSearchService);
  private searchSub?: Subscription;

  bears: BearRow[] = [
    {
      type: 'Wild',
      coat: 'Brown or black',
      size: '1.4 to 2.8 meters',
      habitat: 'Woods and forests',
      lifespan: '25 to 28 years',
      diet: 'Fish, meat, plants',
    },
    {
      type: 'Urban',
      coat: 'North Face',
      size: '18 to 22',
      habitat: 'Condos and coffee shops',
      lifespan: '20 to 32 years',
      diet: 'Starbucks, sushi',
    },
  ];

  relatedArticles = [
    'The trouble with Bees',
    'The trouble with Otters',
    'The trouble with Penguins',
    'The trouble with Octopi',
    'The trouble with Lemurs',
  ];

  // * -----------------------
  // * >>> ViewChildren
  // * -----------------------

  @ViewChild('articleRoot', { static: true })
  articleRoot!: ElementRef<HTMLElement>;

  // =========================
  // LifeCycle Hooks
  // =========================

  ngAfterViewInit(): void {
    this.searchSub = this.articleSearch.searchTerm$.subscribe((term) => {
      this.applySearch(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // =========================
  // Methods
  // =========================

  private applySearch(searchKey: string): void {
    const article = this.articleRoot.nativeElement;

    // 1) remove previous highlights
    this.clearHighlights(article);

    const trimmed = searchKey.trim();
    if (!trimmed) {
      return;
    }

    // 2) escape regex + build
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escaped + ')', 'gi');

    // 3) search only inside <article>
    const searchNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as ChildNode;
        const value = textNode.nodeValue;
        if (!value) return;

        if (regex.test(value)) {
          const span = document.createElement('span');
          span.innerHTML = value.replace(regex, '<mark class="highlight">$1</mark>');
          textNode.replaceWith(...Array.from(span.childNodes));
        }
      } else if (
        node instanceof Element &&
        node.tagName !== 'SCRIPT' &&
        node.tagName !== 'STYLE' &&
        node.tagName !== 'FORM' &&
        node.tagName !== 'MARK'
      ) {
        Array.from(node.childNodes).forEach(searchNode);
      }
    };

    searchNode(article);
  }

  private clearHighlights(root: HTMLElement): void {
    const marks = root.querySelectorAll('mark.highlight');
    marks.forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      const text = el.textContent ?? '';
      parent.replaceChild(document.createTextNode(text), el);
      // normalize merges adjacent text nodes
      (parent as HTMLElement).normalize();
    });
  }
}
