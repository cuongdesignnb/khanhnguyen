"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/media-picker";
import type { MediaItem } from "@/types/admin";
import type { MediaType } from "@/types/media";

type Media = {
  id: string;
  url: string;
  filename?: string | null;
  originalName?: string | null;
  extension?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  size?: number | string | null;
};
const ratios = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/6]",
  logo: "aspect-[3/1]",
  favicon: "aspect-square max-w-24",
  auto: "aspect-video",
};

export default function MediaPreviewPicker({
  value,
  media: initial,
  label,
  description,
  aspectRatio = "video",
  recommendedSize,
  allowRemove = true,
  disabled,
  multiple = false,
  maxSelect = multiple ? 20 : 1,
  acceptedTypes = ["IMAGE"],
  onChange,
  onChangeMany,
}: {
  value?: string | null;
  media?: Media | null;
  label: string;
  description?: string;
  aspectRatio?: keyof typeof ratios;
  recommendedSize?: string;
  allowRemove?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  maxSelect?: number;
  acceptedTypes?: MediaType[];
  onChange: (id: string | null, media?: unknown | null) => void;
  onChangeMany?: (items: MediaItem[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<Media | null>(initial || null);
  const displayMedia = value
    ? media?.id === value
      ? media
      : initial?.id === value
        ? initial
        : null
    : null;

  useEffect(() => {
    if (!value || initial?.id === value) return;
    if (media?.id === value) return;
    fetch(`/api/admin/media/${encodeURIComponent(value)}`)
      .then((response) => response.json())
      .then((result) => {
        const item = result.data || result;
        if (item?.id) setMedia({ ...item, url: item.url || item.src });
      })
      .catch(() => undefined);
  }, [initial, media?.id, value]);

  return (
    <div className="space-y-3 rounded-xl border border-white/10 p-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className="text-xs text-[color:var(--muted)]">{description}</p>
        )}
        {recommendedSize && (
          <p className="text-xs text-[color:var(--gold)]">
            Kích thước đề xuất: {recommendedSize}
          </p>
        )}
      </div>
      {displayMedia?.url ? (
        <>
          <div
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] bg-[length:16px_16px] ${ratios[aspectRatio]}`}
          >
            <Image
              src={displayMedia.url}
              alt={displayMedia.alt || label}
              fill
              sizes="600px"
              className={
                aspectRatio === "logo" || aspectRatio === "favicon"
                  ? "object-contain p-3"
                  : "object-cover"
              }
            />
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            {displayMedia.filename || displayMedia.title || "Tệp Media"}
            {displayMedia.width && displayMedia.height
              ? ` · ${displayMedia.width} × ${displayMedia.height}`
              : ""}
            {displayMedia.mimeType
              ? ` · ${displayMedia.mimeType.split("/").pop()?.toUpperCase()}`
              : ""}
          </p>
        </>
      ) : (
        <div
          className={`${ratios[aspectRatio]} flex max-h-52 items-center justify-center rounded-xl border border-dashed border-white/15 text-[color:var(--muted)]`}
        >
          <ImageIcon aria-hidden size={28} />
        </div>
      )}
      <div className="flex gap-2">
        <button
          disabled={disabled}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-[color:var(--gold)] px-4 py-2 text-sm font-bold text-black"
        >
          {displayMedia ? "Thay ảnh" : "Chọn ảnh"}
        </button>
        {displayMedia && allowRemove && (
          <button
            type="button"
            onClick={() => {
              setMedia(null);
              onChange(null, null);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-300"
          >
            <Trash2 aria-hidden size={14} />
            Xóa ảnh
          </button>
        )}
      </div>
      <MediaPicker
        isOpen={open}
        onClose={() => setOpen(false)}
        multiple={multiple}
        maxSelect={maxSelect}
        acceptedTypes={acceptedTypes}
        initialSelectedIds={value ? [value] : []}
        onSelect={(items: MediaItem[]) => {
          const item = items[0];
          if (item) {
            const next = {
              id: item.id,
              url: item.url || item.src,
              filename: item.filename || item.originalName || item.alt,
              originalName: item.originalName,
              mimeType: item.mimeType,
              extension: item.extension,
              width: item.width,
              height: item.height,
              alt: item.alt,
              title: item.title,
              size: item.size,
            };
            setMedia(next);
            onChange(item.id, next);
          }
          if (multiple) onChangeMany?.(items);
          setOpen(false);
        }}
      />
    </div>
  );
}
