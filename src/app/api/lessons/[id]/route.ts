import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

async function checkAccess(req: NextRequest, lessonId: string) {
  const session = await getSessionFromRequest(req);
  if (!session) return { error: "Tizimga kiring", status: 401 };
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) return { error: "Dars topilmadi", status: 404 };
  if (lesson.course.teacherId !== session.id && session.role !== "admin") {
    return { error: "Ruxsat yo'q", status: 403 };
  }
  return { lesson };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json(lesson);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const check = await checkAccess(req, id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const data = await req.json();
  const updated = await prisma.lesson.update({
    where: { id },
    data: {
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      videoUrl: data.videoUrl ?? undefined,
      duration: data.duration !== undefined ? Number(data.duration) || null : undefined,
      isFree: data.isFree ?? undefined,
      position: data.position ?? undefined,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const check = await checkAccess(req, id);
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
