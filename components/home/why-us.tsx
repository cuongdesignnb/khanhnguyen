import { valueProps } from '@/data/home';
import {
  ShieldCheck,
  ClipboardCheck,
  Shield,
  HandCoins,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  ClipboardCheck,
  Shield,
  HandCoins,
};

export default function WhyUs() {
  return (
    <section
      className="bg-[color:var(--surface)] py-14 lg:py-20"
      aria-label="Vì sao chọn chúng tôi"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* ── Section title ── */}
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="text-xl font-extrabold uppercase text-white sm:text-2xl lg:text-3xl">
            VÌ SAO CHỌN CHÚNG TÔI?
          </h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[color:var(--gold)]" />
        </div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {valueProps.map((prop) => {
            const Icon = iconMap[prop.icon];

            return (
              <div
                key={prop.title}
                className="rounded-xl border border-white/10 bg-[color:var(--surface-2)] p-6 text-center transition hover:border-[color:var(--line-gold)]"
              >
                {Icon && (
                  <Icon
                    size={36}
                    className="mx-auto mb-3 text-[color:var(--gold)]"
                    aria-hidden="true"
                  />
                )}
                <h3 className="text-sm font-semibold text-white lg:text-base">
                  {prop.title}
                </h3>
                <p className="mt-1 text-xs text-[color:var(--muted)] lg:text-sm">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
