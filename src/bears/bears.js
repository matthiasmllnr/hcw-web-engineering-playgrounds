import { imageExists, showError } from '../utils.js'
import { fetchImageUrl, fetchWikiEntries } from './api.js'

const IMAGE_PLACEHOLDER = '/media/no_image_placeholder.png'

// =========================
// Public
// =========================

export const initBears = async () => {
  try {
    const data = await fetchWikiEntries()
    await extractBears(data.parse.wikitext['*'])
  } catch (err) {
    showError(err.message || 'Failed to load bears. Please try again later.')
  }
}

// =========================
// Private
// =========================

const extractBears = async wikitext => {
  const speciesTables = wikitext.split('{{Species table/end}}')
  let rows = []
  speciesTables.forEach(table => {
    rows = rows.concat(table.split('{{Species table/row'))
  })

  const bearPromises = rows.map(async row => {
    const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/)
    const binomialMatch = row.match(/\|binomial=(.*?)\n/)
    const rangeMatch = row.match(/\|range=([^|\n]*)\s*\|range-image=([^|\n]*)/)
    const imageMatch = row.match(/\|image=(.*?)\n/)

    if (!(nameMatch && binomialMatch && imageMatch)) {
      return null
    }

    const fileName = imageMatch[1].trim().replace('File:', '')
    const rangeText = rangeMatch ? rangeMatch[1].trim() : 'Unknown'
    const rangeImageName = rangeMatch ? rangeMatch[2].trim().replace('File:', '') : null

    // Fetch both image URLs; if any request fails, we treat result as null and fallback later
    let imageUrlBear = null
    let imageUrlRange = null

    try {
      imageUrlBear = await fetchImageUrl(fileName)
    } catch {
      imageUrlBear = null
    }

    if (rangeImageName) {
      try {
        imageUrlRange = await fetchImageUrl(rangeImageName)
      } catch {
        imageUrlRange = null
      }
    }

    // Check image availability
    if (!(imageUrlBear && (await imageExists(imageUrlBear)))) {
      imageUrlBear = PLACEHOLDER_IMG
    }
    if (imageUrlRange && !(await imageExists(imageUrlRange))) {
      imageUrlRange = PLACEHOLDER_IMG
    }

    return {
      name: nameMatch[1],
      binomial: binomialMatch[1],
      image: imageUrlBear,
      rangeText,
      rangeImage: imageUrlRange,
    }
  })

  const items = await Promise.all(bearPromises)
  const bears = items.filter(Boolean)

  const moreBears = document.querySelector('.more_bears')
  bears.forEach(bear => {
    moreBears.appendChild(getBearEntryDiv(bear))
  })
}

const getBearEntryDiv = bear => {
  const div = document.createElement('div')
  div.className = 'bear'

  const imgBear = document.createElement('img')
  imgBear.src = bear.image || IMAGE_PLACEHOLDER
  imgBear.alt = bear.image ? `Image of ${bear.name}` : 'No Image'
  imgBear.style.width = '200px'
  imgBear.style.height = 'auto'
  div.appendChild(imgBear)

  const imgRange = document.createElement('img')
  imgRange.src = bear.rangeImage || IMAGE_PLACEHOLDER
  imgRange.alt = bear.rangeImage ? `Range: ${bear.rangeText}` : 'No Image'
  imgRange.style.width = '200px'
  imgRange.style.height = 'auto'
  div.appendChild(imgRange)

  const info = document.createElement('p')
  info.innerHTML = `<b>${bear.name}</b> (${bear.binomial})`
  div.appendChild(info)

  const range = document.createElement('p')
  range.textContent = `Range: ${bear.rangeText}`
  div.appendChild(range)

  return div
}
