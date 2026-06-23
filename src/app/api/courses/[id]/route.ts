import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      category: true,
      lessons: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  }

  return NextResponse.json(course);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  if (course.teacherId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const data = await req.json();
  const updated = await prisma.course.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  if (course.teacherId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
