import { showError, toErrorMessage } from '@/utils';
import styles from './comments-section.css?raw';
import templateHtml from './comments-section.html?raw';

export class CommentsSection extends HTMLElement {
  // =========================
  // Declarations
  // =========================

  private root: ShadowRoot;

  // =========================
  // LifeCycle Hooks
  // =========================

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  // =========================
  // Methods
  // =========================

  connectedCallback(): void {
    try {
      const templateEl = document.createElement('template');
      templateEl.innerHTML = templateHtml;

      const styleEl = document.createElement('style');
      styleEl.textContent = styles;

      this.root.append(styleEl, templateEl.content.cloneNode(true));

      this.initToggleBtn();
      this.initSubmitBtn();
      this.initForm();
    } catch (err: unknown) {
      showError(
        toErrorMessage(err) || 'Comments failure. Please reload the page.'
      );
    }
  }

  // ==========================================================================
  // Show / Hide comments button
  // ==========================================================================

  private initToggleBtn(): void {
    const showHideBtn =
      this.root.querySelector<HTMLButtonElement>('.show-hide');

    const commentWrapper =
      this.root.querySelector<HTMLDivElement>('#comment-wrapper');

    if (!showHideBtn || !commentWrapper) {
      console.error('[comments-section] Missing toggle or wrapper element.');
      return;
    }

    // Start hidden
    commentWrapper.style.display = 'none';
    showHideBtn.setAttribute('aria-expanded', 'false');

    showHideBtn.addEventListener('click', () => {
      const isExpanded = showHideBtn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // Hide
        showHideBtn.textContent = 'Show comments';
        showHideBtn.setAttribute('aria-expanded', 'false');
        commentWrapper.style.display = 'none';
      } else {
        // Show
        showHideBtn.textContent = 'Hide comments';
        showHideBtn.setAttribute('aria-expanded', 'true');
        commentWrapper.style.display = 'block';
      }
    });
  }

  // ==========================================================================
  // Enable submit button only when both fields are filled
  // ==========================================================================

  private initSubmitBtn(): void {
    const nameField =
      this.root.querySelector<HTMLInputElement>('#comment-name');

    const commentField =
      this.root.querySelector<HTMLInputElement>('#comment-text');

    const submitBtn =
      this.root.querySelector<HTMLButtonElement>('#submit-comment');

    if (!nameField || !commentField || !submitBtn) {
      console.error('[comments-section] Missing form fields.');
      return;
    }

    const toggleSubmit = (): void => {
      const validName = nameField.value.trim().length > 0;
      const validComment = commentField.value.trim().length > 0;
      submitBtn.disabled = !(validName && validComment);
    };

    // Initial state
    toggleSubmit();

    // Live validation
    nameField.addEventListener('input', toggleSubmit);
    commentField.addEventListener('input', toggleSubmit);
  }

  // ==========================================================================
  // Form submission logic
  // ==========================================================================

  private initForm(): void {
    const form = this.root.querySelector<HTMLFormElement>('.comment-form');
    const nameField =
      this.root.querySelector<HTMLInputElement>('#comment-name');
    const commentField =
      this.root.querySelector<HTMLInputElement>('#comment-text');
    const list =
      this.root.querySelector<HTMLUListElement>('.comment-container');

    if (!form || !nameField || !commentField || !list) {
      console.error('[comments-section] Missing form or fields.');
      return;
    }

    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();

      try {
        const nameValue = nameField.value.trim();
        const commentValue = commentField.value.trim();

        if (!nameValue || !commentValue) {
          showError('Please enter your name and a comment.');
          return;
        }

        const listItem = document.createElement('li');
        const namePara = document.createElement('p');
        const commentPara = document.createElement('p');

        namePara.textContent = nameValue;
        commentPara.textContent = commentValue;

        listItem.append(namePara, commentPara);
        list.appendChild(listItem);

        // Reset
        nameField.value = '';
        commentField.value = '';

        const submitBtn =
          this.root.querySelector<HTMLButtonElement>('#submit-comment');
        if (submitBtn) submitBtn.disabled = true;
      } catch (err: unknown) {
        showError(
          toErrorMessage(err) || 'Could not add your comment. Please try again.'
        );
      }
    });
  }
}

customElements.define('comments-section', CommentsSection);
