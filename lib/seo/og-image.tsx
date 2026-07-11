import { ImageResponse } from 'next/og'

export const ogSize = { width: 1200, height: 630 }

export function createOgImage(input: { title: string; subtitle?: string; image?: string | null; siteName?: string }) {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#080808', color: 'white', padding: 72, fontFamily: 'Arial, sans-serif' }}>
      {input.image && <img src={input.image} alt="" width="1200" height="630" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32 }} />}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'linear-gradient(90deg, rgba(0,0,0,.96), rgba(0,0,0,.42))' }} />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', color: '#f5b51b', fontSize: 30, fontWeight: 800 }}>{input.siteName || 'KHANH NGUYÊN FORKLIFT'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 930 }}>
          {input.subtitle && <div style={{ display: 'flex', color: '#f5b51b', fontSize: 28, fontWeight: 700 }}>{input.subtitle}</div>}
          <div style={{ display: 'flex', fontSize: input.title.length > 65 ? 54 : 68, fontWeight: 900, lineHeight: 1.12 }}>{input.title}</div>
        </div>
        <div style={{ display: 'flex', width: 150, height: 8, borderRadius: 8, background: '#f5b51b' }} />
      </div>
    </div>,
    ogSize,
  )
}
