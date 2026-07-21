import prisma from '@/lib/prisma'

type RelatedPost = {
  title: string
  slug: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shuffle<T>(values: T[]) {
  return [...values].sort(() => Math.random() - 0.5)
}

function wordCount(html: string) {
  return html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
}

function replaceTextNode(html: string, target: string, replacement: string) {
  const matcher = new RegExp(escapeRegExp(target), 'i')
  const parts = html.split(/(<[^>]+>)/g)
  for (let index = 0; index < parts.length; index += 1) {
    if (parts[index].startsWith('<')) continue
    if (!matcher.test(parts[index])) continue
    parts[index] = parts[index].replace(matcher, replacement)
    return { html: parts.join(''), anchorText: target }
  }
  return null
}

function addLinkToParagraph(innerHtml: string, post: RelatedPost, keywords: string[], usedAnchors: Set<string>) {
  const candidates = shuffle([
    ...keywords.filter((keyword) => keyword.trim().length >= 3),
    post.title,
  ])
  const href = `/tin-tuc/${encodeURIComponent(post.slug)}`
  for (const candidate of candidates) {
    const normalized = candidate.trim().toLocaleLowerCase()
    if (!normalized || usedAnchors.has(normalized)) continue
    const link = `<a href="${href}">${escapeHtml(candidate.trim())}</a>`
    const replaced = replaceTextNode(innerHtml, candidate.trim(), link)
    if (replaced) return replaced
  }

  const fallbackAnchor = post.title.trim()
  const normalized = fallbackAnchor.toLocaleLowerCase()
  if (!fallbackAnchor || usedAnchors.has(normalized)) return null
  return {
    html: `${innerHtml} Đọc thêm: <a href="${href}">${escapeHtml(fallbackAnchor)}</a>.`,
    anchorText: fallbackAnchor,
  }
}

export function injectRelatedPostLinks(contentHtml: string, relatedPosts: RelatedPost[], focusKeywords: string[] = []) {
  if (!contentHtml.trim() || !relatedPosts.length) return contentHtml
  const paragraphs = [...contentHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
  if (!paragraphs.length) return contentHtml
  const linksToAdd = Math.min(3, relatedPosts.length, paragraphs.length, Math.max(1, Math.floor(wordCount(contentHtml) / 250)))
  const posts = shuffle(relatedPosts).slice(0, linksToAdd)
  const usedAnchors = new Set<string>()
  const targetParagraphs = posts.map((_, index) => Math.min(
    paragraphs.length - 1,
    Math.floor(((index + 1) * paragraphs.length) / (posts.length + 1)),
  ))
  let paragraphIndex = 0

  return contentHtml.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (full, attributes: string, innerHtml: string) => {
    const postIndex = targetParagraphs.indexOf(paragraphIndex)
    paragraphIndex += 1
    if (postIndex < 0) return full
    const result = addLinkToParagraph(innerHtml, posts[postIndex], focusKeywords, usedAnchors)
    if (!result) return full
    usedAnchors.add(result.anchorText.toLocaleLowerCase())
    return `<p${attributes}>${result.html}</p>`
  })
}

export async function addRelatedPostLinks(options: {
  contentHtml: string
  categoryId?: string | null
  focusKeywords?: string[]
}) {
  if (!options.categoryId) return options.contentHtml
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: options.categoryId,
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: { title: true, slug: true },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  })
  return injectRelatedPostLinks(options.contentHtml, relatedPosts, options.focusKeywords)
}
