import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const session = await getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Allaqachon yozilgansiz" }, { status: 400 });
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: session.id, courseId },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
