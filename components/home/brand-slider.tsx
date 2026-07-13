"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  PublicBrand,
  PublicBrandSliderSettings,
} from "@/types/public";
import styles from "./brand-slider.module.css";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

type SliderStyle = CSSProperties & {
  "--brand-desktop-items": number;
  "--brand-tablet-items": number;
  "--brand-mobile-items": number;
};

function useVisibleItems(settings: PublicBrandSliderSettings) {
  const [visibleItems, setVisibleItems] = useState(settings.desktopItems);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const tablet = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setVisibleItems(
        desktop.matches
          ? settings.desktopItems
          : tablet.matches
            ? settings.tabletItems
            : settings.mobileItems,
      );
    update();
    desktop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, [settings.desktopItems, settings.mobileItems, settings.tabletItems]);

  return visibleItems;
}

function BrandLogo({ brand }: { brand: PublicBrand }) {
  const [failed, setFailed] = useState(false);
  if (!brand.logo || failed) {
    return (
      <span className="px-3 text-center text-base font-black uppercase tracking-wide text-[color:var(--silver)] sm:text-lg">
        {brand.name}
      </span>
    );
  }

  return (
    <Image
      src={brand.logo}
      alt={`Logo ${brand.name}`}
      fill
      sizes="(min-width: 1280px) 190px, (min-width: 768px) 25vw, 50vw"
      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:p-5"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandSlider({
  brands,
  settings,
}: {
  brands: PublicBrand[];
  settings: PublicBrandSliderSettings;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const visibleItems = useVisibleItems(settings);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const maxIndex = Math.max(0, brands.length - visibleItems);
  const canSlide = settings.sliderEnabled && maxIndex > 0;

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const next = useCallback(() => {
    setActive((current) => {
      if (current < maxIndex) return current + 1;
      return settings.loop ? 0 : current;
    });
  }, [maxIndex, settings.loop]);
  const previous = useCallback(() => {
    setActive((current) => {
      if (current > 0) return current - 1;
      return settings.loop ? maxIndex : current;
    });
  }, [maxIndex, settings.loop]);

  useEffect(() => {
    if (
      !canSlide ||
      !settings.autoplay ||
      reducedMotion ||
      hidden ||
      focused ||
      (settings.pauseOnHover && hovered)
    )
      return;
    const timer = window.setInterval(next, settings.intervalMs);
    return () => window.clearInterval(timer);
  }, [
    canSlide,
    focused,
    hidden,
    hovered,
    next,
    reducedMotion,
    settings.autoplay,
    settings.intervalMs,
    settings.pauseOnHover,
  ]);

  if (!settings.enabled || brands.length === 0) return null;
  const safeActive = Math.min(active, maxIndex);

  const sliderStyle: SliderStyle = {
    "--brand-desktop-items": settings.desktopItems,
    "--brand-tablet-items": settings.tabletItems,
    "--brand-mobile-items": settings.mobileItems,
  };
  const finishSwipe = (clientX: number) => {
    if (pointerStart.current === null || !canSlide) return;
    const distance = clientX - pointerStart.current;
    if (Math.abs(distance) >= 45) {
      if (distance > 0) previous();
      else next();
    }
    pointerStart.current = null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Thương hiệu nổi bật"
      className="py-10 lg:py-14"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header className="mb-7 text-center lg:mb-9">
          {settings.eyebrow && (
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[color:var(--gold)]">
              {settings.eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-xl font-extrabold uppercase text-[color:var(--text)] sm:text-2xl lg:text-3xl">
            {settings.title}
          </h2>
        </header>

        <div className="flex items-center gap-2 sm:gap-3">
          {canSlide && settings.showArrows && (
            <button
              type="button"
              aria-label="Thương hiệu trước"
              onClick={previous}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
          )}
          <div
            className={`${styles.slider} min-w-0 flex-1 touch-pan-y`}
            style={sliderStyle}
            onPointerDown={(event) => {
              pointerStart.current = event.clientX;
            }}
            onPointerUp={(event) => finishSwipe(event.clientX)}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            <motion.div
              className={`${styles.track} ${!canSlide ? styles.staticTrack : ""}`}
              animate={{ x: canSlide ? `${(-safeActive * 100) / visibleItems}%` : "0%" }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeInOut" }}
            >
              {brands.map((brand) => (
                <div key={brand.id} className={styles.card}>
                  <Link
                    href={`/san-pham?brand=${encodeURIComponent(brand.slug)}`}
                    aria-label={`Xem sản phẩm thương hiệu ${brand.name}`}
                    className="group flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-transparent transition duration-300 hover:border-[color:var(--gold)] sm:h-28"
                  >
                    <span className="relative block h-full w-full">
                      <BrandLogo key={`${brand.id}-${brand.logo || "text"}`} brand={brand} />
                    </span>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
          {canSlide && settings.showArrows && (
            <button
              type="button"
              aria-label="Thương hiệu tiếp theo"
              onClick={next}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/50 text-white transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
