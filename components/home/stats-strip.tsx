'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'motion/react';
import { stats as staticStats } from '@/data/home';
import {
  Forklift,
  Users,
  Award,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion';

const iconMap: Record<string, LucideIcon> = {
  Forklift,
  Users,
  Award,
  MapPin,
};

function formatNumber(n: number): string {
  return n.toLocaleString('de-DE');
}

function useCountUp(
  target: number,
  isInView: boolean,
  skipAnimation: boolean,
  duration = 2000,
): number {
  const [current, setCurrent] = useState(() => (skipAnimation ? target : 0));
  const hasRun = useRef(skipAnimation);

  const animate = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (!hasRun.current && isInView) {
      animate();
    }
  }, [isInView, animate]);

  return current;
}

function StatCard({
  icon,
  value,
  suffix,
  label,
  isInView,
  skipAnimation,
}: {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  isInView: boolean;
  skipAnimation: boolean;
}) {
  const count = useCountUp(value, isInView, skipAnimation);
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {Icon && (
        <Icon
          size={32}
          className="mb-1 text-[color:var(--gold)]"
          aria-hidden="true"
        />
      )}
      <p className="text-3xl font-black text-[color:var(--gold)] lg:text-4xl xl:text-5xl">
        {formatNumber(count)}
        {suffix && (
          <span className="text-3xl font-black text-[color:var(--gold)] lg:text-4xl xl:text-5xl">
            {suffix}
          </span>
        )}
      </p>
      <p className="text-sm font-medium text-[color:var(--muted)]">{label}</p>
    </div>
  );
}

interface StatsStripProps {
  stats?: { value: number; suffix: string; label: string; icon: string }[]
}

export default function StatsStrip({ stats }: StatsStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const skip = useHydratedReducedMotion();
  const displayStats = stats && stats.length > 0 ? stats : staticStats

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/5 bg-[color:var(--surface-2)] py-10 lg:py-14"
      aria-label="Số liệu nổi bật"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {displayStats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              isInView={isInView}
              skipAnimation={skip}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
