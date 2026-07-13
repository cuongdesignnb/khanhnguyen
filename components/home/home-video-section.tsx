'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'
import HomeVideoModal from './home-video-modal'
import type { PublicHomeVideoItem, PublicHomeVideoSection as PublicHomeVideoSectionData } from '@/types/home-video'

export default function HomeVideoSection({ section }: { section: PublicHomeVideoSectionData }) {
  const [activeItem, setActiveItem] = useState<PublicHomeVideoItem | null>(null)
  const closeModal = useCallback(() => setActiveItem(null), [])
  if (!section.enabled || section.items.length === 0) return null

  const ctaIsExternal = /^https?:\/\//i.test(section.ctaUrl)
  const ctaClass = 'inline-flex min-h-11 items-center gap-2 rounded-xl border border-[color:var(--line-gold)] px-5 py-2.5 text-sm font-bold text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]'

  return (
    <>
      <section className="overflow-hidden bg-[#0b0b0b] py-14 lg:py-20" data-home-video-section>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {section.eyebrow && <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[color:var(--gold)] sm:text-sm">{section.eyebrow}</p>}
              <h2 className="text-2xl font-black uppercase leading-tight text-white sm:text-3xl lg:text-4xl">{section.title}</h2>
              {section.description && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">{section.description}</p>}
            </div>
            {section.ctaUrl && section.ctaLabel && (ctaIsExternal
              ? <a href={section.ctaUrl} target="_blank" rel="noopener noreferrer" className={ctaClass}>{section.ctaLabel}<ArrowUpRight aria-hidden size={17} /></a>
              : <Link href={section.ctaUrl} className={ctaClass}>{section.ctaLabel}<ArrowUpRight aria-hidden size={17} /></Link>)}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item)}
                aria-label={`Phát video: ${item.title}`}
                className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface-2)] text-left transition motion-safe:hover:-translate-y-1 hover:border-[color:var(--line-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
              >
                <span className="relative block aspect-video overflow-hidden bg-black">
                  <Image src={item.thumbnailUrl} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/20" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">{item.source === 'youtube' ? 'YouTube' : 'Facebook'}</span>
                  <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[color:var(--gold)] text-black shadow-xl transition motion-safe:group-hover:scale-110"><Play aria-hidden fill="currentColor" size={22} className="ml-0.5" /></span>
                </span>
                <span className="block min-h-[76px] p-4 text-base font-bold leading-6 text-white"><span className="line-clamp-2">{item.title}</span></span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {activeItem && <HomeVideoModal item={activeItem} onClose={closeModal} />}
    </>
  )
}
