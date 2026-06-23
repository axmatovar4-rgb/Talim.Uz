import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  if (course.teacherId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const { title, description, videoUrl, duration, isFree } = await req.json();
  if (!title) return NextResponse.json({ error: "Dars nomi kerak" }, { status: 400 });

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });
  const position = (lastLesson?.position ?? 0) + 1;

  const lesson = await prisma.lesson.create({
    data: {
      title,
      description: description || null,
      videoUrl: videoUrl || null,
      duration: duration ? Number(duration) : null,
      isFree: isFree ?? false,
      position,
      courseId,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
