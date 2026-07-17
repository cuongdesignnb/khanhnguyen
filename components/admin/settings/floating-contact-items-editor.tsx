"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import MediaPicker from "@/components/admin/media-picker";
import type { MediaItem } from "@/types/admin";
import type {
  FloatingContactActionType,
  FloatingContactDataSource,
  FloatingContactItem,
} from "@/types/floating-contact";
import { normalizeConfiguredHref } from "@/lib/urls/normalize-configured-href";

const inputClass =
  "min-w-0 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

function normalizeOrder(items: FloatingContactItem[]) {
  return items.map((item, index) => ({ ...item, sortOrder: index }));
}

export default function FloatingContactItemsEditor({
  value,
  onChange,
}: {
  value: FloatingContactItem[];
  onChange: (value: FloatingContactItem[]) => void;
}) {
  const [pickerItemId, setPickerItemId] = useState<string | null>(null);
  const items = useMemo(
    () => [...value].sort((left, right) => left.sortOrder - right.sortOrder),
    [value],
  );
  const pickerItem = items.find((item) => item.id === pickerItemId);

  const update = (id: string, patch: Partial<FloatingContactItem>) =>
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(normalizeOrder(next));
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">Danh sách nút liên hệ</h3>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Mobile hiển thị tối đa 6 mục đầu tiên. Desktop hiển thị dọc bên
            phải theo đúng thứ tự bên dưới.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: crypto.randomUUID(),
                label: "Liên hệ",
                dataSource: "custom",
                actionType: "internal",
                url: "/lien-he",
                iconMediaId: null,
                iconUrl: null,
                target: "_self",
                badge: "",
                isEnabled: true,
                sortOrder: items.length,
              },
            ])
          }
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"
        >
          <Plus aria-hidden size={14} /> Thêm mục
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="min-w-0 rounded-xl border border-white/10 bg-white/[.02] p-3"
          >
            <div className="grid min-w-0 gap-3 xl:grid-cols-[96px_minmax(0,1fr)]">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPickerItemId(item.id)}
                  className="relative flex aspect-square w-20 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-black/20"
                  aria-label={`Chọn icon cho ${item.label}`}
                >
                  {item.iconUrl ? (
                    <Image
                      src={item.iconUrl}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <ImageIcon
                      aria-hidden
                      size={24}
                      className="text-[color:var(--muted)]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPickerItemId(item.id)}
                  className="text-xs font-semibold text-[color:var(--gold)]"
                >
                  Chọn Media
                </button>
              </div>

              <div className="grid min-w-0 gap-2 md:grid-cols-2 2xl:grid-cols-4">
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  Nhãn hiển thị
                  <input
                    className={`${inputClass} mt-1`}
                    value={item.label}
                    onChange={(event) =>
                      update(item.id, { label: event.target.value })
                    }
                  />
                </label>
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  Lấy dữ liệu từ
                  <select
                    className={`${inputClass} mt-1`}
                    value={item.dataSource}
                    onChange={(event) =>
                      update(item.id, {
                        dataSource: event.target
                          .value as FloatingContactDataSource,
                      })
                    }
                  >
                    <option value="hotline">Hotline trong Liên hệ</option>
                    <option value="zalo">Zalo trong Mạng xã hội</option>
                    <option value="messenger">Messenger/Facebook</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="custom">Liên kết tùy chỉnh</option>
                  </select>
                </label>
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  Hành động
                  <select
                    className={`${inputClass} mt-1`}
                    value={item.actionType}
                    onChange={(event) =>
                      update(item.id, {
                        actionType: event.target
                          .value as FloatingContactActionType,
                      })
                    }
                  >
                    <option value="phone">Gọi điện</option>
                    <option value="zalo">Mở Zalo</option>
                    <option value="internal">Trang nội bộ</option>
                    <option value="external">Liên kết ngoài</option>
                  </select>
                </label>
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  URL ghi đè (không bắt buộc)
                  <input
                    className={`${inputClass} mt-1`}
                    placeholder="/lien-he hoặc https://..."
                    value={item.url || ""}
                    onChange={(event) =>
                      update(item.id, { url: event.target.value })
                    }
                    onBlur={(event) =>
                      update(item.id, {
                        url: normalizeConfiguredHref(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  Mở liên kết
                  <select
                    className={`${inputClass} mt-1`}
                    value={item.target}
                    onChange={(event) =>
                      update(item.id, {
                        target: event.target.value as "_self" | "_blank",
                      })
                    }
                  >
                    <option value="_self">Cùng cửa sổ</option>
                    <option value="_blank">Cửa sổ mới</option>
                  </select>
                </label>
                <label className="min-w-0 text-xs text-[color:var(--muted)]">
                  Badge
                  <input
                    className={`${inputClass} mt-1`}
                    placeholder="Ví dụ: 1"
                    value={item.badge || ""}
                    onChange={(event) =>
                      update(item.id, { badge: event.target.value })
                    }
                  />
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => update(item.id, { isEnabled: !item.isEnabled })}
                className={
                  item.isEnabled
                    ? "text-sm text-green-300"
                    : "text-sm text-[color:var(--muted)]"
                }
              >
                {item.isEnabled ? "Đang hiện" : "Đang ẩn"}
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label={`Đưa ${item.label} lên`}
                className="disabled:opacity-30"
              >
                <ArrowUp size={16} />
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
                aria-label={`Đưa ${item.label} xuống`}
                className="disabled:opacity-30"
              >
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                aria-label={`Nhân bản ${item.label}`}
                onClick={() =>
                  onChange([
                    ...items,
                    {
                      ...item,
                      id: crypto.randomUUID(),
                      label: `${item.label} (bản sao)`,
                      sortOrder: items.length,
                    },
                  ])
                }
              >
                <Copy size={16} />
              </button>
              <button
                type="button"
                aria-label={`Xóa ${item.label}`}
                onClick={() =>
                  onChange(
                    normalizeOrder(
                      items.filter((entry) => entry.id !== item.id),
                    ),
                  )
                }
                className="text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <MediaPicker
        isOpen={Boolean(pickerItemId)}
        onClose={() => setPickerItemId(null)}
        acceptedTypes={["IMAGE"]}
        initialSelectedIds={pickerItem?.iconMediaId ? [pickerItem.iconMediaId] : []}
        usageContext="setting"
        onSelect={(selected: MediaItem[]) => {
          const media = selected[0];
          if (pickerItemId && media) {
            update(pickerItemId, {
              iconMediaId: media.id,
              iconUrl: media.url || media.src,
            });
          }
          setPickerItemId(null);
        }}
      />
    </div>
  );
}
