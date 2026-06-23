import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: {
        include: {
          teacher: { select: { name: true } },
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ enrollments });
}
