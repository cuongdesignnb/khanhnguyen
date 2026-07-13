"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import type {
  PublicBanner,
  PublicHeroSettings,
  PublicSiteConfig,
} from "@/types/public";

const TRUST_CHIPS = [
  "Xe nâng chất lượng",
  "Hoạt động bền bỉ",
  "Bảo hành uy tín",
  "Giá tốt hỗ trợ tận tâm",
];

export default function Hero({
  slides,
  settings,
  siteConfig,
}: {
  slides: PublicBanner[];
  settings: PublicHeroSettings;
  siteConfig: PublicSiteConfig;
}) {
  const reducedMotion = useReducedMotion();
  const displaySlides = settings.sliderEnabled
    ? slides.slice(0, settings.maxItems)
    : slides.slice(0, 1);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const multiple = displaySlides.length > 1;
  const goTo = useCallback(
    (index: number) =>
      setActive((index + displaySlides.length) % displaySlides.length),
    [displaySlides.length],
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const previous = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (!multiple || !settings.autoplay || reducedMotion || paused) return;
    const timer = window.setInterval(next, settings.intervalMs);
    return () => window.clearInterval(timer);
  }, [
    multiple,
    next,
    paused,
    reducedMotion,
    settings.autoplay,
    settings.intervalMs,
  ]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!settings.enabled || displaySlides.length === 0) return null;
  const activeIndex = active % displaySlides.length;
  const slide = displaySlides[activeIndex];
  const title = slide.title || settings.title;
  const subtitle = slide.subtitle || settings.subtitle;
  const primaryLabel = slide.buttonText || settings.primaryCtaLabel;
  const primaryUrl = slide.href || settings.primaryCtaUrl;
  const showOverlayContent = settings.overlayContentEnabled;
  const showText = showOverlayContent && settings.textEnabled;
  const showCta = showOverlayContent && settings.ctaEnabled;
  const showPrimaryCta =
    showCta && Boolean(primaryLabel && primaryUrl && primaryUrl !== "#");
  const showSecondaryCta =
    showCta &&
    Boolean(
      settings.secondaryCtaLabel &&
      settings.secondaryCtaUrl &&
      settings.secondaryCtaUrl !== "#",
    );
  const imageInitial =
    settings.transition === "slide"
      ? { opacity: 0, x: 60 }
      : {
          opacity: 0,
          scale:
            settings.transition === "fade-zoom" && !reducedMotion ? 1 : 1.04,
        };
  const imageAnimate =
    settings.transition === "slide"
      ? { opacity: 1, x: 0 }
      : {
          opacity: 1,
          scale:
            settings.transition === "fade-zoom" && !reducedMotion ? 1.04 : 1,
        };

  function finishSwipe(clientX: number) {
    if (pointerStart.current === null) return;
    const distance = clientX - pointerStart.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) previous();
      else next();
    }
    pointerStart.current = null;
  }

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Banner Trang chủ"
      className="relative h-[520px] touch-pan-y overflow-hidden bg-black sm:h-[560px] lg:h-[600px]"
      onMouseEnter={() => {
        if (settings.pauseOnHover) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => finishSwipe(event.clientX)}
      onTouchStart={(event) => {
        pointerStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={imageInitial}
          animate={imageAnimate}
          exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.08 }}
          transition={{
            duration: reducedMotion ? 0.15 : 0.8,
            ease: "easeInOut",
          }}
        >
          <Image
            src={slide.image}
            alt={title}
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {showOverlayContent ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/10"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20"
            style={{
              backgroundColor: `rgb(0 0 0 / ${settings.overlayOpacity / 100})`,
            }}
          />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 bg-black/[0.06]" />
      )}

      {(showText || showCta) && (
        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              className="max-w-[720px]"
              initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.55 }}
            >
              {showText && (
                <>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[color:var(--gold)]">
                    {subtitle}
                  </p>
                  <h1 className="mt-3 text-3xl font-black uppercase leading-[1.08] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                    {title}
                  </h1>
                  {settings.description && (
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                      {settings.description}
                    </p>
                  )}
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {TRUST_CHIPS.map((label) => (
                      <li
                        key={label}
                        className="flex items-center gap-1.5 text-xs text-white sm:text-sm"
                      >
                        <CheckCircle
                          aria-hidden
                          className="size-4 text-[color:var(--gold)]"
                        />
                        {label}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-col gap-2 text-sm text-white/85 sm:flex-row sm:items-center sm:gap-6">
                    <span className="flex items-center gap-2">
                      <MapPin
                        aria-hidden
                        className="size-4 text-[color:var(--gold)]"
                      />
                      {siteConfig.showroom}
                    </span>
                    <a
                      href={`tel:${siteConfig.hotline.replace(/\D/g, "")}`}
                      className="flex items-center gap-2 font-black text-[color:var(--gold)]"
                    >
                      <Phone aria-hidden className="size-4" />
                      {siteConfig.hotline}
                    </a>
                    {siteConfig.secondaryHotline && (
                      <a
                        href={`tel:${siteConfig.secondaryHotline.replace(/\D/g, "")}`}
                        className="font-black text-white"
                      >
                        {siteConfig.secondaryHotline}
                      </a>
                    )}
                  </div>
                </>
              )}
              {(showPrimaryCta || showSecondaryCta) && (
                <div
                  className={
                    showText
                      ? "mt-7 flex flex-wrap gap-3"
                      : "flex flex-wrap gap-3"
                  }
                >
                  {showPrimaryCta && (
                    <a
                      href={primaryUrl}
                      className="rounded-xl bg-[color:var(--gold)] px-6 py-3 text-sm font-black uppercase text-black hover:bg-[color:var(--gold-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)]"
                    >
                      {primaryLabel}
                    </a>
                  )}
                  {showSecondaryCta && (
                    <a
                      href={settings.secondaryCtaUrl}
                      className="rounded-xl border border-white/40 px-6 py-3 text-sm font-black uppercase text-white hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                    >
                      {settings.secondaryCtaLabel}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {multiple && settings.showArrows && (
        <>
          <button
            type="button"
            aria-label="Banner trước"
            onClick={previous}
            className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
          >
            <ChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Banner tiếp theo"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
          >
            <ChevronRight aria-hidden />
          </button>
        </>
      )}
      {multiple && settings.showDots && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {displaySlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Chuyển đến banner số ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-[color:var(--gold)]" : "w-2.5 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
