import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import EnrollButton from "@/components/EnrollButton";
import Link from "next/link";

async function getCourse(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, name: true } },
      category: true,
      lessons: { orderBy: { position: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
}

function formatDuration(seconds?: number | null) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  return `${m} daqiqa`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;
  const [course, session] = await Promise.all([getCourse(id), getSession()]);

  if (!course || !course.isPublished) notFound();

  let isEnrolled = false;
  if (session) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.id, courseId: id } },
    });
    isEnrolled = !!enrollment;
  }

  const freeLessons = course.lessons.filter((l) => l.isFree);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/courses" className="hover:text-blue-600">Kurslar</Link>
            {course.category && (
              <>
                <span>›</span>
                <Link href={`/courses?categoryId=${course.category.id}`} className="hover:text-blue-600">
                  {course.category.name}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-gray-700">{course.title}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span>👤 {course.teacher.name}</span>
            <span>📹 {course.lessons.length} ta dars</span>
            <span>🎓 {course._count.enrollments} talaba</span>
            {course.category && <span>🏷 {course.category.name}</span>}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Kurs haqida</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Darslar ro'yxati ({course.lessons.length})
            </h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    lesson.isFree || isEnrolled
                      ? "bg-green-50 border border-green-100"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                    {lesson.duration && (
                      <p className="text-xs text-gray-400">{formatDuration(lesson.duration)}</p>
                    )}
                  </div>
                  {lesson.isFree ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Bepul
                    </span>
                  ) : !isEnrolled ? (
                    <span className="text-gray-400 text-lg">🔒</span>
                  ) : (
                    <span className="text-green-500 text-lg">▶</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
            {/* Course thumbnail */}
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl opacity-50">📚</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {course.price === 0 ? (
                <span className="text-green-600">Bepul</span>
              ) : (
                <span>{course.price.toLocaleString("uz-UZ")} so'm</span>
              )}
            </div>

            {/* Enroll button */}
            <EnrollButton
              courseId={course.id}
              isEnrolled={isEnrolled}
              isLoggedIn={!!session}
              price={course.price}
            />

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>{course.lessons.length} ta video dars</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Sertifikat</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Umrlik kirish</span>
              </div>
              {freeLessons.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>{freeLessons.length} ta bepul dars</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
