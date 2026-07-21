"use client";

import { useEffect, useState } from "react";
import { Cable, Save } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  MAX_AI_OUTPUT_TOKENS,
  OPENAI_MIN_OUTPUT_TOKENS,
} from "@/lib/ai/normalize-token-limit";

const field =
  "w-full rounded-lg border border-white/10 bg-[color:var(--surface-2)] px-4 py-2.5 text-sm text-white outline-none focus:border-[color:var(--gold)]/60";

type AiSettingsForm = {
  apiKey: string;
  hasApiKey: boolean;
  maskedApiKey: string | null;
  baseUrl: string;
  wireApi: "chat_completions" | "responses";
  textModel: string;
  reasoningEffort: "low" | "medium" | "high";
  imageApiKey: string;
  hasImageApiKey: boolean;
  maskedImageApiKey: string | null;
  imageBaseUrl: string;
  imageModel: string;
  imageQuality: "low" | "medium" | "high" | "auto";
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

async function readJson(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Máy chủ trả về HTTP ${response.status} thay vì JSON.`);
  }
}

export default function AiSettingsPage() {
  const [form, setForm] = useState<AiSettingsForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai/settings")
      .then(readJson)
      .then((result) => {
        if (!result.success) throw new Error(result.error);
        setForm(result.data as AiSettingsForm);
      })
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Không tải được cài đặt AI"),
      );
  }, []);

  if (!form) return <div className="p-8 text-white">Đang tải cài đặt AI...</div>;

  const set = <Key extends keyof AiSettingsForm>(
    key: Key,
    value: AiSettingsForm[Key],
  ) => setForm((current) => (current ? { ...current, [key]: value } : current));
  const parsedMaxOutputTokens = Number(form.maxOutputTokens);
  const tokenError =
    !Number.isInteger(parsedMaxOutputTokens) ||
    parsedMaxOutputTokens < OPENAI_MIN_OUTPUT_TOKENS ||
    parsedMaxOutputTokens > MAX_AI_OUTPUT_TOKENS
      ? `Số token phải là số nguyên từ ${OPENAI_MIN_OUTPUT_TOKENS} đến ${MAX_AI_OUTPUT_TOKENS}.`
      : "";

  const save = async () => {
    if (tokenError) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/ai/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, maxOutputTokens: parsedMaxOutputTokens }),
      });
      const result = await readJson(response);
      if (!result.success) throw new Error(result.error);
      setForm(result.data as AiSettingsForm);
      toast.success("Đã lưu cài đặt AI");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu cài đặt AI.");
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    if (tokenError) return;
    setTesting(true);
    try {
      const response = await fetch("/api/admin/ai/test", { method: "POST" });
      const result = await readJson(response);
      if (!result.success) throw new Error(result.error);
      toast.success("Kết nối AI Provider thành công.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể kết nối AI Provider.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black">Cài đặt AI</h1>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.isEnabled}
            onChange={(event) => set("isEnabled", event.target.checked)}
          />
          <span>Bật tính năng AI</span>
        </label>
      </div>

      <section className="space-y-5 border-y border-white/10 py-6">
        <h2 className="text-base font-bold">AI Provider - viết bài</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span>AI Provider API Key</span>
            {form.hasApiKey && <small className="ml-2 text-emerald-400">{form.maskedApiKey}</small>}
            <input
              className={field}
              type="password"
              value={form.apiKey || ""}
              placeholder={form.hasApiKey ? "Để trống nếu không thay đổi" : "API key"}
              onChange={(event) => set("apiKey", event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span>AI Provider Base URL</span>
            <input className={field} value={form.baseUrl} onChange={(event) => set("baseUrl", event.target.value)} />
          </label>
          <label className="space-y-2">
            <span>Wire API</span>
            <select className={field} value={form.wireApi} onChange={(event) => set("wireApi", event.target.value as AiSettingsForm["wireApi"])}>
              <option value="chat_completions">Chat Completions</option>
              <option value="responses">Responses API</option>
            </select>
          </label>
          <label className="space-y-2">
            <span>Model sinh nội dung</span>
            <input className={field} value={form.textModel} onChange={(event) => set("textModel", event.target.value)} />
          </label>
          <label className="space-y-2">
            <span>Reasoning Effort</span>
            <select className={field} value={form.reasoningEffort} disabled={form.wireApi !== "responses"} onChange={(event) => set("reasoningEffort", event.target.value as AiSettingsForm["reasoningEffort"])}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="space-y-2">
            <span>Max Output Tokens</span>
            <input
              className={`${field} ${tokenError ? "border-red-400/70" : ""}`}
              type="number"
              min={OPENAI_MIN_OUTPUT_TOKENS}
              max={MAX_AI_OUTPUT_TOKENS}
              step={1}
              value={form.maxOutputTokens}
              aria-invalid={Boolean(tokenError)}
              onChange={(event) => set("maxOutputTokens", event.target.value)}
            />
            {tokenError && <p className="text-xs text-red-300">{tokenError}</p>}
          </label>
        </div>
      </section>

      <section className="space-y-5 border-b border-white/10 pb-6">
        <h2 className="text-base font-bold">OpenAI chính hãng - sinh ảnh bài viết</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span>OpenAI Image API Key</span>
            {form.hasImageApiKey && <small className="ml-2 text-emerald-400">{form.maskedImageApiKey}</small>}
            <input
              className={field}
              type="password"
              value={form.imageApiKey || ""}
              placeholder={form.hasImageApiKey ? "Để trống nếu không thay đổi" : "sk-..."}
              onChange={(event) => set("imageApiKey", event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span>OpenAI Image Base URL</span>
            <input className={field} value={form.imageBaseUrl} onChange={(event) => set("imageBaseUrl", event.target.value)} />
          </label>
          <label className="space-y-2">
            <span>Model sinh ảnh</span>
            <input className={field} value={form.imageModel} onChange={(event) => set("imageModel", event.target.value)} />
          </label>
          <label className="space-y-2">
            <span>Chất lượng ảnh</span>
            <select className={field} value={form.imageQuality} onChange={(event) => set("imageQuality", event.target.value as AiSettingsForm["imageQuality"])}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="auto">Auto</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-base font-bold">Mặc định tạo bài</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span>Số bài tối đa/lần</span>
            <input className={field} type="number" min={1} max={50} value={form.maxBulkItems} onChange={(event) => set("maxBulkItems", Number(event.target.value))} />
          </label>
          <label className="space-y-2">
            <span>Độ dài mặc định</span>
            <input className={field} type="number" min={500} max={3000} value={form.defaultWordCount} onChange={(event) => set("defaultWordCount", Number(event.target.value))} />
          </label>
          <label className="space-y-2">
            <span>Số ảnh heading tối đa</span>
            <input className={field} type="number" min={0} max={10} value={form.maxHeadingImages} onChange={(event) => set("maxHeadingImages", Number(event.target.value))} />
          </label>
          <label className="space-y-2">
            <span>Tone mặc định</span>
            <input className={field} value={form.defaultTone || ""} onChange={(event) => set("defaultTone", event.target.value)} />
          </label>
          {promptFields.map(([key, label]) => (
            <label key={key} className="space-y-2 md:col-span-2">
              <span>{label}</span>
              <textarea className={`${field} min-h-32`} value={String(form[key] || "")} onChange={(event) => set(key, event.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={test} disabled={Boolean(tokenError) || testing || saving} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
          <Cable className="size-4" />
          {testing ? "Đang kiểm tra..." : "Kiểm tra AI Provider"}
        </button>
        <button type="button" onClick={save} disabled={Boolean(tokenError) || saving || testing} className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--gold)] px-5 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">
          <Save className="size-4" />
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>
    </div>
  );
}
