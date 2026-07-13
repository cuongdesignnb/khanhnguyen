import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const heroSeeds = [
  {
    title: "GIẢI PHÁP XE NÂNG TOÀN DIỆN",
    subtitle: "KHÁNH NGUYÊN FORKLIFT",
    image: "/images/seed/hero/industrial-yard.jpg",
    href: "/san-pham",
    buttonText: "Xem sản phẩm",
  },
  {
    title: "XE NÂNG NHẬT BÃI TUYỂN CHỌN",
    subtitle: "BỀN BỈ · HIỆU QUẢ · TẬN TÂM",
    image: "/images/seed/hero/forklift-warehouse.jpg",
    href: "/lien-he",
    buttonText: "Nhận tư vấn",
  },
  {
    title: "DỊCH VỤ KỸ THUẬT CHUYÊN NGHIỆP",
    subtitle: "ĐỒNG HÀNH CÙNG DOANH NGHIỆP",
    image: "/images/seed/hero/industrial-yard.jpg",
    href: "/dich-vu",
    buttonText: "Xem dịch vụ",
  },
] as const;

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if ((auth.session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return Response.json(
      { success: false, error: "Chỉ Quản trị viên được khởi tạo Banner mẫu." },
      { status: 403 },
    );
  }

  try {
    const existingCount = await prisma.banner.count({
      where: { position: "HOME_HERO", deletedAt: null },
    });
    if (existingCount > 0) {
      return Response.json({
        success: true,
        created: 0,
        message:
          "Hero Banner đã có dữ liệu, hệ thống không tạo thêm để tránh trùng lặp.",
      });
    }

    const mediaByUrl = new Map<string, string>();
    for (const url of [...new Set(heroSeeds.map((item) => item.image))]) {
      const filename = url.split("/").pop() || "hero.jpg";
      let media = await prisma.mediaFile.findFirst({
        where: { url },
        select: { id: true, deletedAt: true },
      });
      if (media?.deletedAt) {
        media = await prisma.mediaFile.update({ where: { id: media.id }, data: { deletedAt: null }, select: { id: true, deletedAt: true } });
      }
      if (!media) {
        media = await prisma.mediaFile.create({
          data: {
            filename,
            originalName: filename,
            path: `public${url}`,
            url,
            mimeType: "image/jpeg",
            extension: ".jpg",
            size: 1024,
            type: "IMAGE",
            title: "Ảnh Hero mẫu",
          },
          select: { id: true, deletedAt: true },
        });
      }
      mediaByUrl.set(url, media.id);
    }

    await prisma.banner.createMany({
      data: heroSeeds.map((seed, index) => ({
        title: seed.title,
        subtitle: seed.subtitle,
        imageId: mediaByUrl.get(seed.image),
        href: seed.href,
        buttonText: seed.buttonText,
        position: "HOME_HERO",
        isVisible: true,
        sortOrder: index,
      })),
    });
    revalidatePath("/");
    return Response.json(
      {
        success: true,
        created: heroSeeds.length,
        message:
          "Đã khởi tạo 3 Hero Banner mẫu. Không có dữ liệu nào khác bị thay đổi.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Initialize home hero banners error:", error);
    return Response.json(
      { success: false, error: "Không thể khởi tạo Hero Banner mẫu." },
      { status: 500 },
    );
  }
}
