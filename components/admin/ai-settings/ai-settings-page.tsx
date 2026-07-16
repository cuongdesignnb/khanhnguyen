"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import {
  MAX_AI_OUTPUT_TOKENS,
  OPENAI_MIN_OUTPUT_TOKENS,
} from "@/lib/ai/normalize-token-limit";

const field =
  "w-full rounded-xl border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

type AiSettingsForm = {
  apiKey: string;
  hasApiKey: boolean;
  maskedApiKey: string | null;
  textModel: string;
  imageModel: string;
  maxBulkItems: number;
  defaultWordCount: number;
  maxOutputTokens: number | string;
  maxHeadingImages: number;
  defaultTone: string;
  generateFeaturedImage: boolean;
  generateHeadingImages: boolean;
  systemPrompt: string;
  articlePrompt: string;
  imagePrompt: string;
  isEnabled: boolean;
};

const promptFields: Array<[keyof AiSettingsForm, string]> = [
  ["systemPrompt", "Prompt hệ thống"],
  ["articlePrompt", "Prompt viết bài"],
  ["imagePrompt", "Prompt sinh ảnh"],
];

export default function AiSettingsPage() {
  const [form, setForm] = useState<AiSettingsForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai/settings")
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) throw new Error(result.error);
        setForm(result.data as AiSettingsForm);
      })
      .catch(() => toast.error("Không tải được cài đặt AI"));
  }, []);

  if (!form)
    return <div className="p-8 text-white">Đang tải cài đặt AI...</div>;

  const set = <Key extends keyof AiSettingsForm>(
    key: Key,
    value: AiSettingsForm[Key],
  ) => setForm((current) => (current ? { ...current, [key]: value } : current));
  const parsedMaxOutputTokens = Number(form.maxOutputTokens);
  const tokenError =
    !Number.isInteger(parsedMaxOutputTokens) ||
    parsedMaxOutputTokens < OPENAI_MIN_OUTPUT_TOKENS ||
    parsedMaxOutputTokens > MAX_AI_OUTPUT_TOKENS
      ? "Số token đầu ra phải là số nguyên từ 16 đến 16384."
      : "";

  const save = async () => {
    if (tokenError) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/ai/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxOutputTokens: parsedMaxOutputTokens,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setForm(result.data as AiSettingsForm);
        toast.success("Đã lưu cài đặt AI");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Không thể lưu cài đặt AI. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    if (tokenError) return;
    setTesting(true);
    toast.info("Đang kiểm tra kết nối...");
    try {
      const response = await fetch("/api/admin/ai/test", { method: "POST" });
      const result = await response.json();
      if (result.success) toast.success("Kết nối OpenAI thành công.");
      else toast.error(result.error);
    } catch {
      toast.error("Không thể kết nối đến OpenAI. Vui lòng thử lại.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <div>
        <h1 className="text-2xl font-black">Cài đặt AI / OpenAI API</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          API key được mã hóa và không bao giờ trả về trình duyệt.
        </p>
      </div>
      <div className="grid gap-5 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-6 md:grid-cols-2">
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isEnabled}
            onChange={(event) => set("isEnabled", event.target.checked)}
          />
          <span>Bật tính năng AI</span>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span>
            OpenAI API key{" "}
            {form.hasApiKey && (
              <small className="text-emerald-400">
                ({form.maskedApiKey})
              </small>
            )}
          </span>
          <input
            className={field}
            type="password"
            value={form.apiKey || ""}
            placeholder={
              form.hasApiKey ? "Để trống nếu không thay đổi" : "sk-..."
            }
            onChange={(event) => set("apiKey", event.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="space-y-2">
          <span>Text model</span>
          <input
            className={field}
            value={form.textModel}
            onChange={(event) => set("textModel", event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span>Image model</span>
          <input
            className={field}
            value={form.imageModel}
            onChange={(event) => set("imageModel", event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span>Số bài tối đa/lần</span>
          <input
            className={field}
            type="number"
            min={1}
            max={50}
            value={form.maxBulkItems}
            onChange={(event) => set("maxBulkItems", Number(event.target.value))}
          />
        </label>
        <label className="space-y-2">
          <span>Độ dài mặc định</span>
          <input
            className={field}
            type="number"
            min={500}
            max={3000}
            value={form.defaultWordCount}
            onChange={(event) =>
              set("defaultWordCount", Number(event.target.value))
            }
          />
        </label>
        <label className="space-y-2">
          <span>Số token đầu ra tối đa</span>
          <input
            className={`${field} ${tokenError ? "border-red-400/70" : ""}`}
            type="number"
            min={OPENAI_MIN_OUTPUT_TOKENS}
            max={MAX_AI_OUTPUT_TOKENS}
            step={1}
            value={form.maxOutputTokens}
            aria-invalid={Boolean(tokenError)}
            aria-describedby="max-output-tokens-help"
            onChange={(event) => set("maxOutputTokens", event.target.value)}
          />
          <p
            id="max-output-tokens-help"
            className={`text-xs ${tokenError ? "text-red-300" : "text-[color:var(--muted)]"}`}
          >
            {tokenError ||
              "OpenAI yêu cầu tối thiểu 16 token. Giá trị thông dụng: 512–2048 token."}
          </p>
        </label>
        <label className="space-y-2">
          <span>Số ảnh heading tối đa</span>
          <input
            className={field}
            type="number"
            min={0}
            max={10}
            value={form.maxHeadingImages}
            onChange={(event) =>
              set("maxHeadingImages", Number(event.target.value))
            }
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span>Tone mặc định</span>
          <input
            className={field}
            value={form.defaultTone || ""}
            onChange={(event) => set("defaultTone", event.target.value)}
          />
        </label>
        {promptFields.map(([key, label]) => (
          <label key={key} className="space-y-2 md:col-span-2">
            <span>{label}</span>
            <textarea
              className={`${field} min-h-32`}
              value={String(form[key] || "")}
              onChange={(event) => set(key, event.target.value)}
            />
          </label>
        ))}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="button"
            onClick={test}
            disabled={Boolean(tokenError) || testing || saving}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {testing ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={Boolean(tokenError) || saving || testing}
            className="rounded-xl bg-[color:var(--gold)] px-5 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </div>
    </div>
  );
}
