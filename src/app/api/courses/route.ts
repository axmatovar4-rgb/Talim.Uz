import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      category: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const { title, description, categoryId, price } = await req.json();
  if (!title || !description) {
    return NextResponse.json({ error: "Nom va tavsif kerak" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      categoryId: categoryId || null,
      price: price || 0,
      teacherId: session.id,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
