'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function BlogTableOfContents({ selector }: { selector: string }) {
  const [toc, setToc] = useState<TocItem[]>([])

  useEffect(() => {
    const container = document.querySelector(selector)
    if (!container) return

    const headings = container.querySelectorAll('h2, h3')
    const items: TocItem[] = []

    headings.forEach((heading, idx) => {
      // Create ID if not exists
      const text = heading.textContent || ''
      const id = heading.id || `toc-heading-${idx}`
      heading.id = id

      items.push({
        id,
        text,
        level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3,
      })
    })

    setToc(items)
  }, [selector])

  if (toc.length === 0) {
    return (
      <p className="text-xs text-[color:var(--muted)] italic">
        Bài viết ngắn không có mục lục.
      </p>
    )
  }

  return (
    <nav className="text-xs space-y-2">
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
          className="block text-[color:var(--silver)] hover:text-[color:var(--gold)] hover:underline leading-relaxed font-medium transition-colors"
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
