import { sanitizeHtml } from '@/lib/sanitize-html'
import clsx from 'clsx'

interface RichContentProps {
  html: string | null | undefined
  className?: string
}

export default function RichContent({ html, className }: RichContentProps) {
  const sanitized = sanitizeHtml(html)

  if (!sanitized) return null

  return (
    <div
      className={clsx(
        'max-w-none text-sm sm:text-base text-[color:var(--silver)] leading-relaxed space-y-4',
        // Headings
        '[&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-wide',
        '[&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:uppercase',
        '[&_h4]:text-sm [&_h4]:sm:text-base [&_h4]:font-bold [&_h4]:text-white [&_h4]:mt-4 [&_h4]:mb-2',
        // Basic paragraph & formatting
        '[&_p]:mb-4 [&_p]:leading-relaxed',
        '[&_strong]:text-white [&_strong]:font-semibold',
        '[&_em]:italic',
        '[&_u]:underline',
        // Lists
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_ul_li]:text-[color:var(--silver)]',
        '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-4 [&_ol_li]:text-[color:var(--silver)]',
        // Links
        '[&_a]:text-[color:var(--gold)] [&_a]:hover:text-[color:var(--gold-strong)] [&_a]:hover:underline [&_a]:transition-colors [&_a]:font-medium',
        // Blockquotes
        '[&_blockquote]:border-l-2 [&_blockquote]:border-[color:var(--gold)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-[color:var(--muted)]',
        // Images
        '[&_img]:rounded-lg [&_img]:border [&_img]:border-white/10 [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto',
        // Tables (responsive wrapper support)
        '[&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:overflow-x-auto [&_table]:block [&_table]:lg:table',
        '[&_th]:border [&_th]:border-white/10 [&_th]:bg-[color:var(--surface-2)] [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:text-white [&_th]:uppercase [&_th]:tracking-wide',
        '[&_td]:border [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-2 [&_td]:text-xs [&_td]:text-[color:var(--silver)] [&_td]:bg-black/20',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
