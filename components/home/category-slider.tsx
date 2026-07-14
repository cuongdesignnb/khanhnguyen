"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Construction,
  Folder,
  Fuel,
  Hand,
  Headset,
  Settings,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  PublicCategory,
  PublicCategorySliderSettings,
} from "@/types/public";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import styles from "./category-slider.module.css";

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
};

type SliderStyle = CSSProperties & {
  "--category-desktop-items": number;
  "--category-laptop-items": number;
  "--category-tablet-items": number;
  "--category-mobile-items": number;
};

function useVisibleItems(settings: PublicCategorySliderSettings) {
  const [visibleItems, setVisibleItems] = useState(settings.desktopItems);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const laptop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 640px)");
    const update = () =>
      setVisibleItems(
        desktop.matches
          ? settings.desktopItems
          : laptop.matches
            ? settings.laptopItems
            : tablet.matches
              ? settings.tabletItems
              : settings.mobileItems,
      );

    update();
    desktop.addEventListener("change", update);
    laptop.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      laptop.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, [
    settings.desktopItems,
    settings.laptopItems,
    settings.mobileItems,
    settings.tabletItems,
  ]);

  return visibleItems;
}

export default function CategorySlider({
  categories,
  settings,
}: {
  categories: PublicCategory[];
  settings: PublicCategorySliderSettings;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const visibleItems = useVisibleItems(settings);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const maxIndex = Math.max(0, categories.length - visibleItems);
  const canSlide = settings.sliderEnabled && maxIndex > 0;
  const fitsViewport = maxIndex === 0;

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const next = useCallback(() => {
    setActive((current) => {
      if (current < maxIndex) return current + 1;
      return settings.loop ? 0 : Math.min(current, maxIndex);
    });
  }, [maxIndex, settings.loop]);

  const previous = useCallback(() => {
    setActive((current) => {
      const safeCurrent = Math.min(current, maxIndex);
      if (safeCurrent > 0) return safeCurrent - 1;
      return settings.loop ? maxIndex : safeCurrent;
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

  if (!settings.enabled || categories.length === 0) return null;

  const safeActive = Math.min(active, maxIndex);
  const sliderStyle: SliderStyle = {
    "--category-desktop-items": settings.desktopItems,
    "--category-laptop-items": settings.laptopItems,
    "--category-tablet-items": settings.tabletItems,
    "--category-mobile-items": settings.mobileItems,
  };
  const finishSwipe = (clientX: number) => {
    if (pointerStart.current === null || !canSlide) return;
    const distance = clientX - pointerStart.current;
    if (Math.abs(distance) >= 45) {
      swiped.current = true;
      if (distance > 0) previous();
      else next();
    }
    pointerStart.current = null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Danh mục sản phẩm"
      className="overflow-hidden bg-[color:var(--surface)] py-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 sm:px-6 lg:gap-3 lg:px-8">
        {canSlide && settings.showArrows && (
          <button
            type="button"
            aria-label="Danh mục trước"
            onClick={previous}
            className="hidden size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/55 text-white transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] lg:grid"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
        )}

        <div
          className={`${styles.viewport} ${!settings.sliderEnabled ? styles.manualViewport : ""} flex-1 touch-pan-y`}
          style={sliderStyle}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => finishSwipe(event.clientX)}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
          onClickCapture={(event) => {
            if (!swiped.current) return;
            event.preventDefault();
            swiped.current = false;
          }}
        >
          <motion.div
            className={`${styles.track} ${fitsViewport ? styles.staticTrack : ""} ${!settings.sliderEnabled ? styles.manualTrack : ""}`}
            animate={{
              x: canSlide ? `${(-safeActive * 100) / visibleItems}%` : "0%",
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.5,
              ease: "easeInOut",
            }}
          >
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Folder;
              return (
                <div key={category.id} className={styles.card}>
                  <Link
                    href={`/${category.slug}`}
                    aria-label={`Xem danh mục ${category.name}`}
                    className="group flex h-28 flex-col items-center justify-center gap-1.5 border-r border-white/10 px-2 text-center transition-colors hover:bg-white/[0.04] hover:outline hover:outline-1 hover:outline-inset hover:outline-[color:var(--gold)] focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[color:var(--gold)] sm:h-32 sm:px-3"
                  >
                    <Icon
                      aria-hidden
                      className="size-7 shrink-0 text-[color:var(--gold)] transition-transform duration-300 group-hover:-translate-y-1"
                    />
                    <span className="line-clamp-2 text-sm font-semibold leading-5 text-[color:var(--text)]">
                      {category.name}
                    </span>
                    <span className="line-clamp-1 text-xs text-[color:var(--muted)]">
                      {category.subtitle || "Xem ngay"}
                    </span>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>

        {canSlide && settings.showArrows && (
          <button
            type="button"
            aria-label="Danh mục tiếp theo"
            onClick={next}
            className="hidden size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/55 text-white transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] lg:grid"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        )}
      </div>
    </section>
  );
}
