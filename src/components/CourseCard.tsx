import Link from "next/link";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string | null;
    price: number;
    teacher: { name: string };
    category?: { name: string } | null;
    _count: { lessons: number; enrollments: number };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden transition-all hover:shadow-md"
        style={{ border: "1.5px solid #E2E8F0" }}>
        {/* Thumbnail */}
        <div className="h-44 relative overflow-hidden" style={{ backgroundColor: "#EEF2FF" }}>
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-30">📚</div>
            </div>
          )}
          {course.category && (
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "white", color: "#4F46E5" }}>
              {course.category.name}
            </span>
          )}
          {course.price === 0 && (
            <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#16a34a", color: "white" }}>
              BEPUL
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors"
            style={{ color: "#0F172A" }}>
            {course.title}
          </h3>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#64748B" }}>
            {course.description}
          </p>

          <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#94A3B8" }}>
            <span>👤 {course.teacher.name}</span>
            <span>·</span>
            <span>📹 {course._count.lessons} dars</span>
            <span>·</span>
            <span>🎓 {course._count.enrollments}</span>
          </div>

          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
            <div className="font-bold text-lg">
              {course.price === 0 ? (
                <span style={{ color: "#16a34a" }}>Bepul</span>
              ) : (
                <span style={{ color: "#0F172A" }}>
                  {course.price.toLocaleString("uz-UZ")} so'm
                </span>
              )}
            </div>
            <span className="text-sm font-medium group-hover:underline" style={{ color: "#4F46E5" }}>
              Batafsil →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
