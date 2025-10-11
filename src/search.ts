// =========================
// Public
// =========================

import { showError } from '@/utils'

export const initSearch = () => {
  try {
    const searchInput = document.querySelector<HTMLFormElement>('.search')
    const article = document.querySelector<HTMLElement>('article')
    if (!searchInput || !article) return

    searchInput.addEventListener('submit', e => {
      e.preventDefault()

      try {
        // remove previous highlights, but only inside <article>
        article.querySelectorAll('mark.highlight').forEach(el => {
          const parent = el.parentNode
          if (parent) {
            parent.replaceChild(document.createTextNode(el.textContent), el)
            parent.normalize()
          }
        })

        const searchKey = searchInput.q.value.trim()
        if (!searchKey) return

        const regex = new RegExp('(' + searchKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')

        // search only the <article> subtree
        const search = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as ChildNode
            if (textNode.nodeValue && regex.test(textNode.nodeValue)) {
              const span = document.createElement('span')
              span.innerHTML = textNode.nodeValue.replace(regex, '<mark class="highlight">$1</mark>')
              // replace text node with the new nodes
              textNode.replaceWith(...Array.from(span.childNodes))
            }
          } else if (
            node instanceof Element &&
            node.tagName !== 'SCRIPT' &&
            node.tagName !== 'STYLE' &&
            node.tagName !== 'FORM' &&
            node.tagName !== 'MARK' // don't recurse into existing highlights
          ) {
            // use a static array so live updates don't affect iteration
            // (node.childNodes is a live NodeList)
            Array.from(node.childNodes).forEach(search)
          }
        }

        search(article)
      } catch (err) {
        showError('Search failed. Please try again.')
      }
    })
  } catch (err) {
    showError('Search could not be initialized.')
  }
}
