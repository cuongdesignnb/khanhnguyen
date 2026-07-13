export type HomeVideoSource = 'youtube' | 'facebook'

export interface HomeVideoSettingItem {
  id: string
  title: string
  source: HomeVideoSource
  url: string
  thumbnailId: string | null
  isEnabled: boolean
  sortOrder: number
}

export interface PublicHomeVideoItem {
  id: string
  title: string
  source: HomeVideoSource
  originalUrl: string
  embedUrl: string
  thumbnailUrl: string
}

export interface PublicHomeVideoSection {
  enabled: boolean
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  items: PublicHomeVideoItem[]
}
