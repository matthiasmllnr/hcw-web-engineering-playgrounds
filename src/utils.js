// =========================
// Public
// =========================

export const buildUrl = (base, params) => `${base}?${new URLSearchParams(params).toString()}`

export const fetchJson = async (url, context = 'request') => {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`)
    }
    return await res.json()
  } catch (err) {
    // Keep a useful message for developers
    console.error(`[${context}]`, err)
    // also rethrow for UI handling.
    throw new Error(`Failed to ${context}. Please try again later.`)
  }
}

export const imageExists = src =>
  new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })

export const showError = message => {
  const container = document.getElementById('error-messages')
  const target = container || document.querySelector('main') || document.body

  const box = document.createElement('div')
  box.setAttribute('role', 'alert')
  box.className = 'error-message'
  box.textContent = message

  target.appendChild(box)

  // auto-remove after 5 seconds
  setTimeout(() => {
    box.remove()
  }, 5000)
}
