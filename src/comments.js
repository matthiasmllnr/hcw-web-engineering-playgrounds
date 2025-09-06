// =========================
// Public
// =========================

export const initComments = () => {
  initToggleBtn()
  initSubmitBtn()
  initForm()
}

// =========================
// Private
// =========================

const initToggleBtn = () => {
  const showHideBtn = document.querySelector('.show-hide')
  const commentWrapper = document.querySelector('.comment-wrapper')

  commentWrapper.style.display = 'none'

  showHideBtn.onclick = () => {
    const showHideText = showHideBtn.textContent
    if (showHideText === 'Show comments') {
      showHideBtn.textContent = 'Hide comments'
      commentWrapper.style.display = 'block'
    } else {
      showHideBtn.textContent = 'Show comments'
      commentWrapper.style.display = 'none'
    }
  }
}

const initSubmitBtn = () => {
  const nameField = document.querySelector('#name')
  const commentField = document.querySelector('#comment')
  const submitBtn = document.querySelector('#submit-comment')

  const toggleSubmit = () => {
    const nameIsPresent = nameField.value.trim().length > 0
    const commentIsPresent = commentField.value.trim().length > 0
    submitBtn.disabled = !(nameIsPresent && commentIsPresent)
  }

  // run once at startup
  toggleSubmit()

  // check on every keystroke
  nameField.addEventListener('input', toggleSubmit)
  commentField.addEventListener('input', toggleSubmit)
}

const initForm = () => {
  const form = document.querySelector('.comment-form')
  const nameField = document.querySelector('#name')
  const commentField = document.querySelector('#comment')
  const list = document.querySelector('.comment-container')

  form.onsubmit = e => {
    e.preventDefault()

    const listItem = document.createElement('li')
    const namePara = document.createElement('p')
    const commentPara = document.createElement('p')
    const nameValue = nameField.value
    const commentValue = commentField.value

    namePara.textContent = nameValue
    commentPara.textContent = commentValue

    list.appendChild(listItem)
    listItem.appendChild(namePara)
    listItem.appendChild(commentPara)

    nameField.value = ''
    commentField.value = ''
  }
}
