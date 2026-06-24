"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Enrollment {
  id: string;
  progress: number;
  course: {
    id: string; title: string;
    category?: { name: string } | null;
    _count: { lessons: number };
  };
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user?.role === "teacher") router.push("/dashboard/teacher");
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === "student") {
      fetch("/api/dashboard/student")
        .then(r => r.json())
        .then(d => setEnrollments(d.enrollments || []))
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#E2E8F0", borderTopColor: "#4F46E5" }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "#0F172A" }}>
              Salom, {user?.name} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Talaba paneli</p>
          </div>
          <Link href="/onboarding"
            className="text-sm text-white px-4 py-2 rounded-xl font-medium"
            style={{ backgroundColor: "#0F172A" }}>
            + Yangi yo'nalish
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Yozilgan kurslar", value: enrollments.length, color: "#4F46E5", bg: "#EEF2FF" },
            { label: "Jami darslar", value: enrollments.reduce((a, e) => a + e.course._count.lessons, 0), color: "#16a34a", bg: "#F0FDF4" },
            { label: "Tugatilgan", value: enrollments.filter(e => e.progress === 100).length, color: "#D97706", bg: "#FFFBEB" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: s.bg }}>
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Kurslar */}
        <h2 className="text-lg font-bold mb-4" style={{ color: "#0F172A" }}>Mening kurslarim</h2>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0" }}>
            <div className="text-5xl mb-3">📚</div>
            <p className="font-semibold mb-2" style={{ color: "#0F172A" }}>Hali yo'nalish tanlanmagan</p>
            <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>Birinchi yo'nalishingizni tanlang va o'qishni boshlang</p>
            <Link href="/onboarding"
              className="text-white px-6 py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: "#0F172A" }}>
              Yo'nalish tanlash →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map(e => (
              <Link key={e.id} href={`/learn/${e.course.id}`}
                className="block rounded-2xl p-5 transition-all hover:shadow-md"
                style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0" }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm leading-tight" style={{ color: "#0F172A" }}>
                    {e.course.title}
                  </h3>
                  {e.course.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                      style={{ backgroundColor: "#F1F5F9", color: "#475569" }}>
                      {e.course.category.name}
                    </span>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>
                  📹 {e.course._count.lessons} dars
                </p>
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#94A3B8" }}>
                    <span>Jarayon</span>
                    <span>{e.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${e.progress}%`, backgroundColor: "#4F46E5" }} />
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
