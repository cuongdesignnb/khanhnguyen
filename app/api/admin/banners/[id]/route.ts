import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { bannerSchema } from "@/lib/validators/banner";

function canManage(session: unknown) {
  const role = (session as { user?: { role?: string } })?.user?.role;
  return role === "ADMIN" || role === "EDITOR";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if (!canManage(auth.session))
    return Response.json(
      { success: false, error: "Bạn không có quyền quản lý Banner." },
      { status: 403 },
    );

  const banner = await prisma.banner.findFirst({
    where: { id: (await params).id, deletedAt: null },
    include: { image: true },
  });
  return banner
    ? Response.json({ success: true, data: banner })
    : Response.json(
        { success: false, error: "Không tìm thấy Banner." },
        { status: 404 },
      );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if (!canManage(auth.session))
    return Response.json(
      { success: false, error: "Bạn không có quyền quản lý Banner." },
      { status: 403 },
    );

  try {
    const id = (await params).id;
    if (
      !(await prisma.banner.findFirst({
        where: { id, deletedAt: null },
        select: { id: true },
      }))
    ) {
      return Response.json(
        { success: false, error: "Không tìm thấy Banner." },
        { status: 404 },
      );
    }
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
    if (
      !(await prisma.mediaFile.findFirst({
        where: { id: parsed.data.imageId, deletedAt: null },
        select: { id: true },
      }))
    ) {
      return Response.json(
        { success: false, error: "Ảnh Banner không tồn tại hoặc đã bị xóa." },
        { status: 400 },
      );
    }
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...parsed.data,
        subtitle: parsed.data.subtitle || null,
        href: parsed.data.href || null,
        buttonText: parsed.data.buttonText || null,
      },
      include: { image: true },
    });
    revalidatePath("/");
    return Response.json({
      success: true,
      data: banner,
      message: "Đã cập nhật Banner.",
    });
  } catch (error) {
    console.error("Banner update error:", error);
    return Response.json(
      { success: false, error: "Không thể cập nhật Banner." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;
  if (!canManage(auth.session))
    return Response.json(
      { success: false, error: "Bạn không có quyền quản lý Banner." },
      { status: 403 },
    );

  try {
    const id = (await params).id;
    if (
      !(await prisma.banner.findFirst({
        where: { id, deletedAt: null },
        select: { id: true },
      }))
    ) {
      return Response.json(
        { success: false, error: "Không tìm thấy Banner." },
        { status: 404 },
      );
    }
    await prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date(), isVisible: false },
    });
    revalidatePath("/");
    return Response.json({ success: true, message: "Đã xóa Banner." });
  } catch (error) {
    console.error("Banner delete error:", error);
    return Response.json(
      { success: false, error: "Không thể xóa Banner." },
      { status: 500 },
    );
  }
}
