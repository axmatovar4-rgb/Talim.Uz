import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const courses = await prisma.course.findMany({
    where: { teacherId: session.id },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

  return NextResponse.json({ courses, totalStudents });
}
