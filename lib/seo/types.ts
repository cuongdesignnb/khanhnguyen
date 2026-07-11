export type BuildMetadataInput = {
  title?: string | null
  description?: string | null
  canonicalPath: string
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  robotsIndex?: boolean
  robotsFollow?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export type BreadcrumbItem = { label: string; url: string }
