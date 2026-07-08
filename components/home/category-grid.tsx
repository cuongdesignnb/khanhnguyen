import {
  Zap,
  Fuel,
  Hand,
  Construction,
  BatteryCharging,
  Settings,
  Wrench,
  Headset,
  Folder,
  type LucideIcon,
} from 'lucide-react'
import { categories as staticCategories } from '@/data/home'
import { PublicCategory } from '@/types/public'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Fuel,
  Hand,
  Crane: Construction,
  Construction,
  BatteryCharging,
  Settings,
  Wrench,
  Headset,
  Folder,
}

interface CategoryGridProps {
  categories?: PublicCategory[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const displayCategories: PublicCategory[] = categories && categories.length > 0
    ? categories
    : staticCategories.map((c) => ({
        id: c.id,
        name: c.label,
        slug: c.href.replace('/', ''),
        subtitle: c.subtitle,
        icon: c.icon,
      }))

  return (
    <section className="bg-[color:var(--surface)] py-4" aria-label="Danh mục sản phẩm">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Desktop: 8-column grid with dividers */}
        <div className="hidden lg:grid lg:grid-cols-8">
          {displayCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Folder
            const isLast = i === displayCategories.length - 1

            return (
              <a
                key={cat.id}
                href={`/${cat.slug}`}
                className={`group flex flex-col items-center gap-1.5 rounded-lg border border-transparent px-3 py-4 text-center transition-colors hover:border-[color:var(--line-gold)] hover:bg-[color:var(--surface-2)] ${
                  !isLast ? 'border-r border-r-white/10' : ''
                }`}
              >
                <Icon
                  className="size-7 text-[color:var(--gold)] transition-transform group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[color:var(--text)]">
                  {cat.name}
                </span>
                <span className="text-xs text-[color:var(--muted)]">
                  {cat.subtitle}
                </span>
              </a>
            )
          })}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto scrollbar-hidden lg:hidden">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Folder

            return (
              <a
                key={cat.id}
                href={`/${cat.slug}`}
                className="group flex min-w-[120px] snap-start flex-col items-center gap-1.5 rounded-lg border border-transparent px-3 py-4 text-center transition-colors hover:border-[color:var(--line-gold)] hover:bg-[color:var(--surface-2)]"
              >
                <Icon
                  className="size-7 text-[color:var(--gold)] transition-transform group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[color:var(--text)]">
                  {cat.name}
                </span>
                <span className="text-xs text-[color:var(--muted)]">
                  {cat.subtitle}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
