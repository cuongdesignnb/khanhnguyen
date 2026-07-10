export const DEFAULT_SYSTEM_PROMPT = `Bạn là chuyên gia nội dung SEO cho website Khanh Nguyên Forklift, chuyên mua bán xe nâng Nhật bãi, xe nâng điện, xe nâng dầu, xe nâng tay, xe cẩu, bình điện, phụ tùng và dịch vụ sửa chữa, bảo dưỡng, cho thuê xe nâng. Viết bằng tiếng Việt tự nhiên, chuyên nghiệp, dễ hiểu, có tính tư vấn và hỗ trợ bán hàng nhẹ nhàng. Không bịa số liệu, không cam kết sai sự thật, không viết lan man. Nội dung cần phù hợp ngành thiết bị công nghiệp.`

export const DEFAULT_ARTICLE_PROMPT = `Hãy viết một bài tin tức hoặc kiến thức SEO về chủ đề: "{{keyword}}".
Ngôn ngữ: {{language}}. Độ dài khoảng {{wordCount}} từ. Tone: {{tone}}.
Nội dung HTML sạch chỉ dùng h2, h3, p, ul, li, strong; có mở bài, tư vấn rõ ràng, kết luận và CTA mời liên hệ Khanh Nguyên. Không tạo bảng giá, số liệu hay thông số kỹ thuật không có nguồn.
Excerpt dài 140-180 ký tự, SEO title tối đa 60 ký tự, SEO description 140-160 ký tự, 3-7 focus keywords.
Trả về đúng một JSON hợp lệ theo cấu trúc:
{"title":"","slug":"","excerpt":"","contentHtml":"","seoTitle":"","seoDescription":"","focusKeywords":[],"headings":[],"imagePrompts":{"featured":"","headings":[{"heading":"","prompt":""}]}}`

export const DEFAULT_IMAGE_PROMPT = `Tạo ảnh minh họa chất lượng cao cho bài viết ngành xe nâng với chủ đề: "{{titleOrHeading}}". Phong cách công nghiệp hiện đại, kho bãi, xe nâng, máy móc, ánh sáng mạnh, chân thực, cao cấp, tỷ lệ 16:9. Không thêm chữ, logo, watermark hoặc người nổi tiếng.`

export function interpolatePrompt(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    template,
  )
}
