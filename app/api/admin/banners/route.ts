import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { bannerSchema } from "@/lib/validators/banner";

const positions = [
  "HOME_HERO",
  "HOME_PROMO",
  "CATEGORY",
  "POPUP",
  "FOOTER",
] as const;

function canManage(session: unknown) {
  const role = (session as { user?: { role?: string } })?.user?.role;
  return role === "ADMIN" || role === "EDITOR";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if (!canManage(auth.session))
    return Response.json(
      { success: false, error: "Bạn không có quyền quản lý Banner." },
      { status: 403 },
    );
  try {
    const position = new URL(request.url).searchParams.get("position");
    if (
      position &&
      !positions.includes(position as (typeof positions)[number])
    ) {
      return Response.json(
        { success: false, error: "Vị trí Banner không hợp lệ." },
        { status: 400 },
      );
    }
    const banners = await prisma.banner.findMany({
      where: {
        deletedAt: null,
        ...(position
          ? { position: position as (typeof positions)[number] }
          : {}),
      },
      include: { image: true },
      orderBy: [
        { position: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    return Response.json({ success: true, data: banners });
  } catch (error) {
    console.error("Banner list error:", error);
    return Response.json(
      { success: false, error: "Không thể tải danh sách Banner." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if (!canManage(auth.session))
    return Response.json(
      { success: false, error: "Bạn không có quyền quản lý Banner." },
      { status: 403 },
    );
  try {
    const parsed = bannerSchema.safeParse(await request.json());
    if (!parsed.success)
      return Response.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message || "Dữ liệu Banner không hợp lệ.",
        },
        { status: 400 },
      );
    const media = await prisma.mediaFile.findFirst({
      where: { id: parsed.data.imageId, deletedAt: null },
      select: { id: true },
    });
    if (!media)
      return Response.json(
        { success: false, error: "Ảnh Banner không tồn tại hoặc đã bị xóa." },
        { status: 400 },
      );
    const banner = await prisma.banner.create({
      data: {
        ...parsed.data,
        subtitle: parsed.data.subtitle || null,
        href: parsed.data.href || null,
        buttonText: parsed.data.buttonText || null,
      },
      include: { image: true },
    });
    revalidatePath("/");
    return Response.json(
      { success: true, data: banner, message: "Đã tạo Banner." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Banner create error:", error);
    return Response.json(
      { success: false, error: "Không thể tạo Banner." },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
