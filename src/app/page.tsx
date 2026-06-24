import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [users, courses, enrollments] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count(),
    ]);
    return { users, courses, enrollments };
  } catch {
    return { users: 0, courses: 0, enrollments: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return <HomePageClient stats={stats} />;
}
