"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CERT_LEVELS, getEarnedCerts, getCurrentLevel } from "@/lib/certificates";

interface Enrollment {
  id: string; progress: number;
  course: { id: string; title: string; category?: { name: string } | null; _count: { lessons: number } };
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/dashboard/student")
      .then(r => r.json())
      .then(d => {
        setEnrollments(d.enrollments || []);
        const done = (d.enrollments || []).reduce(
          (acc: number, e: Enrollment) => acc + Math.round((e.progress / 100) * e.course._count.lessons), 0
        );
        setTotalCompleted(done);
      })
      .finally(() => setFetching(false));
  }, [user]);

  const earnedCerts = getEarnedCerts(totalCompleted);
  const currentLevel = getCurrentLevel(totalCompleted);
  const levelPct = Math.min(100, Math.round((totalCompleted / 50) * 100));

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#E2E8F0", borderTopColor: "#4F46E5" }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-5">

        {/* Profile hero */}
        <div className="rounded-2xl p-6 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-white/60 font-semibold tracking-widest mb-0.5">
                {user?.role === "teacher" ? "O'QITUVCHI" : user?.role === "admin" ? "ADMIN" : "TALABA"}
              </p>
              <h2 className="text-xl font-black text-white">{user?.name}</h2>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-black text-white">{levelPct}%</div>
            <p className="text-xs text-white/60">umumiy jarayon</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Bajarilgan", value: `${totalCompleted}/50`, color: "#4F46E5", bg: "#EEF2FF" },
            { label: "Kurslar", value: enrollments.length, color: "#D97706", bg: "#FFFBEB" },
            { label: "Sertifikatlar", value: earnedCerts.length, color: "#7C3AED", bg: "#F5F3FF" },
            { label: "Daraja", value: earnedCerts.length > 0 ? earnedCerts[earnedCerts.length - 1].emoji : "🌱", color: "#16a34a", bg: "#F0FDF4" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg }}>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Daraja progress */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1.5px solid #E2E8F0" }}>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold" style={{ color: "#0F172A" }}>Mening darajam</p>
            <span className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}>
              {currentLevel}
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "#F1F5F9" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${levelPct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "#94A3B8" }}>
            <span>Yangi boshlovchi</span>
            <span>Boshlang'ich</span>
            <span>O'rta</span>
            <span>Yuqori</span>
            <span>Master</span>
          </div>
        </div>

        {/* Yutuqlar */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1.5px solid #E2E8F0" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#0F172A" }}>Yutuqlar</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CERT_LEVELS.map(cert => {
              const earned = totalCompleted >= cert.required;
              return (
                <div key={cert.id} className="rounded-xl p-4 text-center"
                  style={{
                    backgroundColor: earned ? cert.bg : "#F8FAFC",
                    border: `1.5px solid ${earned ? cert.color + "40" : "#E2E8F0"}`,
                    opacity: earned ? 1 : 0.6
                  }}>
                  <div className="text-2xl mb-1">{earned ? cert.icon : "🔒"}</div>
                  <p className="text-xs font-bold" style={{ color: earned ? cert.color : "#94A3B8" }}>
                    {cert.subtitle}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    {earned ? "Olindi ✓" : `${cert.required} dars`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kurslar */}
        {enrollments.length > 0 && (
          <div className="bg-white rounded-2xl p-5" style={{ border: "1.5px solid #E2E8F0" }}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-bold" style={{ color: "#0F172A" }}>Kurslarim</p>
              <Link href="/onboarding" className="text-xs" style={{ color: "#4F46E5" }}>+ Yangi</Link>
            </div>
            <div className="space-y-3">
              {enrollments.map(e => (
                <Link key={e.id} href={`/learn/${e.course.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition-all"
                  style={{ border: "1px solid #F1F5F9" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: "#4F46E5" }}>
                    {e.course.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>{e.course.title}</p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>{e.course._count.lessons} dars · {e.progress}%</p>
                  </div>
                  <span className="text-xs" style={{ color: "#94A3B8" }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hisob */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1.5px solid #E2E8F0" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#0F172A" }}>Hisob ma'lumotlari</p>
          <div className="space-y-3">
            {[
              { label: "Ism", value: user?.name },
              { label: "Email", value: user?.email },
              { label: "Rol", value: user?.role === "teacher" ? "O'qituvchi" : user?.role === "admin" ? "Admin" : "Talaba" },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2"
                style={{ borderBottom: "1px solid #F1F5F9" }}>
                <span className="text-sm" style={{ color: "#94A3B8" }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chiqish */}
        <button onClick={logout}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA" }}>
          Hisobdan chiqish
        </button>
      </div>
    </div>
  );
}
