import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes an HTML string to ensure safe rendering in public layouts.
 * Whitelists common formatting, media, link, and table elements.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'h2',
      'h3',
      'h4',
      'strong',
      'em',
      'u',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'br',
      'hr'
    ],
    ALLOWED_ATTR: [
      'href',
      'target',
      'rel',
      'src',
      'alt',
      'title',
      'width',
      'height',
      'class'
    ],
    ADD_ATTR: ['target', 'rel']
  })

  // Post-processing to enforce security on all anchor tags
  if (typeof window === 'undefined') {
    // Server-side parsing or simple regex if needed
    return clean.replace(/<a\s+([^>]*?)href=/gi, '<a $1 rel="noopener noreferrer nofollow" href=')
  } else {
    // Client-side DOM parsing to adjust rel tags accurately
    const parser = new DOMParser()
    const doc = parser.parseFromString(clean, 'text/html')
    const links = doc.querySelectorAll('a')
    links.forEach((link) => {
      const href = link.getAttribute('href')
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer nofollow')
      }
    })
    return doc.body.innerHTML
  }
}

export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return ''

  const textWithSpacing = html
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote|tr|td|th)>/gi, ' ')

  const sanitized = DOMPurify.sanitize(textWithSpacing, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    RETURN_DOM: true,
  })

  return (sanitized.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
