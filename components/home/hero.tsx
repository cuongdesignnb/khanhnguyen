'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  type Transition,
} from 'motion/react';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const TRUST_CHIPS = [
  'Xe nâng chất lượng',
  'Hoạt động bền bỉ',
  'Bảo hành uy tín',
  'Giá tốt hỗ trợ tận tâm',
] as const;

const STAGGER_MS = 80;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getStaggerProps(
  index: number,
  skipAnimation: boolean,
): {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: Transition;
} {
  if (skipAnimation) {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: index * (STAGGER_MS / 1000),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const skip = !!shouldReduceMotion;

  return (
    <section
      className="relative h-[520px] overflow-hidden sm:h-[560px] lg:h-[600px]"
      aria-label="Hero"
    >
      {/* ---- Background image ---- */}
      <Image
        src="/images/seed/hero/industrial-yard.jpg"
        alt="Bãi xe nâng công nghiệp Khanh Nguyên với hàng chục xe nâng Nhật bãi sẵn sàng giao hàng"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* ---- Overlay layers ---- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/30"
      />

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-[650px]">
          {/* 1 · Eyebrow */}
          <motion.div {...getStaggerProps(0, skip)}>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--gold)]">
              KN
            </span>
          </motion.div>

          {/* 2 · H1 */}
          <motion.div {...getStaggerProps(1, skip)}>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              KHANH NGUYÊN
            </h1>
          </motion.div>

          {/* 3 · Display line */}
          <motion.div {...getStaggerProps(2, skip)}>
            <p className="mt-1 text-lg font-bold uppercase tracking-wide text-[color:var(--gold)] sm:text-xl lg:text-2xl">
              CHUYÊN MUA BÁN
            </p>
          </motion.div>

          {/* 4 · Supporting line */}
          <motion.div {...getStaggerProps(3, skip)}>
            <p className="mt-1 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-strong)] bg-clip-text text-2xl font-black uppercase italic text-transparent sm:text-3xl lg:text-4xl xl:text-5xl">
              XE NÂNG NHẬT BÃI
            </p>
          </motion.div>

          {/* 4b · Brand logos */}
          <motion.div {...getStaggerProps(4, skip)}>
            <div className="mt-3 flex items-center gap-3 sm:gap-4">
              {['KOMATSU', 'TOYOTA', 'MITSUBISHI', 'TCM'].map((brand) => (
                <span
                  key={brand}
                  className="rounded border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-white sm:text-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 5 · Trust chips */}
          <motion.div {...getStaggerProps(5, skip)}>
            <ul className="mt-5 flex flex-wrap gap-3 sm:gap-4">
              {TRUST_CHIPS.map((label) => (
                <li key={label} className="flex items-center gap-1.5">
                  <CheckCircle
                    className="size-4 shrink-0 text-[color:var(--gold)]"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-white sm:text-sm">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 6 · Address + Phone */}
          <motion.div {...getStaggerProps(6, skip)}>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <span className="flex items-center gap-1.5 text-xs text-white/80 sm:text-sm">
                <CheckCircle className="size-3.5 shrink-0 text-[color:var(--gold)]" aria-hidden="true" />
                QL1A, P. Bình Hưng Hòa, Q. Bình Tân, TP.HCM
              </span>
              <span className="text-lg font-black tracking-wide text-[color:var(--gold)] sm:text-xl">
                0903 385 225
              </span>
              <span className="text-lg font-black tracking-wide text-white sm:text-xl">
                0903 959 225
              </span>
            </div>
          </motion.div>

          {/* 7 · CTA buttons */}
          <motion.div {...getStaggerProps(7, skip)}>
            <div className="mt-6 flex gap-3 sm:mt-8 sm:gap-4">
              <a
                href="#san-pham-noi-bat"
                className="rounded-lg bg-[color:var(--gold)] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[color:var(--gold-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] sm:px-8 sm:py-3.5 sm:text-base"
              >
                XEM SẢN PHẨM
              </a>

              <a
                href="#lien-he"
                className="rounded-lg border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] sm:px-8 sm:py-3.5 sm:text-base"
              >
                NHẬN TƯ VẤN
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
