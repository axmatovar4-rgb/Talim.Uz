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
    <Link href={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden group">
        {/* Thumbnail */}
        <div className="h-44 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white text-5xl opacity-40">📚</div>
            </div>
          )}
          {course.category && (
            <span className="absolute top-3 left-3 bg-white/90 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
              {course.category.name}
            </span>
          )}
          {course.price === 0 && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              BEPUL
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span>👤 {course.teacher.name}</span>
            <span>•</span>
            <span>📹 {course._count.lessons} dars</span>
            <span>•</span>
            <span>🎓 {course._count.enrollments} talaba</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-bold text-lg">
              {course.price === 0 ? (
                <span className="text-green-600">Bepul</span>
              ) : (
                <span className="text-gray-900">
                  {course.price.toLocaleString("uz-UZ")} so'm
                </span>
              )}
            </div>
            <span className="text-blue-600 text-sm font-medium group-hover:underline">
              Batafsil →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
