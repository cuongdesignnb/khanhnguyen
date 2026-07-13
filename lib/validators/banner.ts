import { z } from "zod";

const bannerHref = z
  .string()
  .trim()
  .max(500, "URL Banner không được vượt quá 500 ký tự")
  .refine(
    (value) =>
      !value ||
      (!/[<>]/.test(value) &&
        (((/^\/(?!\/)/.test(value) && value !== "#") ||
          /^(https?:\/\/|tel:|mailto:)/i.test(value)))),
    "URL phải là đường dẫn nội bộ, HTTP(S), số điện thoại hoặc email hợp lệ",
  );

export const bannerSchema = z.object({
  title: z
    .string()
    .trim()
    .max(180, "Tiêu đề Banner không được vượt quá 180 ký tự"),
  subtitle: z.string().trim().max(240, "Phụ đề Banner không được vượt quá 240 ký tự").nullable().optional(),
  imageId: z.string().trim().min(1, "Vui lòng chọn ảnh Banner").max(100, "Mã ảnh Banner không hợp lệ"),
  href: bannerHref.nullable().optional(),
  buttonText: z.string().trim().max(80, "Nhãn CTA không được vượt quá 80 ký tự").nullable().optional(),
  position: z.enum(["HOME_HERO", "HOME_PROMO", "CATEGORY", "POPUP", "FOOTER"], { error: "Vị trí Banner không hợp lệ" }),
  isVisible: z.boolean({ error: "Trạng thái Banner không hợp lệ" }),
  sortOrder: z.number({ error: "Thứ tự Banner phải là một số" }).int("Thứ tự Banner phải là số nguyên").min(0, "Thứ tự Banner không được âm").max(9999, "Thứ tự Banner không được vượt quá 9999"),
});

export type BannerInput = z.infer<typeof bannerSchema>;
