"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/admin/admin-page-header";
import MediaPreviewPicker from "@/components/admin/media/media-preview-picker";
import { toast } from "@/lib/toast";

type Position = "HOME_HERO" | "HOME_PROMO" | "CATEGORY" | "POPUP" | "FOOTER";
type BannerItem = {
  id: string;
  title: string;
  subtitle: string | null;
  imageId: string | null;
  image: { url: string } | null;
  href: string | null;
  buttonText: string | null;
  position: Position;
  isVisible: boolean;
  sortOrder: number;
};
const emptyBanner: Omit<BannerItem, "id" | "image"> = {
  title: "",
  subtitle: "",
  imageId: null,
  href: "",
  buttonText: "",
  position: "HOME_HERO",
  isVisible: true,
  sortOrder: 0,
};
const input =
  "w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";
const positionLabels: Record<Position, string> = {
  HOME_HERO: "Hero Trang chủ",
  HOME_PROMO: "Khuyến mãi Trang chủ",
  CATEGORY: "Banner danh mục",
  POPUP: "Popup",
  FOOTER: "Chân trang",
};

export default function BannerAdminPage({ initialPosition = "" }: { initialPosition?: Position | "" }) {
  const [items, setItems] = useState<BannerItem[]>([]);
  const [filter, setFilter] = useState<Position | "">(initialPosition);
  const [editing, setEditing] = useState<BannerItem | null | "new">(null);
  const [form, setForm] = useState(emptyBanner);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/banners${filter ? `?position=${filter}` : ""}`,
      );
      const result = await response.json();
      if (!result.success) throw Error(result.error);
      setItems(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải Banner",
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/banners${filter ? `?position=${filter}` : ""}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return;
        if (!result.success) throw Error(result.error);
        setItems(result.data);
      })
      .catch((error) => {
        if (!cancelled)
          toast.error(
            error instanceof Error ? error.message : "Không thể tải Banner",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);
  function open(item?: BannerItem) {
    setEditing(item || "new");
    setForm(
      item
        ? {
            title: item.title,
            subtitle: item.subtitle || "",
            imageId: item.imageId,
            href: item.href || "",
            buttonText: item.buttonText || "",
            position: item.position,
            isVisible: item.isVisible,
            sortOrder: item.sortOrder,
          }
        : emptyBanner,
    );
  }
  async function save() {
    setSaving(true);
    try {
      const url =
        editing === "new"
          ? "/api/admin/banners"
          : `/api/admin/banners/${editing?.id}`;
      const response = await fetch(url, {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!result.success) throw Error(result.error);
      toast.success(result.message);
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu Banner",
      );
    } finally {
      setSaving(false);
    }
  }
  async function remove(id: string) {
    if (!confirm("Xóa mềm Banner này?")) return;
    const result = await fetch(`/api/admin/banners/${id}`, {
      method: "DELETE",
    }).then((response) => response.json());
    if (result.success) {
      toast.success(result.message);
      void load();
    } else toast.error(result.error);
  }
  return (
    <div>
      <AdminPageHeader
        title="Quản lý Banner"
        breadcrumbs={[
          { label: "Trang chủ", href: "/admin" },
          { label: "Banner" },
        ]}
        actions={
          <button
            onClick={() => open()}
            className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-4 py-2.5 text-sm font-bold text-black"
          >
            <Plus size={16} />
            Thêm Banner
          </button>
        }
      />
      <div className="mb-4 flex gap-3">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as Position | "")}
          className={input}
        >
          <option value="">Tất cả vị trí</option>
          {(Object.keys(positionLabels) as Position[]).map(
            (position) => (
              <option key={position} value={position}>{positionLabels[position]}</option>
            ),
          )}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase text-[color:var(--muted)]">
              <th className="p-3">Ảnh</th>
              <th>Tiêu đề</th>
              <th>Vị trí</th>
              <th>CTA</th>
              <th>Thứ tự</th>
              <th>Hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="p-3">
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg bg-black">
                      {item.image?.url && (
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="max-w-xs truncate text-xs text-[color:var(--muted)]">
                      {item.subtitle}
                    </p>
                  </td>
                  <td>{positionLabels[item.position]}</td>
                  <td>{item.buttonText || "—"}</td>
                  <td>{item.sortOrder}</td>
                  <td>{item.isVisible ? "Bật" : "Tắt"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        aria-label={`Sửa ${item.title}`}
                        onClick={() => open(item)}
                        className="p-2"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label={`Xóa ${item.title}`}
                        onClick={() => remove(item.id)}
                        className="p-2 text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <p className="p-8 text-center text-[color:var(--muted)]">
            Đang tải Banner...
          </p>
        )}
        {!loading && items.length === 0 && (
          <p className="p-8 text-center text-[color:var(--muted)]">
            Chưa có Banner.
          </p>
        )}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-[color:var(--surface)] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing === "new" ? "Thêm Banner" : "Sửa Banner"}
              </h2>
              <button aria-label="Đóng" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm">Tiêu đề</span>
                <input
                  className={input}
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm">Phụ đề</span>
                <textarea
                  className={`${input} min-h-24`}
                  value={form.subtitle || ""}
                  onChange={(event) =>
                    setForm({ ...form, subtitle: event.target.value })
                  }
                />
              </label>
              <div className="sm:col-span-2">
                <MediaPreviewPicker
                  value={form.imageId}
                  label="Ảnh Banner"
                  aspectRatio="wide"
                  recommendedSize="1920 × 800 px"
                  onChange={(imageId) => setForm({ ...form, imageId })}
                />
              </div>
              <label>
                <span className="mb-2 block text-sm">Vị trí</span>
                <select
                  className={input}
                  value={form.position}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      position: event.target.value as Position,
                    })
                  }
                >
                  {(Object.keys(positionLabels) as Position[]).map((position) => (
                    <option key={position} value={position}>{positionLabels[position]}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm">Thứ tự</span>
                <input
                  type="number"
                  min="0"
                  className={input}
                  value={form.sortOrder}
                  onChange={(event) =>
                    setForm({ ...form, sortOrder: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                <span className="mb-2 block text-sm">Nhãn nút</span>
                <input
                  className={input}
                  value={form.buttonText || ""}
                  onChange={(event) =>
                    setForm({ ...form, buttonText: event.target.value })
                  }
                />
              </label>
              <label>
                <span className="mb-2 block text-sm">URL nút</span>
                <input
                  className={input}
                  value={form.href || ""}
                  onChange={(event) =>
                    setForm({ ...form, href: event.target.value })
                  }
                />
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(event) =>
                    setForm({ ...form, isVisible: event.target.checked })
                  }
                />
                Hiển thị Banner
              </label>
            </div>
            <button
              disabled={saving}
              onClick={save}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[color:var(--gold)] px-5 py-3 font-bold text-black disabled:opacity-50"
            >
              <Save size={17} />
              {saving ? "Đang lưu..." : "Lưu Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
