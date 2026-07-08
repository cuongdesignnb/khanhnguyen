'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { PublicServiceFAQ } from '@/types/public'

interface ServiceFAQProps {
  faqs: PublicServiceFAQ[]
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="space-y-3 mt-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx
        return (
          <div
            key={idx}
            className="border border-white/5 bg-[color:var(--surface)] rounded-lg overflow-hidden transition"
          >
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white hover:text-[color:var(--gold)] transition-colors focus:outline-none"
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={16}
                className={clsx(
                  'text-[color:var(--muted)] shrink-0 transition-transform duration-200 ml-3',
                  isOpen && 'rotate-180 text-[color:var(--gold)]'
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <div className="px-4 pb-4 text-xs text-[color:var(--silver)] leading-relaxed whitespace-pre-line border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
