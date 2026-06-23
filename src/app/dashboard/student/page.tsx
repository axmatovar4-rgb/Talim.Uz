"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Enrollment {
  id: string;
  progress: number;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    teacher: { name: string };
    _count: { lessons: number };
  };
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push(user?.role === "teacher" ? "/dashboard/teacher" : "/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "student") {
      fetch("/api/dashboard/student")
        .then((r) => r.json())
        .then((data) => setEnrollments(data.enrollments || []))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Salom, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Talaba paneli</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="text-3xl font-bold text-blue-600">{enrollments.length}</div>
          <div className="text-blue-700 mt-1">Kurslar</div>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <div className="text-3xl font-bold text-green-600">
            {enrollments.reduce((acc, e) => acc + e.course._count.lessons, 0)}
          </div>
          <div className="text-green-700 mt-1">Jami darslar</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <div className="text-3xl font-bold text-purple-600">
            {enrollments.filter((e) => e.progress === 100).length}
          </div>
          <div className="text-purple-700 mt-1">Tugatilgan kurslar</div>
        </div>
      </div>

      {/* Courses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Mening kurslarim</h2>
          <Link href="/courses" className="text-blue-600 text-sm hover:underline">
            + Yangi kurs topish
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Hali kurs yo'q</h3>
            <p className="text-gray-500 mb-6">Birinchi kursingizga yoziling!</p>
            <Link
              href="/courses"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Kurslarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
              <Link key={enrollment.id} href={`/courses/${enrollment.course.id}`}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600">📖</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{enrollment.course.teacher.name}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    📹 {enrollment.course._count.lessons} ta dars
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Jarayon</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
