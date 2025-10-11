// =========================
// Imports
// =========================

import { showError, toErrorMessage } from '@/utils';

// =========================
// Public
// =========================

export const initComments = () => {
  try {
    initToggleBtn();
    initSubmitBtn();
    initForm();
  } catch (err) {
    showError(
      toErrorMessage(err) || 'Comments failure. Please reload the page.'
    );
  }
};

// =========================
// Private
// =========================

const initToggleBtn = () => {
  const showHideBtn = document.querySelector<HTMLButtonElement>('.show-hide');
  const commentWrapper =
    document.querySelector<HTMLDivElement>('.comment-wrapper');

  if (!showHideBtn || !commentWrapper) {
    console.error('[comments.ts] (initToggleBtn) Required fields are missing!');
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
};

const initSubmitBtn = () => {
  const nameField = document.querySelector<HTMLInputElement>('#name');
  const commentField = document.querySelector<HTMLInputElement>('#comment');
  const submitBtn =
    document.querySelector<HTMLButtonElement>('#submit-comment');

  if (!nameField || !commentField || !submitBtn) {
    console.error('[comments.ts] (initSubmitBtn) Required fields are missing!');
    return;
  }

  const toggleSubmit = () => {
    const nameIsPresent = nameField.value.trim().length > 0;
    const commentIsPresent = commentField.value.trim().length > 0;
    submitBtn.disabled = !(nameIsPresent && commentIsPresent);
  };

  // run once at startup
  toggleSubmit();

  // check on every keystroke
  nameField.addEventListener('input', toggleSubmit);
  commentField.addEventListener('input', toggleSubmit);
};

const initForm = () => {
  const form = document.querySelector<HTMLFormElement>('.comment-form');
  const nameField = document.querySelector<HTMLInputElement>('#name');
  const commentField = document.querySelector<HTMLInputElement>('#comment');
  const list = document.querySelector<HTMLUListElement>('.comment-container');

  if (!form || !nameField || !commentField || !list) {
    console.error('[comments.ts] (initForm) Required fields are missing!');
    return;
  }

  form.onsubmit = (e) => {
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
    } catch (err) {
      showError(
        toErrorMessage(err) || 'Could not add your comment. Please try again.'
      );
    }
  };
};
