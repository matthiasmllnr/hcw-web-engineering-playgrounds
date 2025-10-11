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
      // Build template
      const templateEl = document.createElement('template');
      templateEl.innerHTML = templateHtml;

      // Inject <style> scoped to shadow
      const styleEl = document.createElement('style');
      styleEl.textContent = styles;

      // Attach to shadow DOM
      this.root.append(styleEl, templateEl.content.cloneNode(true));

      // Init
      this.initToggleBtn();
      this.initSubmitBtn();
      this.initForm();
    } catch (err: unknown) {
      showError(
        toErrorMessage(err) || 'Comments failure. Please reload the page.'
      );
    }
  }

  // =========================
  // Private
  // =========================

  private initToggleBtn(): void {
    const showHideBtn =
      this.root.querySelector<HTMLButtonElement>('.show-hide');
    const commentWrapper =
      this.root.querySelector<HTMLDivElement>('.comment-wrapper');

    if (!showHideBtn || !commentWrapper) {
      console.error(
        '[comments-section] (initToggleBtn) Required fields are missing!'
      );
      return;
    }

    commentWrapper.style.display = 'none';

    showHideBtn.onclick = () => {
      const showHideText = showHideBtn.textContent;
      if (showHideText === 'Show comments') {
        showHideBtn.textContent = 'Hide comments';
        commentWrapper.style.display = 'block';
      } else {
        showHideBtn.textContent = 'Show comments';
        commentWrapper.style.display = 'none';
      }
    };
  }

  private initSubmitBtn(): void {
    const nameField = this.root.querySelector<HTMLInputElement>('#name');
    const commentField = this.root.querySelector<HTMLInputElement>('#comment');
    const submitBtn =
      this.root.querySelector<HTMLButtonElement>('#submit-comment');

    if (!nameField || !commentField || !submitBtn) {
      console.error(
        '[comments-section] (initSubmitBtn) Required fields are missing!'
      );
      return;
    }

    const toggleSubmit = (): void => {
      const nameIsPresent = nameField.value.trim().length > 0;
      const commentIsPresent = commentField.value.trim().length > 0;
      submitBtn.disabled = !(nameIsPresent && commentIsPresent);
    };

    // run once at startup
    toggleSubmit();

    // check on every keystroke
    nameField.addEventListener('input', toggleSubmit);
    commentField.addEventListener('input', toggleSubmit);
  }

  private initForm(): void {
    const form = this.root.querySelector<HTMLFormElement>('.comment-form');
    const nameField = this.root.querySelector<HTMLInputElement>('#name');
    const commentField = this.root.querySelector<HTMLInputElement>('#comment');
    const list =
      this.root.querySelector<HTMLUListElement>('.comment-container');

    if (!form || !nameField || !commentField || !list) {
      console.error(
        '[comments-section] (initForm) Required fields are missing!'
      );
      return;
    }

    form.onsubmit = (e: SubmitEvent) => {
      e.preventDefault();

      try {
        const listItem = document.createElement('li');
        const namePara = document.createElement('p');
        const commentPara = document.createElement('p');
        const nameValue = nameField.value;
        const commentValue = commentField.value;

        if (!nameValue || !commentValue) {
          showError('Please enter your name and a comment.');
          return;
        }

        namePara.textContent = nameValue;
        commentPara.textContent = commentValue;

        list.appendChild(listItem);
        listItem.appendChild(namePara);
        listItem.appendChild(commentPara);

        nameField.value = '';
        commentField.value = '';

        // Re-disable submit after reset
        const submitBtn =
          this.root.querySelector<HTMLButtonElement>('#submit-comment');
        if (submitBtn) submitBtn.disabled = true;
      } catch (err: unknown) {
        showError(
          toErrorMessage(err) || 'Could not add your comment. Please try again.'
        );
      }
    };
  }
}

customElements.define('comments-section', CommentsSection);
