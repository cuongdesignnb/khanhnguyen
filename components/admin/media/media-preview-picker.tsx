"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/media-picker";
import type { MediaItem } from "@/types/admin";

type Media = {
  id: string;
  url: string;
  filename?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  size?: string | null;
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
  onChange,
}: {
  value?: string | null;
  media?: Media | null;
  label: string;
  description?: string;
  aspectRatio?: keyof typeof ratios;
  recommendedSize?: string;
  allowRemove?: boolean;
  disabled?: boolean;
  onChange: (id: string | null, media?: unknown | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<Media | null>(initial || null);

  useEffect(() => {
    if (!value) {
      setMedia(null);
      return;
    }
    if (initial?.id === value) {
      setMedia(initial);
      return;
    }
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
      {media?.url ? (
        <>
          <div
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] bg-[length:16px_16px] ${ratios[aspectRatio]}`}
          >
            <Image
              src={media.url}
              alt={media.alt || label}
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
            {media.filename || media.title || "Tệp Media"}
            {media.width && media.height
              ? ` · ${media.width} × ${media.height}`
              : ""}
            {media.mimeType
              ? ` · ${media.mimeType.split("/").pop()?.toUpperCase()}`
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
          {media ? "Thay ảnh" : "Chọn ảnh"}
        </button>
        {media && allowRemove && (
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
        onSelect={(items: MediaItem[]) => {
          const item = items[0];
          if (item) {
            const next = {
              id: item.id,
              url: item.src,
              filename: item.alt,
              mimeType: `image/${item.format}`,
              alt: item.alt,
              size: item.size,
            };
            setMedia(next);
            onChange(item.id, next);
          }
          setOpen(false);
        }}
      />
    </div>
  );
}
