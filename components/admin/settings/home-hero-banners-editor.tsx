"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  ImageIcon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import MediaPreviewPicker from "@/components/admin/media/media-preview-picker";
import { toast } from "@/lib/toast";
import { clampHeroOverlayOpacity } from "@/lib/hero/hero-overlay";

type BannerImage = { id: string; url: string; alt?: string | null };
type HeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageId: string | null;
  image: BannerImage | null;
  href: string | null;
  buttonText: string | null;
  position: "HOME_HERO";
  isVisible: boolean;
  sortOrder: number;
};
type HeroForm = Omit<HeroBanner, "id" | "position">;

const input =
  "w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";
const emptyForm: HeroForm = {
  title: "",
  subtitle: "",
  imageId: null,
  image: null,
  href: "",
  buttonText: "",
  isVisible: true,
  sortOrder: 0,
};

export default function HomeHeroBannersEditor({
  sliderEnabled,
  maxItems,
  overlayOpacity,
  transition,
  defaultTitle,
  defaultSubtitle,
  defaultCtaLabel,
  defaultCtaUrl,
  overlayContentEnabled,
  textEnabled,
  ctaEnabled,
}: {
  sliderEnabled: boolean;
  maxItems: number;
  overlayOpacity: number;
  transition: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultCtaLabel?: string;
  defaultCtaUrl?: string;
  overlayContentEnabled: boolean;
  textEnabled: boolean;
  ctaEnabled: boolean;
}) {
  const [items, setItems] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [showSavedContent, setShowSavedContent] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/banners?position=HOME_HERO", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      setItems(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải Hero Banner.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function open(item?: HeroBanner) {
    setShowSavedContent(overlayContentEnabled);
    setEditingId(item?.id || "new");
    setForm(
      item
        ? {
            title: item.title,
            subtitle: item.subtitle || "",
            imageId: item.imageId,
            image: item.image,
            href: item.href || "",
            buttonText: item.buttonText || "",
            isVisible: item.isVisible,
            sortOrder: item.sortOrder,
          }
        : { ...emptyForm, sortOrder: items.length },
    );
  }

  function payload(value: HeroForm) {
    return {
      title: value.title,
      subtitle: value.subtitle || null,
      imageId: value.imageId,
      href: value.href || null,
      buttonText: value.buttonText || null,
      position: "HOME_HERO",
      isVisible: value.isVisible,
      sortOrder: Math.max(0, Math.trunc(value.sortOrder || 0)),
    };
  }

  async function requestSave(
    url: string,
    method: "POST" | "PATCH",
    value: HeroForm,
  ) {
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload(value)),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  }

  async function save() {
    if (!form.imageId) return toast.error("Vui lòng chọn ảnh Hero Banner.");
    setSaving(true);
    try {
      const result = await requestSave(
        editingId === "new"
          ? "/api/admin/banners"
          : `/api/admin/banners/${editingId}`,
        editingId === "new" ? "POST" : "PATCH",
        form,
      );
      toast.success(result.message);
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu Hero Banner.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function patchItem(
    item: HeroBanner,
    patch: Partial<HeroForm>,
    message?: string,
  ) {
    try {
      await requestSave(`/api/admin/banners/${item.id}`, "PATCH", {
        title: item.title,
        subtitle: item.subtitle || "",
        imageId: item.imageId,
        image: item.image,
        href: item.href || "",
        buttonText: item.buttonText || "",
        isVisible: item.isVisible,
        sortOrder: item.sortOrder,
        ...patch,
      });
      if (message) toast.success(message);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật Hero Banner.",
      );
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setSaving(true);
    try {
      await Promise.all(
        reordered.map((item, sortOrder) =>
          requestSave(`/api/admin/banners/${item.id}`, "PATCH", {
            title: item.title,
            subtitle: item.subtitle || "",
            imageId: item.imageId,
            image: item.image,
            href: item.href || "",
            buttonText: item.buttonText || "",
            isVisible: item.isVisible,
            sortOrder,
          }),
        ),
      );
      toast.success("Đã thay đổi thứ tự Hero Banner.");
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể đổi thứ tự Banner.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function duplicate(item: HeroBanner) {
    try {
      await requestSave("/api/admin/banners", "POST", {
        title: item.title,
        subtitle: item.subtitle || "",
        imageId: item.imageId,
        image: item.image,
        href: item.href || "",
        buttonText: item.buttonText || "",
        isVisible: false,
        sortOrder: items.length,
      });
      toast.success("Đã nhân bản Banner ở trạng thái tắt.");
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể nhân bản Banner.",
      );
    }
  }

  async function remove(item: HeroBanner) {
    if (!confirm(`Xóa Hero Banner “${item.title || "Không có tiêu đề"}”?`))
      return;
    const result = await fetch(`/api/admin/banners/${item.id}`, {
      method: "DELETE",
    }).then((response) => response.json());
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    await load();
  }

  async function initialize() {
    setInitializing(true);
    try {
      const result = await fetch("/api/admin/banners/initialize-home-hero", {
        method: "POST",
      }).then((response) => response.json());
      if (!result.success) throw new Error(result.error);
      toast.success(result.message);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể khởi tạo Banner mẫu.",
      );
    } finally {
      setInitializing(false);
    }
  }

  const enabledCount = items.filter((item) => item.isVisible).length;
  const status = !sliderEnabled
    ? "Slider đang tắt. Website chỉ hiển thị Banner đầu tiên."
    : enabledCount === 0
      ? "Trang chủ đang dùng Banner dự phòng."
      : enabledCount === 1
        ? "Hero đang hiển thị dạng tĩnh. Cần ít nhất 2 Banner đang bật để Slider hoạt động."
        : `Hero Slider đang hoạt động với ${enabledCount} Banner.`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-white">Danh sách Hero Banner</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Thay đổi có hiệu lực ngay sau khi lưu, không cần triển khai lại
            source code.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/banners?position=HOME_HERO"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm"
          >
            <ExternalLink aria-hidden size={15} />
            Quản lý tất cả Banner
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm"
          >
            <ExternalLink aria-hidden size={15} />
            Xem Trang chủ
          </Link>
          <button
            type="button"
            onClick={() => open()}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black"
          >
            <Plus aria-hidden size={16} />
            Thêm Hero Banner
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/5 p-4 sm:p-5">
        <div className="flex gap-3">
          <ImageIcon
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-[color:var(--gold)]"
          />
          <div>
            <h4 className="font-black text-white">
              Kích thước ảnh Hero khuyến nghị
            </h4>
            <ul className="mt-2 grid gap-x-8 gap-y-1 text-sm leading-6 text-[color:var(--muted)] sm:grid-cols-2">
              <li>• Tốt nhất: 1920 × 800 px, tỷ lệ 12:5</li>
              <li>• Tối thiểu: 1600 × 667 px</li>
              <li>• Định dạng: WebP, AVIF hoặc JPG</li>
              <li>• Nên dưới 500 KB, tối đa 1 MB</li>
              <li className="sm:col-span-2">
                • Đặt nội dung quan trọng gần trung tâm vì hai bên có thể bị cắt
                trên mobile.
              </li>
              <li className="sm:col-span-2">
                • Không nên chèn chữ trực tiếp vào ảnh khi website đang bật Text
                trên Banner.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/5 p-4 text-sm">
        <p className="font-semibold text-[color:var(--gold)]">{status}</p>
        {enabledCount > maxItems && (
          <p className="mt-1 text-amber-200">
            Có {enabledCount} Banner đang bật nhưng Slider chỉ hiển thị tối đa{" "}
            {maxItems} Banner.
          </p>
        )}
      </div>

      {loading && (
        <div className="grid min-h-40 place-items-center text-sm text-[color:var(--muted)]">
          <RefreshCw className="mb-2 animate-spin" />
          Đang tải Hero Banner...
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center">
          <h4 className="text-lg font-black">Chưa có Hero Banner nào</h4>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Website đang sử dụng một Banner dự phòng nên Slider chưa thể chuyển
            ảnh. Hãy tạo ít nhất 2 Hero Banner để kích hoạt hiệu ứng Slider.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => open()}
              className="rounded-xl bg-[color:var(--gold)] px-4 py-2.5 text-sm font-bold text-black"
            >
              Thêm Hero Banner
            </button>
            <button
              type="button"
              disabled={initializing}
              onClick={initialize}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm disabled:opacity-50"
            >
              {initializing ? "Đang khởi tạo..." : "Khởi tạo Banner mẫu"}
            </button>
            <Link
              href="/admin/banners?position=HOME_HERO"
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm"
            >
              Mở quản lý tất cả Banner
            </Link>
          </div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">
            Chỉ thêm dữ liệu Hero mẫu, không ảnh hưởng dữ liệu khác.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <div className="relative aspect-[16/6] bg-black">
                {item.image?.url ? (
                  <Image
                    src={item.image.url}
                    alt={item.title || "Hero Banner"}
                    fill
                    sizes="(max-width:1280px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-red-300">
                    Ảnh không còn tồn tại
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[10px] font-black tracking-wide text-[color:var(--gold)]">
                  HERO TRANG CHỦ
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${item.isVisible ? "bg-emerald-500 text-black" : "bg-zinc-700 text-white"}`}
                >
                  {item.isVisible ? "Đang bật" : "Đang tắt"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black text-white">
                      {item.title || defaultTitle || "Tiêu đề mặc định"}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">
                      {item.subtitle || defaultSubtitle || "Phụ đề mặc định"}
                    </p>
                  </div>
                  <span className="rounded-lg border border-white/10 px-2 py-1 text-xs">
                    Thứ tự {item.sortOrder}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[color:var(--muted)]">
                  CTA: {item.buttonText || defaultCtaLabel || "—"} ·{" "}
                  {item.href || defaultCtaUrl || "—"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => open(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs"
                  >
                    <Pencil aria-hidden size={14} />
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicate(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs"
                  >
                    <Copy aria-hidden size={14} />
                    Nhân bản
                  </button>
                  <button
                    type="button"
                    disabled={saving || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Di chuyển lên"
                    className="grid size-9 place-items-center rounded-lg border border-white/10 disabled:opacity-30"
                  >
                    <ArrowUp aria-hidden size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={saving || index === items.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Di chuyển xuống"
                    className="grid size-9 place-items-center rounded-lg border border-white/10 disabled:opacity-30"
                  >
                    <ArrowDown aria-hidden size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      patchItem(
                        item,
                        { isVisible: !item.isVisible },
                        `Đã ${item.isVisible ? "tắt" : "bật"} Banner.`,
                      )
                    }
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                  >
                    {item.isVisible ? "Tắt" : "Bật"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"
                  >
                    <Trash2 aria-hidden size={14} />
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75">
          <div className="h-full w-full max-w-3xl overflow-y-auto bg-[color:var(--surface)] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">
                  {editingId === "new" ? "Thêm Hero Banner" : "Sửa Hero Banner"}
                </h3>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Vị trí được cố định là Hero Trang chủ.
                </p>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setEditingId(null)}
              >
                <X />
              </button>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <MediaPreviewPicker
                  value={form.imageId}
                  media={form.image}
                  label="Ảnh Hero Banner"
                  description="Khuyến nghị: 1920 × 800 px · Tỷ lệ 12:5 · WebP/JPG dưới 500 KB. Không lưu URL ảnh trực tiếp."
                  aspectRatio="wide"
                  recommendedSize="1920 × 800 px"
                  onChange={(imageId, media) =>
                    setForm((old) => ({
                      ...old,
                      imageId,
                      image: media as BannerImage | null,
                    }))
                  }
                />
                {!overlayContentEnabled && (
                  <div className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/5 p-4">
                    <p className="text-sm font-semibold text-[color:var(--gold)]">
                      Chế độ chỉ hiển thị ảnh đang bật.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                      Text và CTA không xuất hiện ngoài Trang chủ nhưng dữ liệu
                      vẫn được giữ.
                    </p>
                    <button
                      type="button"
                      aria-expanded={showSavedContent}
                      aria-controls="hero-banner-saved-content"
                      onClick={() => setShowSavedContent((current) => !current)}
                      className="mt-3 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white"
                    >
                      {showSavedContent
                        ? "Thu gọn nội dung đã lưu"
                        : "Mở nội dung đã lưu"}
                    </button>
                  </div>
                )}
                {(overlayContentEnabled || showSavedContent) && (
                  <div id="hero-banner-saved-content" className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Tiêu đề
                      </span>
                      <input
                        maxLength={180}
                        className={input}
                        value={form.title}
                        placeholder={defaultTitle}
                        onChange={(event) =>
                          setForm({ ...form, title: event.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        Phụ đề
                      </span>
                      <textarea
                        maxLength={240}
                        className={`${input} min-h-24`}
                        value={form.subtitle || ""}
                        placeholder={defaultSubtitle}
                        onChange={(event) =>
                          setForm({ ...form, subtitle: event.target.value })
                        }
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="mb-2 block text-sm font-semibold">
                          Nhãn CTA
                        </span>
                        <input
                          maxLength={80}
                          className={input}
                          value={form.buttonText || ""}
                          placeholder={defaultCtaLabel}
                          onChange={(event) =>
                            setForm({ ...form, buttonText: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="mb-2 block text-sm font-semibold">
                          URL CTA
                        </span>
                        <input
                          maxLength={500}
                          className={input}
                          value={form.href || ""}
                          placeholder={defaultCtaUrl}
                          onChange={(event) =>
                            setForm({ ...form, href: event.target.value })
                          }
                        />
                      </label>
                    </div>
                    {overlayContentEnabled && !textEnabled && (
                      <p className="text-xs text-[color:var(--muted)]">
                        Text đang tắt toàn cục; nội dung này được lưu để sử dụng
                        khi bật lại.
                      </p>
                    )}
                    {overlayContentEnabled && !ctaEnabled && (
                      <p className="text-xs text-[color:var(--muted)]">
                        CTA đang tắt toàn cục; nội dung này được lưu để sử dụng
                        khi bật lại.
                      </p>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <label>
                    <span className="mb-2 block text-sm font-semibold">
                      Thứ tự
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="9999"
                      className={`${input} w-28`}
                      value={form.sortOrder}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          sortOrder: Math.max(0, Number(event.target.value)),
                        })
                      }
                    />
                  </label>
                  <div>
                    <span className="mb-2 block text-sm font-semibold">
                      Trạng thái
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.isVisible}
                      onClick={() =>
                        setForm({ ...form, isVisible: !form.isVisible })
                      }
                      className={`relative h-7 w-12 rounded-full ${form.isVisible ? "bg-[color:var(--gold)]" : "bg-white/15"}`}
                    >
                      <span
                        className={`absolute top-1 size-5 rounded-full bg-white transition ${form.isVisible ? "left-6" : "left-1"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">
                  Xem trước · {transition}
                </p>
                <div className="relative aspect-[16/7] overflow-hidden rounded-2xl bg-black">
                  {form.image?.url && (
                    <Image
                      src={form.image.url}
                      alt="Xem trước Hero Banner"
                      fill
                      sizes="600px"
                      className="object-cover"
                    />
                  )}
                  {clampHeroOverlayOpacity(overlayOpacity) > 0 && (
                    <div
                      data-hero-overlay
                      className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"
                      style={{
                        opacity:
                          clampHeroOverlayOpacity(overlayOpacity) / 100,
                      }}
                    />
                  )}
                  {!overlayContentEnabled && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[color:var(--gold)]">
                      Chế độ chỉ hiển thị ảnh
                    </span>
                  )}
                  {overlayContentEnabled && (textEnabled || ctaEnabled) && (
                    <div className="absolute inset-0 flex items-center p-5 sm:p-8">
                      <div>
                        {textEnabled && (
                          <>
                            <p className="text-xs font-black uppercase tracking-widest text-[color:var(--gold)]">
                              {form.subtitle ||
                                defaultSubtitle ||
                                "Nhãn nhỏ mặc định"}
                            </p>
                            <p className="mt-2 text-xl font-black uppercase leading-tight text-white sm:text-3xl">
                              {form.title ||
                                defaultTitle ||
                                "Tiêu đề Hero mặc định"}
                            </p>
                          </>
                        )}
                        {ctaEnabled && (form.buttonText || defaultCtaLabel) && (
                          <span className="mt-4 inline-block rounded-lg bg-[color:var(--gold)] px-4 py-2 text-xs font-black text-black">
                            {form.buttonText || defaultCtaLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs leading-5 text-[color:var(--muted)]">
                  Để trống tiêu đề, phụ đề hoặc CTA để sử dụng nội dung mặc định
                  từ Cài đặt Trang chủ.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={saving || !form.imageId}
              onClick={save}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-5 py-3 font-bold text-black disabled:opacity-40"
            >
              <Save aria-hidden size={17} />
              {saving ? "Đang lưu..." : "Lưu Hero Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
