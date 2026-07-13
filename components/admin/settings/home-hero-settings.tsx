"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ImageIcon, MousePointerClick, Type } from "lucide-react";

const input =
  "w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

type HeroSettingsValue = Record<string, unknown>;

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function SwitchRow({
  label,
  description,
  checked,
  controls,
  expanded,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  controls?: string;
  expanded?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        aria-controls={controls}
        aria-expanded={expanded}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full ${checked ? "bg-[color:var(--gold)]" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white transition-[left] ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

export default function HomeHeroSettings({
  value,
  update,
}: {
  value: HeroSettingsValue;
  update: (key: string, value: unknown) => void;
}) {
  const reducedMotion = useReducedMotion();
  const overlayEnabled = value.heroOverlayContentEnabled !== false;
  const textEnabled = value.heroTextEnabled !== false;
  const ctaEnabled = value.heroCtaEnabled !== false;
  const status = !overlayEnabled
    ? "Hero đang chạy ở chế độ trình chiếu ảnh, không có Text và CTA."
    : textEnabled && ctaEnabled
      ? "Hero đang hiển thị ảnh, Text và CTA."
      : textEnabled
        ? "Hero đang hiển thị ảnh và nội dung chữ."
        : ctaEnabled
          ? "Hero đang hiển thị ảnh và CTA, không có nội dung chữ."
          : "Hero đang chỉ hiển thị ảnh vì Text và CTA đều đang tắt.";
  const transition = {
    duration: reducedMotion ? 0 : 0.22,
    ease: "easeOut" as const,
  };

  return (
    <div className="space-y-4">
      <SwitchRow
        label="Bật Hero Trang chủ"
        description="Bật hoặc tắt toàn bộ khu vực Hero ngoài Trang chủ."
        checked={value.heroEnabled !== false}
        onChange={(checked) => update("heroEnabled", checked)}
      />
      <SwitchRow
        label="Hiển thị nội dung trên ảnh"
        description="Bật để hiển thị tiêu đề, mô tả và nút hành động trên Banner. Tắt để Hero chỉ trình chiếu ảnh."
        checked={overlayEnabled}
        controls="hero-overlay-settings"
        expanded={overlayEnabled}
        onChange={(checked) => update("heroOverlayContentEnabled", checked)}
      />
      <div
        role="status"
        className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/5 px-4 py-3 text-sm font-semibold text-[color:var(--gold)]"
      >
        {status}
      </div>

      {!overlayEnabled && (
        <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[color:var(--muted)]">
          Hero đang ở chế độ chỉ hiển thị ảnh. Tiêu đề, mô tả và CTA đã được ẩn
          ngoài website nhưng dữ liệu vẫn được giữ nguyên.
        </p>
      )}

      <AnimatePresence initial={false}>
        {overlayEnabled && (
          <motion.div
            id="hero-overlay-settings"
            key="overlay-settings"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1">
              <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Type
                    aria-hidden
                    className="size-5 text-[color:var(--gold)]"
                  />
                  <h3 className="font-black text-white">Text trên Banner</h3>
                </div>
                <SwitchRow
                  label="Hiển thị nội dung chữ"
                  description="Điều khiển nhãn nhỏ, tiêu đề và mô tả trên ảnh Hero."
                  checked={textEnabled}
                  controls="hero-text-settings"
                  expanded={textEnabled}
                  onChange={(checked) => update("heroTextEnabled", checked)}
                />
                <AnimatePresence initial={false}>
                  {textEnabled && (
                    <motion.div
                      id="hero-text-settings"
                      key="text-settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 pt-4 md:grid-cols-2">
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            Nhãn nhỏ mặc định
                          </span>
                          <input
                            className={input}
                            value={stringValue(value.heroSubtitle)}
                            onChange={(event) =>
                              update("heroSubtitle", event.target.value)
                            }
                          />
                        </label>
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            Tiêu đề mặc định
                          </span>
                          <input
                            className={input}
                            value={stringValue(value.heroTitle)}
                            onChange={(event) =>
                              update("heroTitle", event.target.value)
                            }
                          />
                        </label>
                        <label className="md:col-span-2">
                          <span className="mb-2 block text-sm font-semibold">
                            Mô tả mặc định
                          </span>
                          <textarea
                            className={`${input} min-h-24`}
                            value={stringValue(value.heroDescription)}
                            onChange={(event) =>
                              update("heroDescription", event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!textEnabled && (
                  <p className="mt-4 text-sm text-[color:var(--muted)]">
                    Nội dung Text đang bị ẩn. Ảnh Banner và CTA vẫn có thể hiển
                    thị.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MousePointerClick
                    aria-hidden
                    className="size-5 text-[color:var(--gold)]"
                  />
                  <h3 className="font-black text-white">Nút hành động CTA</h3>
                </div>
                <SwitchRow
                  label="Hiển thị nút hành động"
                  description="Điều khiển CTA chính, CTA phụ và CTA riêng của từng Banner."
                  checked={ctaEnabled}
                  controls="hero-cta-settings"
                  expanded={ctaEnabled}
                  onChange={(checked) => update("heroCtaEnabled", checked)}
                />
                <AnimatePresence initial={false}>
                  {ctaEnabled && (
                    <motion.div
                      id="hero-cta-settings"
                      key="cta-settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 pt-4 md:grid-cols-2">
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            Nhãn CTA chính
                          </span>
                          <input
                            className={input}
                            value={stringValue(value.heroPrimaryCtaLabel)}
                            onChange={(event) =>
                              update("heroPrimaryCtaLabel", event.target.value)
                            }
                          />
                        </label>
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            URL CTA chính
                          </span>
                          <input
                            type="url"
                            className={input}
                            value={stringValue(value.heroPrimaryCtaUrl)}
                            onChange={(event) =>
                              update("heroPrimaryCtaUrl", event.target.value)
                            }
                          />
                        </label>
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            Nhãn CTA phụ
                          </span>
                          <input
                            className={input}
                            value={stringValue(value.heroSecondaryCtaLabel)}
                            onChange={(event) =>
                              update(
                                "heroSecondaryCtaLabel",
                                event.target.value,
                              )
                            }
                          />
                        </label>
                        <label>
                          <span className="mb-2 block text-sm font-semibold">
                            URL CTA phụ
                          </span>
                          <input
                            type="url"
                            className={input}
                            value={stringValue(value.heroSecondaryCtaUrl)}
                            onChange={(event) =>
                              update("heroSecondaryCtaUrl", event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!ctaEnabled && (
                  <p className="mt-4 text-sm text-[color:var(--muted)]">
                    Các nút CTA đang bị ẩn nhưng nội dung đã nhập vẫn được lưu
                    giữ.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ImageIcon
                    aria-hidden
                    className="size-5 text-[color:var(--gold)]"
                  />
                  <h3 className="font-black text-white">Lớp phủ ảnh</h3>
                </div>
                <label>
                  <span className="mb-2 block text-sm font-semibold">
                    Độ tối overlay (%)
                  </span>
                  <input
                    className={input}
                    type="number"
                    min="0"
                    max="90"
                    value={
                      typeof value.heroSliderOverlayOpacity === "number"
                        ? value.heroSliderOverlayOpacity
                        : 70
                    }
                    onChange={(event) =>
                      update(
                        "heroSliderOverlayOpacity",
                        Number(event.target.value),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
