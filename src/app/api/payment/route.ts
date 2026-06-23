import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

// To'lovni tasdiqlash (demo: to'g'ridan-to'g'ri paid qilinadi)
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId kerak" }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });

  // Allaqachon to'lagan?
  const existing = await prisma.payment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });
  if (existing?.status === "paid") {
    return NextResponse.json({ error: "Allaqachon to'langan" }, { status: 400 });
  }

  // To'lov yaratish (demo: darhol paid)
  const payment = await prisma.payment.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    update: { status: "paid" },
    create: { userId: session.id, courseId, amount: course.price, status: "paid" },
  });

  // Enrollment ham yaratamiz
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.id, courseId } },
    update: {},
    create: { userId: session.id, courseId },
  });

  return NextResponse.json({ success: true, payment });
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (courseId) {
    const payment = await prisma.payment.findUnique({
      where: { userId_courseId: { userId: session.id, courseId } },
    });
    return NextResponse.json({ paid: payment?.status === "paid" });
  }

  const payments = await prisma.payment.findMany({
    where: { userId: session.id, status: "paid" },
    include: { course: { select: { id: true, title: true } } },
  });
  return NextResponse.json(payments);
}
