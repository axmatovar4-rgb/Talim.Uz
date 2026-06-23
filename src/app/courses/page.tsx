import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";
import { Suspense } from "react";
import CoursesFilter from "@/components/CoursesFilter";

async function getCourses(categoryId?: string, search?: string) {
  return prisma.course.findMany({
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
      teacher: { select: { name: true } },
      category: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

interface PageProps {
  searchParams: Promise<{ categoryId?: string; search?: string }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const { categoryId, search } = await searchParams;
  const [courses, categories] = await Promise.all([
    getCourses(categoryId, search),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Barcha kurslar</h1>
      <p className="text-gray-500 mb-8">{courses.length} ta kurs topildi</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filter */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div className="text-gray-400 text-sm">Yuklanmoqda...</div>}>
            <CoursesFilter categories={categories} />
          </Suspense>
        </aside>

        {/* Courses grid */}
        <div className="flex-1">
          {courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl">Kurslar topilmadi</p>
              <p className="text-sm mt-2">Boshqa kalit so'z yoki kategoriya tanlang</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
