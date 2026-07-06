import {
  Zap,
  Fuel,
  Hand,
  Construction,
  BatteryCharging,
  Settings,
  Wrench,
  Headset,
  type LucideIcon,
} from 'lucide-react';
import { categories } from '@/data/home';

/* ------------------------------------------------------------------ */
/*  Icon Map                                                          */
/* ------------------------------------------------------------------ */

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
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function CategoryGrid() {
  return (
    <section className="bg-[color:var(--surface)] py-4" aria-label="Danh mục sản phẩm">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Desktop: 8-column grid with dividers */}
        <div className="hidden lg:grid lg:grid-cols-8">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            const isLast = i === categories.length - 1;

            return (
              <a
                key={cat.id}
                href={cat.href}
                className={`group flex flex-col items-center gap-1.5 rounded-lg border border-transparent px-3 py-4 text-center transition-colors hover:border-[color:var(--line-gold)] hover:bg-[color:var(--surface-2)] ${
                  !isLast ? 'border-r border-r-white/10' : ''
                }`}
              >
                {Icon && (
                  <Icon
                    className="size-7 text-[color:var(--gold)] transition-transform group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm font-semibold text-[color:var(--text)]">
                  {cat.label}
                </span>
                <span className="text-xs text-[color:var(--muted)]">
                  {cat.subtitle}
                </span>
              </a>
            );
          })}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto scrollbar-hidden lg:hidden">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];

            return (
              <a
                key={cat.id}
                href={cat.href}
                className="group flex min-w-[120px] snap-start flex-col items-center gap-1.5 rounded-lg border border-transparent px-3 py-4 text-center transition-colors hover:border-[color:var(--line-gold)] hover:bg-[color:var(--surface-2)]"
              >
                {Icon && (
                  <Icon
                    className="size-7 text-[color:var(--gold)] transition-transform group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm font-semibold text-[color:var(--text)]">
                  {cat.label}
                </span>
                <span className="text-xs text-[color:var(--muted)]">
                  {cat.subtitle}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
