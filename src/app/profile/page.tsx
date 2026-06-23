"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CERT_LEVELS, getEarnedCerts, getCurrentLevel } from "@/lib/certificates";

interface Enrollment {
  id: string;
  progress: number;
  createdAt: string;
  course: { id: string; title: string; category?: { name: string } | null; _count: { lessons: number } };
}
interface Payment {
  id: string; amount: number; createdAt: string;
  course: { id: string; title: string };
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/dashboard/student").then(r => r.json()),
      fetch("/api/payment").then(r => r.json()),
    ]).then(([dash, pays]) => {
      setEnrollments(dash.enrollments || []);
      setPayments(Array.isArray(pays) ? pays : []);
      // Completed lessons count (from progress)
      const completed = (dash.enrollments || []).reduce(
        (acc: number, e: Enrollment) => acc + Math.round((e.progress / 100) * e.course._count.lessons), 0
      );
      setTotalCompleted(completed);
    }).finally(() => setFetching(false));
  }, [user]);

  const earnedCerts = getEarnedCerts(totalCompleted);
  const currentLevel = getCurrentLevel(totalCompleted);
  const joinDate = new Date().toLocaleDateString("uz-UZ");

  // Level progress bar
  const levelNames = ["Yangi boshlovchi", "Boshlang'ich", "O'rta daraja", "Yuqori daraja", "Master"];
  const levelIdx = earnedCerts.length;
  const levelPct = Math.min(100, (levelIdx / 4) * 100);

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Talim.Uz</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/dashboard/student" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span>🏠</span> Boshqaruv paneli
          </Link>
          <Link href="/onboarding" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span>📹</span> Darslar
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700">
            <span>👤</span> Profil
          </div>
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{totalCompleted} dars tugatildi</p>
            </div>
          </div>
        </div>
        <button onClick={() => logout()}
          className="mx-4 mb-4 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-700 transition-colors">
          <span>→</span> Chiqish
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-bold text-gray-900">Mening profilim</h1>
          </div>
          {enrollments[0]?.course?.category && (
            <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-semibold">
              {enrollments[0].course.category.name}
            </span>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
          {/* Profile hero */}
          <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black text-white">
                {user?.name?.[0]?.toUpperCase()}-
              </div>
              <div>
                <p className="text-xs text-white/60 font-semibold tracking-widest mb-1">
                  {enrollments[0]?.course?.category?.name?.toUpperCase() || "TALABA"} · O'QUVCHI
                </p>
                <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                <p className="text-white/60 text-sm mt-0.5">@{user?.email?.split("@")[0]} · {joinDate} qo'shilgan</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{levelPct}%</p>
                  <p className="text-xs text-white/60">SUR'AT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "BAJARILGAN", value: `${totalCompleted}/50`, sub: `${Math.round(totalCompleted/50*100)}% umumiy`, color: "text-blue-600" },
              { label: "KURSLAR", value: enrollments.length, sub: "yozilgan", color: "text-orange-500" },
              { label: "SERTIFIKATLAR", value: earnedCerts.length, sub: "olingan", color: "text-purple-600" },
              { label: "TO'LOVLAR", value: payments.length, sub: "marta", color: "text-green-600" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Level progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-700">MENING DARAJAM</p>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-bold">
                {earnedCerts.length > 0 ? earnedCerts[earnedCerts.length-1].icon : "🌱"} {currentLevel}
              </span>
            </div>
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full rounded-full transition-all" style={{
                width: `${(totalCompleted / 50) * 100}%`,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)"
              }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {levelNames.map((name, i) => (
                <span key={name} className={i <= levelIdx ? "text-indigo-500 font-semibold" : ""}>{name}</span>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-bold text-gray-700 mb-1">YUTUQLAR</p>
            <p className="text-xs text-gray-400 mb-4">Yo'l davomida olingan belgilar</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CERT_LEVELS.map(cert => {
                const earned = totalCompleted >= cert.required;
                return (
                  <div key={cert.id} className={`rounded-xl p-4 text-center transition-all ${earned ? "border border-gray-100" : "border border-dashed border-gray-200 opacity-50"}`}
                    style={{ backgroundColor: earned ? cert.bg : "#f9fafb" }}>
                    <div className="text-3xl mb-2">{earned ? cert.icon : "🔒"}</div>
                    <p className="text-xs font-bold" style={{ color: earned ? cert.color : "#9ca3af" }}>
                      {cert.subtitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {earned ? "Olindi" : `${cert.required} dars`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent lessons + Account info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enrolled courses */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-gray-700">KURSLARIM</p>
                <Link href="/onboarding" className="text-xs text-indigo-500 hover:underline">Barchasi →</Link>
              </div>
              {enrollments.length === 0 ? (
                <p className="text-sm text-gray-400">Hali kurs yo'q</p>
              ) : (
                <div className="space-y-3">
                  {enrollments.slice(0, 4).map(e => (
                    <Link key={e.id} href={`/learn/${e.course.id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                        {e.course.title[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{e.course.title}</p>
                        <p className="text-xs text-gray-400">{e.course._count.lessons} dars</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-1">HISOB MA'LUMOTLARI</p>
              <p className="text-xs text-gray-400 mb-4">Faqat ko'rish uchun</p>
              <div className="space-y-3">
                {[
                  { icon: "👤", label: "Ism va familiya", value: user?.name },
                  { icon: "📧", label: "Email", value: user?.email },
                  { icon: "🔵", label: "Holat", value: "Faol", badge: true },
                  { icon: "🎭", label: "Rol", value: user?.role === "teacher" ? "O'qituvchi" : "O'quvchi" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">Faol</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-800">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-indigo-400 bg-indigo-50 rounded-lg p-3 mt-4">
                Login, parol, ism yoki yo'nalishni o'zgartirish — faqat admin orqali. Iltimos, o'qituvchi yoki ma'muriyatga murojaat qiling.
              </p>
            </div>
          </div>

          {/* Danger */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="text-sm font-semibold text-gray-700">Mavzu</p>
                <p className="text-xs text-gray-400">Yorug' rejim yoqlgan</p>
              </div>
            </div>
            <button onClick={() => logout()}
              className="bg-red-50 rounded-xl border border-red-200 p-4 flex items-center gap-3 hover:bg-red-100 transition-colors text-left">
              <span className="text-2xl">🚪</span>
              <div>
                <p className="text-sm font-semibold text-red-600">Hisobdan chiqish</p>
                <p className="text-xs text-red-400">Joriy sessiyani tugatish</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
