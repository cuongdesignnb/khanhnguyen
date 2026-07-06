import {
  HandCoins,
  BadgePercent,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { promoBenefits } from '@/data/home';

/* ------------------------------------------------------------------ */
/*  Icon Map                                                          */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, LucideIcon> = {
  HandCoins,
  BadgePercent,
  ShieldCheck,
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function PromoBanner() {
  return (
    <section
      className="border-y border-[color:var(--line-gold)] bg-[color:var(--surface-2)] py-10 lg:py-14"
      aria-label="Ưu đãi đặc biệt"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="text-xl font-extrabold uppercase text-white sm:text-2xl lg:text-3xl">
            ƯU ĐÃI ĐẶC BIỆT – HỖ TRỢ TỐI ĐA
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[color:var(--gold)]" />
        </div>

        {/* Benefit cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {promoBenefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];

            return (
              <div
                key={benefit.title}
                className="flex items-center gap-4 rounded-xl bg-[color:var(--surface-3)] p-5"
              >
                {Icon && (
                  <div className="flex shrink-0 items-center justify-center rounded-full bg-[color:var(--gold)]/10 p-2.5">
                    <Icon
                      className="size-10 text-[color:var(--gold)]"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{benefit.title}</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
