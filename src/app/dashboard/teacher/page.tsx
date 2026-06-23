"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  isPublished: boolean;
  price: number;
  createdAt: string;
  category?: { name: string } | null;
  _count: { lessons: number; enrollments: number };
}

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push(user?.role === "student" ? "/dashboard/student" : "/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "teacher") {
      fetch("/api/dashboard/teacher")
        .then((r) => r.json())
        .then((data) => {
          setCourses(data.courses || []);
          setTotalStudents(data.totalStudents || 0);
        })
        .finally(() => setFetching(false));
    }
  }, [user]);

  async function createCourse() {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          price: Number(newPrice) || 0,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => [
          { ...data, category: null, _count: { lessons: 0, enrollments: 0 } },
          ...prev,
        ]);
        setShowModal(false);
        setNewTitle("");
        setNewDesc("");
        setNewPrice("");
      } else {
        alert(data.error);
      }
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(courseId: string, current: boolean) {
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isPublished: !current } : c))
      );
    }
  }

  async function deleteCourse(courseId: string) {
    if (!confirm("Kursni o'chirishni tasdiqlaysizmi?")) return;
    const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  }

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Salom, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">O'qituvchi paneli</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          + Yangi kurs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
          <div className="text-blue-700 mt-1">Jami kurslar</div>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <div className="text-3xl font-bold text-green-600">{totalStudents}</div>
          <div className="text-green-700 mt-1">Talabalar</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <div className="text-3xl font-bold text-orange-600">
            {courses.filter((c) => c.isPublished).length}
          </div>
          <div className="text-orange-700 mt-1">Faol kurslar</div>
        </div>
      </div>

      {/* Courses table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mening kurslarim</h2>

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Hali kurs yo'q</h3>
            <p className="text-gray-500 mb-6">Birinchi kursingizni yarating!</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Kurs yaratish
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kurs nomi</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden sm:table-cell">
                    Talabalar
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 hidden sm:table-cell">
                    Darslar
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Holat</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{course.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {course.price === 0
                            ? "Bepul"
                            : `${course.price.toLocaleString("uz-UZ")} so'm`}
                          {course.category && ` • ${course.category.name}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {course._count.enrollments}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                      {course._count.lessons}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublish(course.id, course.isPublished)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          course.isPublished
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {course.isPublished ? "✅ Faol" : "⏸ Nofaol"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/teacher/courses/${course.id}`}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Boshqarish
                        </Link>
                        <Link
                          href={`/courses/${course.id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Ko'rish
                        </Link>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create course modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Yangi kurs yaratish</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kurs nomi *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: JavaScript asoslari"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif *</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Kurs haqida qisqacha ma'lumot..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Narx (so'm, 0 = bepul)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={createCourse}
                disabled={creating || !newTitle.trim() || !newDesc.trim()}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {creating ? "Yaratilmoqda..." : "Yaratish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
