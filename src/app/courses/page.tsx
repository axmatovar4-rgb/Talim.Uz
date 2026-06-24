import { prisma } from "@/lib/prisma";
import Link from "next/link";

const ICONS: Record<string, string> = {
  "Ona tili": "🇺🇿",
  "Matematika": "📐",
  "Ingliz tili": "🇬🇧",
  "Rus tili": "🇷🇺",
  "Dasturlash": "💻",
  "Marketing": "📣",
  "Dizayn": "🎨",
};

export const dynamic = "force-dynamic";

async function getCourses(categoryId?: string, search?: string) {
  return prisma.course.findMany({
    where: {
      isPublished: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {}),
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

  const top = courses.slice(0, 5);
  const bottom = courses.slice(5, 10);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl font-black mb-1" style={{ color: "#0F172A" }}>Yo'nalishlar</h1>
        <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
          Bir martalik to'lov bilan barcha video darslarga kirish oling
        </p>

        {/* Search + filter */}
        <div className="flex flex-wrap items-center gap-3">
          <form method="get" className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Kurs qidirish..."
              className="px-4 py-2 text-sm rounded-xl focus:outline-none"
              style={{ border: "1.5px solid #E2E8F0", backgroundColor: "white", color: "#0F172A", minWidth: 200 }}
            />
            <button type="submit" className="px-4 py-2 text-sm text-white rounded-xl font-medium"
              style={{ backgroundColor: "#0F172A" }}>
              Qidirish
            </button>
          </form>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <Link href="/courses"
              className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
              style={{
                backgroundColor: !categoryId ? "#0F172A" : "white",
                color: !categoryId ? "white" : "#475569",
                border: "1.5px solid #E2E8F0"
              }}>
              Barchasi
            </Link>
            {categories.map(cat => (
              <Link key={cat.id} href={`/courses?categoryId=${cat.id}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
                style={{
                  backgroundColor: categoryId === cat.id ? "#0F172A" : "white",
                  color: categoryId === cat.id ? "white" : "#475569",
                  border: "1.5px solid #E2E8F0"
                }}>
                {ICONS[cat.name] || "📚"} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Courses grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {courses.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#94A3B8" }}>
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-lg font-semibold">Kurs topilmadi</p>
            <p className="text-sm mt-1">Boshqa so'z yoki kategoriya tanlang</p>
          </div>
        ) : (
          <>
            {/* Row 1 — 5 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {top.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {/* Row 2 — 5 cards */}
            {bottom.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {bottom.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: {
  course: {
    id: string; title: string; description: string; price: number;
    category?: { name: string } | null;
    _count: { lessons: number; enrollments: number };
  }
}) {
  const icon = ICONS[course.category?.name || ""] || "📚";

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-2xl p-5 transition-all hover:shadow-md h-full flex flex-col"
        style={{ border: "1.5px solid #E2E8F0" }}>
        {/* Icon */}
        <div className="text-3xl mb-3">{icon}</div>

        {/* Title */}
        <h3 className="font-bold text-sm mb-1 group-hover:text-indigo-600 transition-colors"
          style={{ color: "#0F172A" }}>
          {course.title}
        </h3>

        {/* Category badge */}
        {course.category && (
          <span className="text-xs px-2 py-0.5 rounded-full mb-2 w-fit"
            style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>
            {course.category.name}
          </span>
        )}

        {/* Description */}
        <p className="text-xs leading-relaxed line-clamp-2 flex-1 mb-3"
          style={{ color: "#64748B" }}>
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #F1F5F9" }}>
          <span className="text-xs" style={{ color: "#94A3B8" }}>
            📹 {course._count.lessons} video dars
          </span>
          <span className="font-bold text-sm">
            {course.price === 0 ? (
              <span style={{ color: "#16a34a" }}>Bepul</span>
            ) : (
              <span style={{ color: "#0F172A" }}>
                {course.price.toLocaleString("uz-UZ")} so'm
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
