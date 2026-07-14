"use client";

import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  HeaderActionType,
  HeaderDataSource,
  HeaderUtilityItem,
} from "@/types/header-settings";

const input =
  "min-w-0 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

export default function HeaderUtilityItemsEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: HeaderUtilityItem[];
  onChange: (value: HeaderUtilityItem[]) => void;
}) {
  const items = [...value].sort((a, b) => a.sortOrder - b.sortOrder);
  const update = (id: string, patch: Partial<HeaderUtilityItem>) =>
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return;
    const oldIndex = items.findIndex((item) => item.id === event.active.id);
    const nextIndex = items.findIndex((item) => item.id === event.over?.id);
    onChange(
      arrayMove(items, oldIndex, nextIndex).map((item, index) => ({
        ...item,
        sortOrder: index,
      })),
    );
  }

  return (
    <div className="min-w-0 space-y-3 overflow-hidden rounded-xl border border-white/10 p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">{label}</h3>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              {
                id: crypto.randomUUID(),
                label: "Mục mới",
                icon: "Link",
                actionType: "internal",
                url: "/",
                target: "_self",
                isEnabled: true,
                sortOrder: items.length,
              },
            ])
          }
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"
        >
          <Plus size={14} />
          Thêm mục
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <UtilityRow
                key={item.id}
                item={item}
                update={(patch) => update(item.id, patch)}
                duplicate={() =>
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
                remove={() =>
                  onChange(
                    items
                      .filter((entry) => entry.id !== item.id)
                      .map((entry, index) => ({
                        ...entry,
                        sortOrder: index,
                      })),
                  )
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function UtilityRow({
  item,
  update,
  duplicate,
  remove,
}: {
  item: HeaderUtilityItem;
  update: (patch: Partial<HeaderUtilityItem>) => void;
  duplicate: () => void;
  remove: () => void;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative min-w-0 rounded-xl border border-white/10 bg-white/[.02] p-3 pl-11"
    >
      <button
        type="button"
        aria-label="Kéo sắp xếp"
        {...attributes}
        {...listeners}
        className="absolute left-3 top-5 cursor-grab text-[color:var(--muted)] active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      <div className="grid min-w-0 gap-2 md:grid-cols-2 2xl:grid-cols-4">
        <input
          aria-label="Nhãn hiển thị"
          className={input}
          value={item.label}
          onChange={(event) => update({ label: event.target.value })}
        />
        <select
          aria-label="Nguồn dữ liệu"
          className={input}
          value={item.dataSource || "custom"}
          onChange={(event) =>
            update({ dataSource: event.target.value as HeaderDataSource })
          }
        >
          <option value="hotline">Hotline chính</option>
          <option value="secondaryHotline">Hotline phụ</option>
          <option value="email">Email chính</option>
          <option value="supportEmail">Email hỗ trợ</option>
          <option value="showroomAddress">Địa chỉ showroom</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
        <select
          aria-label="Hành động"
          className={input}
          value={item.actionType}
          onChange={(event) =>
            update({ actionType: event.target.value as HeaderActionType })
          }
        >
          <option value="phone">Gọi hotline</option>
          <option value="email">Gửi email</option>
          <option value="internal">Trang nội bộ</option>
          <option value="external">Link ngoài</option>
          <option value="catalogue">Catalogue</option>
          <option value="orderTracking">Kiểm tra đơn hàng</option>
          <option value="download">Tải file</option>
          <option value="zalo">Chat Zalo</option>
        </select>
        <input
          aria-label="Route hoặc URL"
          className={input}
          placeholder="Route hoặc URL"
          value={item.url || item.value || ""}
          onChange={(event) => update({ url: event.target.value })}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => update({ isEnabled: !item.isEnabled })}
          className={
            item.isEnabled ? "text-green-300" : "text-[color:var(--muted)]"
          }
        >
          {item.isEnabled ? "Hiện" : "Ẩn"}
        </button>
        <button type="button" aria-label="Nhân bản" onClick={duplicate}>
          <Copy size={15} />
        </button>
        <button
          type="button"
          aria-label="Xóa"
          onClick={remove}
          className="text-red-300"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
