import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";

async function getStats() {
  const [users, courses, enrollments] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.enrollment.count(),
  ]);
  return { users, courses, enrollments };
}

export default async function HomePage() {
  const stats = await getStats();
  return <HomePageClient stats={stats} />;
}
