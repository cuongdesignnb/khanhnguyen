import type { HomeVideoSource } from '@/types/home-video'

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'])
const FACEBOOK_HOSTS = new Set(['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.watch'])
const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/

export interface NormalizedVideoUrl {
  source: HomeVideoSource
  originalUrl: string
  embedUrl: string
  autoThumbnailUrl: string | null
  videoId: string | null
}

function youtubeVideoId(url: URL) {
  if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || null
  if (url.pathname === '/watch') return url.searchParams.get('v')
  const parts = url.pathname.split('/').filter(Boolean)
  if (['shorts', 'embed', 'live'].includes(parts[0] || '')) return parts[1] || null
  return null
}

function isFacebookVideoUrl(url: URL) {
  const path = url.pathname.toLowerCase()
  return url.hostname === 'fb.watch'
    ? path.length > 1
    : path.includes('/videos/') || path === '/watch' || path.startsWith('/watch/') || path.includes('/reel/') || path.startsWith('/reel/')
}

export function normalizeVideoUrl(value: unknown): NormalizedVideoUrl | null {
  if (typeof value !== 'string') return null
  const raw = value.trim()
  if (!raw || /[<>]/.test(raw) || /(?:iframe|script|javascript:|data:|file:)/i.test(raw)) return null

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  url.hostname = url.hostname.toLowerCase()

  if (YOUTUBE_HOSTS.has(url.hostname)) {
    const videoId = youtubeVideoId(url)
    if (!videoId || !YOUTUBE_ID.test(videoId)) return null
    return {
      source: 'youtube',
      originalUrl: url.toString(),
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      autoThumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
    }
  }

  if (FACEBOOK_HOSTS.has(url.hostname) && isFacebookVideoUrl(url)) {
    const originalUrl = url.toString()
    return {
      source: 'facebook',
      originalUrl,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=false&width=1100`,
      autoThumbnailUrl: null,
      videoId: null,
    }
  }
  return null
}

export function withVideoAutoplay(embedUrl: string) {
  const url = new URL(embedUrl)
  url.searchParams.set('autoplay', '1')
  if (url.hostname === 'www.youtube-nocookie.com') {
    url.searchParams.set('rel', '0')
    url.searchParams.set('modestbranding', '1')
  }
  return url.toString()
}
