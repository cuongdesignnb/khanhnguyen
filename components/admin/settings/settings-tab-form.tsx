"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import type {
  SettingFieldDefinition,
  SettingsTabDefinition,
} from "@/types/settings";
import MediaPreviewPicker from "@/components/admin/media/media-preview-picker";
import GoogleSearchPreview from "@/components/admin/seo/google-search-preview";
import SeoSocialPreview from "@/components/admin/seo/seo-social-preview";
import SettingsColorPicker from "./settings-color-picker";
import HeaderUtilityItemsEditor from "./header-utility-items-editor";
import ProductSpecPriorityEditor from "./product-spec-priority-editor";
import HomeVideosEditor from "./home-videos-editor";
import HomeHeroBannersEditor from "./home-hero-banners-editor";
import HomeHeroSettings from "./home-hero-settings";
import type { HomeVideoSettingItem } from "@/types/home-video";
import type { HeaderUtilityItem } from "@/types/header-settings";
import { clampHeroOverlayOpacity } from "@/lib/hero/hero-overlay";

const input =
  "w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

export default function SettingsTabForm({
  tab,
}: {
  tab: SettingsTabDefinition;
}) {
  const [value, setValue] = useState<Record<string, unknown>>({});
  const [original, setOriginal] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(original),
    [value, original],
  );
  const update = (key: string, nextValue: unknown) =>
    setValue((old) => ({ ...old, [key]: nextValue }));

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        fetch(`/api/admin/settings/${encodeURIComponent(tab.group)}`)
          .then((response) => response.json())
          .then((result) => {
            if (!result.success) throw Error(result.error);
            setValue(result.data);
            setOriginal(result.data);
          })
          .catch((error) => toast.error(error.message))
          .finally(() => setLoading(false)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [tab.group]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    addEventListener("beforeunload", handleBeforeUnload);
    return () => removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  async function save() {
    setSaving(true);
    const response = await fetch(
      `/api/admin/settings/${encodeURIComponent(tab.group)}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value }),
      },
    );
    const result = await response.json();
    setSaving(false);
    if (result.success) {
      setOriginal(value);
      toast.success("Đã lưu cài đặt");
    } else toast.error(result.error);
  }

  async function reset() {
    if (
      !confirm(
        "Thao tác này sẽ thay thế cấu hình hiện tại bằng dữ liệu mặc định. Bạn có chắc chắn?",
      )
    )
      return;
    const result = await fetch("/api/admin/settings/reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ group: tab.group }),
    }).then((response) => response.json());
    if (result.success) {
      setValue(result.data);
      setOriginal(result.data);
      toast.success("Đã khôi phục mặc định");
    } else toast.error(result.error);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{tab.title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-[color:var(--muted)]">
            {tab.description}
          </p>
        </div>
        {tab.previewUrl && (
          <Link
            target="_blank"
            href={tab.previewUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"
          >
            <ExternalLink size={15} />
            Xem ngoài website
          </Link>
        )}
      </header>
      <section className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5 md:p-6">
        {loading ? (
          <p>Đang tải cài đặt...</p>
        ) : (
          <>
            {tab.slug === "trang-chu" ? (
              <HomeSettingsGroups
                fields={tab.fields}
                value={value}
                update={update}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {tab.fields.map((field) => (
                  <Field
                    key={field.key}
                    field={field}
                    value={value[field.key]}
                    update={(nextValue) => update(field.key, nextValue)}
                  />
                ))}
              </div>
            )}
            {tab.slug === "dau-trang" && (
              <div className="mt-6 space-y-4">
                <HeaderUtilityItemsEditor
                  label="Top Header bên trái"
                  value={
                    Array.isArray(value.utilityLeft)
                      ? (value.utilityLeft as HeaderUtilityItem[])
                      : []
                  }
                  onChange={(nextValue) => update("utilityLeft", nextValue)}
                />
                <HeaderUtilityItemsEditor
                  label="Top Header bên phải"
                  value={
                    Array.isArray(value.utilityRight)
                      ? (value.utilityRight as HeaderUtilityItem[])
                      : []
                  }
                  onChange={(nextValue) => update("utilityRight", nextValue)}
                />
              </div>
            )}
            {tab.slug === "seo" && (
              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div>
                  <h2 className="mb-3 font-bold">Xem trước trên Google</h2>
                  <GoogleSearchPreview
                    siteName={
                      typeof value.siteName === "string"
                        ? value.siteName
                        : "Khanh Nguyên"
                    }
                    url={
                      typeof value.siteUrl === "string"
                        ? value.siteUrl
                        : "https://khanhnguyen.vn"
                    }
                    title={
                      typeof value.defaultTitle === "string"
                        ? value.defaultTitle
                        : ""
                    }
                    description={
                      typeof value.defaultDescription === "string"
                        ? value.defaultDescription
                        : ""
                    }
                  />
                </div>
                <div>
                  <h2 className="mb-3 font-bold">
                    Xem trước chia sẻ mạng xã hội
                  </h2>
                  <SeoSocialPreview
                    title={
                      typeof value.defaultTitle === "string"
                        ? value.defaultTitle
                        : ""
                    }
                    description={
                      typeof value.defaultDescription === "string"
                        ? value.defaultDescription
                        : ""
                    }
                  />
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <div className="sticky bottom-3 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur">
        <span className="mr-auto text-sm text-[color:var(--muted)]">
          {dirty ? "Thay đổi chưa được lưu" : "Mọi thay đổi đã được lưu"}
        </span>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm"
        >
          <RotateCcw size={15} />
          Khôi phục mặc định
        </button>
        {dirty && (
          <button
            onClick={() => setValue(original)}
            className="px-3 py-2 text-sm"
          >
            Hủy thay đổi
          </button>
        )}
        <button
          disabled={!dirty || saving}
          onClick={save}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
        >
          <Save size={15} />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}

const heroContentKeys = [
  "heroEnabled",
  "heroOverlayContentEnabled",
  "heroTextEnabled",
  "heroCtaEnabled",
  "heroTitle",
  "heroSubtitle",
  "heroDescription",
  "heroPrimaryCtaLabel",
  "heroPrimaryCtaUrl",
  "heroSecondaryCtaLabel",
  "heroSecondaryCtaUrl",
  "heroSliderOverlayOpacity",
];
const heroSliderKeys = [
  "heroSliderEnabled",
  "heroSliderAutoplay",
  "heroSliderIntervalMs",
  "heroSliderTransition",
  "heroSliderPauseOnHover",
  "heroSliderShowArrows",
  "heroSliderShowDots",
  "heroSliderMaxItems",
];
const productKeys = [
  "featuredProductsEnabled",
  "featuredProductsTitle",
  "featuredProductsLimit",
  "categoryProductSectionsEnabled",
  "categoryProductLimit",
];
const videoKeys = [
  "videoSectionEnabled",
  "videoSectionEyebrow",
  "videoSectionTitle",
  "videoSectionDescription",
  "videoSectionLimit",
  "videoSectionCtaLabel",
  "videoSectionCtaUrl",
  "videoItems",
];
const brandSliderKeys = [
  "brandsEnabled",
  "brandSectionEyebrow",
  "brandSectionTitle",
  "brandSliderEnabled",
  "brandSliderAutoplay",
  "brandSliderIntervalMs",
  "brandSliderPauseOnHover",
  "brandSliderShowArrows",
  "brandSliderLoop",
  "brandSliderDesktopItems",
  "brandSliderTabletItems",
  "brandSliderMobileItems",
  "brandSliderMaxItems",
];

function HomeSettingsGroups({
  fields,
  value,
  update,
}: {
  fields: SettingsTabDefinition["fields"];
  value: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
}) {
  const knownKeys = new Set([
    ...heroContentKeys,
    ...heroSliderKeys,
    ...productKeys,
    ...videoKeys,
    ...brandSliderKeys,
    "heroImageId",
  ]);
  const remainingKeys = fields
    .filter((field) => !knownKeys.has(field.key))
    .map((field) => field.key);
  const renderFields = (keys: string[]) => (
    <div className="grid gap-5 md:grid-cols-2">
      {keys
        .map((key) => fields.find((field) => field.key === key))
        .filter((field): field is SettingFieldDefinition => Boolean(field))
        .map((field) => (
          <Field
            key={field.key}
            field={field}
            value={value[field.key]}
            update={(nextValue) => update(field.key, nextValue)}
          />
        ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <SettingsGroup
        title="Nội dung trên ảnh Hero"
        description="Chọn chế độ chỉ ảnh, ảnh kèm Text, CTA hoặc hiển thị đầy đủ. Dữ liệu đã nhập không bị xóa khi tắt."
      >
        <HomeHeroSettings value={value} update={update} />
      </SettingsGroup>
      <SettingsGroup
        title="Hiệu ứng Hero Slider"
        description="Điều khiển cách các Hero Banner chuyển đổi và hiển thị ngoài Trang chủ."
      >
        {renderFields(heroSliderKeys)}
      </SettingsGroup>
      <SettingsGroup
        title="Danh sách Hero Banner"
        description="Quản lý nội dung từng slide trực tiếp, độc lập với nút Lưu cài đặt phía dưới."
      >
        <HomeHeroBannersEditor
          sliderEnabled={value.heroSliderEnabled !== false}
          maxItems={Math.min(
            8,
            Math.max(1, Number(value.heroSliderMaxItems) || 8),
          )}
          overlayOpacity={clampHeroOverlayOpacity(
            value.heroSliderOverlayOpacity,
          )}
          transition={String(value.heroSliderTransition || "fade-zoom")}
          overlayContentEnabled={value.heroOverlayContentEnabled !== false}
          textEnabled={value.heroTextEnabled !== false}
          ctaEnabled={value.heroCtaEnabled !== false}
          defaultTitle={
            typeof value.heroTitle === "string" ? value.heroTitle : undefined
          }
          defaultSubtitle={
            typeof value.heroSubtitle === "string"
              ? value.heroSubtitle
              : undefined
          }
          defaultCtaLabel={
            typeof value.heroPrimaryCtaLabel === "string"
              ? value.heroPrimaryCtaLabel
              : undefined
          }
          defaultCtaUrl={
            typeof value.heroPrimaryCtaUrl === "string"
              ? value.heroPrimaryCtaUrl
              : undefined
          }
        />
      </SettingsGroup>
      <SettingsGroup
        title="Sản phẩm Trang chủ"
        description="Cấu hình sản phẩm nổi bật và các section sản phẩm theo danh mục."
      >
        {renderFields(productKeys)}
      </SettingsGroup>
      <SettingsGroup
        title="Slider thương hiệu"
        description="Nội dung và logo được lấy từ Quản lý thương hiệu. Chỉ thương hiệu đang bật hiển thị mới xuất hiện ngoài Trang chủ."
      >
        {renderFields(brandSliderKeys)}
        <Link
          href="/admin/brands"
          className="mt-5 inline-flex rounded-xl border border-[color:var(--gold)]/35 px-4 py-2 text-sm font-bold text-[color:var(--gold)]"
        >
          Quản lý thương hiệu
        </Link>
      </SettingsGroup>
      <SettingsGroup
        title="Video Trang chủ"
        description="Quản lý nội dung và danh sách video YouTube/Facebook. Không có video thì section ngoài website tự ẩn."
      >
        {renderFields(videoKeys)}
      </SettingsGroup>
      {remainingKeys.length > 0 && (
        <SettingsGroup
          title="Các section còn lại"
          description="Danh mục, thống kê, dịch vụ, đánh giá và tin tức trên Trang chủ."
        >
          {renderFields(remainingKeys)}
        </SettingsGroup>
      )}
      {typeof value.heroImageId === "string" && value.heroImageId && (
        <p className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-[color:var(--muted)]">
          Ảnh Hero cũ vẫn được giữ để tương thích và chỉ dùng làm dự phòng khi
          chưa có Hero Banner. Hãy quản lý slide trong “Danh sách Hero Banner”.
        </p>
      )}
    </div>
  );
}

function SettingsGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details
      open
      className="group rounded-2xl border border-white/10 bg-black/15"
    >
      <summary className="cursor-pointer list-none px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-black text-white">{title}</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {description}
            </p>
          </div>
          <span
            aria-hidden
            className="text-lg text-[color:var(--gold)] transition group-open:rotate-45"
          >
            +
          </span>
        </div>
      </summary>
      <div className="border-t border-white/10 p-5 sm:p-6">{children}</div>
    </details>
  );
}

function Field({
  field,
  value,
  update,
}: {
  field: SettingFieldDefinition;
  value: unknown;
  update: (value: unknown) => void;
}) {
  if (field.type === "color")
    return (
      <SettingsColorPicker
        label={field.label}
        description={field.description}
        value={typeof value === "string" ? value : "#F5B51B"}
        onChange={update}
      />
    );
  if (field.type === "media")
    return (
      <div className="md:col-span-2">
        <MediaPreviewPicker
          value={typeof value === "string" ? value : null}
          label={field.label}
          description={field.description}
          aspectRatio={
            /logo/i.test(field.key)
              ? "logo"
              : /favicon/i.test(field.key)
                ? "favicon"
                : /og/i.test(field.key)
                  ? "video"
                  : "wide"
          }
          onChange={update}
        />
      </div>
    );
  if (field.type === "product-spec-priority")
    return (
      <ProductSpecPriorityEditor
        value={Array.isArray(value) ? value : []}
        onChange={update}
      />
    );
  if (field.type === "home-videos")
    return (
      <HomeVideosEditor
        value={Array.isArray(value) ? (value as HomeVideoSettingItem[]) : []}
        onChange={update}
      />
    );

  return (
    <div
      className={
        field.type === "textarea" || field.type === "repeater"
          ? "md:col-span-2"
          : ""
      }
    >
      <label className="mb-2 block text-sm font-semibold">{field.label}</label>
      {field.type === "switch" ? (
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => update(!value)}
          className={`relative h-7 w-12 rounded-full ${value ? "bg-[color:var(--gold)]" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white transition ${value ? "left-6" : "left-1"}`}
          />
        </button>
      ) : field.type === "textarea" ? (
        <textarea
          className={`${input} min-h-28`}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => update(event.target.value)}
        />
      ) : field.type === "number" ? (
        <input
          className={input}
          type="number"
          min={field.min}
          max={field.max}
          value={typeof value === "number" ? value : 0}
          onChange={(event) => update(Number(event.target.value))}
        />
      ) : field.type === "select" ? (
        <select
          className={input}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => update(event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "repeater" ? (
        <Repeater value={Array.isArray(value) ? value : []} onChange={update} />
      ) : (
        <input
          className={input}
          type={field.type === "url" ? "url" : "text"}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => update(event.target.value)}
        />
      )}
    </div>
  );
}

type RepeaterItem = {
  label?: string;
  title?: string;
  url?: string;
  isEnabled?: boolean;
};

function Repeater({
  value,
  onChange,
}: {
  value: RepeaterItem[];
  onChange: (value: RepeaterItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() =>
          onChange([...value, { label: "", url: "/", isEnabled: true }])
        }
        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"
      >
        <Plus size={14} />
        Thêm mục
      </button>
      {value.map((item, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            className={input}
            placeholder="Tên hiển thị"
            value={item.label || item.title || ""}
            onChange={(event) =>
              onChange(
                value.map((entry, entryIndex) =>
                  entryIndex === index
                    ? { ...entry, label: event.target.value }
                    : entry,
                ),
              )
            }
          />
          <input
            className={input}
            placeholder="Liên kết"
            value={item.url || ""}
            onChange={(event) =>
              onChange(
                value.map((entry, entryIndex) =>
                  entryIndex === index
                    ? { ...entry, url: event.target.value }
                    : entry,
                ),
              )
            }
          />
          <button
            aria-label="Xóa mục"
            onClick={() =>
              onChange(value.filter((_, entryIndex) => entryIndex !== index))
            }
            className="px-3 text-red-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
