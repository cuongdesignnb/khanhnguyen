import { brandNames } from '@/data/home';
import { SectionHeading } from '@/components/ui/section-heading';

export default function BrandStrip() {
  return (
    <section className="py-10 lg:py-14" aria-label="Thương hiệu nổi bật">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionHeading title="THƯƠNG HIỆU NỔI BẬT" />

        {/* Desktop: flex-wrap centered */}
        <div className="hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
          {brandNames.map((name) => (
            <span
              key={name}
              className="cursor-pointer whitespace-nowrap rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-6 py-3 text-sm font-bold text-[color:var(--silver)] transition-all hover:border-[color:var(--line-gold)] hover:text-[color:var(--gold)] sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Mobile: horizontal scroll with snap */}
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hidden sm:hidden">
          {brandNames.map((name) => (
            <span
              key={name}
              className="min-w-fit snap-start cursor-pointer whitespace-nowrap rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-6 py-3 text-sm font-bold text-[color:var(--silver)] transition-all hover:border-[color:var(--line-gold)] hover:text-[color:var(--gold)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
