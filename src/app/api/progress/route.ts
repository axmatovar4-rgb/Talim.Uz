import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

  const { lessonId, completed } = await req.json();

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.id, lessonId } },
    update: { completed: completed ?? true },
    create: { userId: session.id, lessonId, completed: completed ?? true },
  });

  return NextResponse.json(progress);
}
