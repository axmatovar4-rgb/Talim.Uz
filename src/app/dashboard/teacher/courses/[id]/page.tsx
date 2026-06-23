"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseSettingsTab from "@/components/teacher/CourseSettingsTab";
import LessonsTab from "@/components/teacher/LessonsTab";
import type { Course, Lesson } from "@/types/teacher";

type Tab = "darslar" | "sozlamalar";

export default function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tab, setTab] = useState<Tab>("darslar");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/courses/${id}`).then(r => r.json()),
    ]).then(([c]) => {
      setCourse(c);
      setLessons(c.lessons || []);
    }).finally(() => setFetching(false));
  }, [id, user]);

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">Kurs topilmadi</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/teacher" className="text-gray-400 hover:text-gray-700 transition-colors text-sm">
            ← Dashboard
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {course.isPublished ? "✅ Faol" : "⏸ Qoralama"}
          </span>
          <Link href={`/courses/${id}`} target="_blank" className="text-sm text-blue-600 hover:underline">
            Ko'rish →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Course header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📹 {course._count.lessons} dars</span>
            <span>🎓 {course._count.enrollments} talaba</span>
            <span>💰 {course.price === 0 ? "Bepul" : `${course.price.toLocaleString()} so'm`}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
          {(["darslar", "sozlamalar"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "darslar" ? "📹 Darslar" : "⚙️ Sozlamalar"}
            </button>
          ))}
        </div>

        {tab === "darslar" && (
          <LessonsTab courseId={id} lessons={lessons} setLessons={setLessons} />
        )}
        {tab === "sozlamalar" && (
          <CourseSettingsTab course={course} setCourse={setCourse} />
        )}
      </div>
    </div>
  );
}
