"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: { name: string } | null;
  _count: { lessons: number };
}

const ICONS: Record<string, string> = {
  "Ona tili": "🇺🇿",
  "Matematika": "📐",
  "Ingliz tili": "🇬🇧",
  "Rus tili": "🇷🇺",
  "Dasturlash": "💻",
  "Marketing": "📣",
  "Dizayn": "🎨",
};

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState<"select" | "confirm">("select");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    fetch("/api/courses").then(r => r.json()).then(setCourses);
  }, []);

  const selectedCourse = courses.find(c => c.id === selected);

  async function handlePay() {
    if (!selected) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selected }),
      });
      if (res.ok) {
        router.push(`/learn/${selected}`);
      } else {
        const d = await res.json();
        alert(d.error);
      }
    } finally {
      setPaying(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-bold text-gray-900">Talim.Uz</span>
          </div>
          <span className="text-sm text-gray-400">Salom, {user?.name} 👋</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {step === "select" && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Yo'nalishingizni tanlang</h1>
              <p className="text-gray-400">Bir martalik to'lov bilan barcha video darslarga kirish oling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {courses.slice(0, 5).map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelected(course.id)}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${
                    selected === course.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-3xl mb-3">
                    {ICONS[course.category?.name || ""] || "📚"}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{course.title}</h3>
                    {selected === course.id && (
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {course.category && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{course.category.name}</span>
                  )}
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">📹 {course._count.lessons} video dars</span>
                    <span className="font-bold text-gray-900">
                      {course.price === 0 ? (
                        <span className="text-green-600">Bepul</span>
                      ) : (
                        `${course.price.toLocaleString("uz-UZ")} so'm`
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* 2-qator: 5 ta kurs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {courses.slice(5, 10).map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelected(course.id)}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${
                    selected === course.id
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-3xl mb-3">
                    {ICONS[course.category?.name || ""] || "📚"}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{course.title}</h3>
                    {selected === course.id && (
                      <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {course.category && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{course.category.name}</span>
                  )}
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">📹 {course._count.lessons}</span>
                    <span className="font-bold text-xs text-gray-900">
                      {course.price === 0 ? (
                        <span className="text-green-600">Bepul</span>
                      ) : (
                        `${course.price.toLocaleString("uz-UZ")} so'm`
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📚</div>
                <p>Hozircha kurslar mavjud emas</p>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={() => selected && setStep("confirm")}
                disabled={!selected}
                className="bg-black text-white px-10 py-3.5 rounded-full font-bold text-base hover:bg-gray-800 transition-colors disabled:opacity-40"
              >
                Davom etish →
              </button>
            </div>
          </>
        )}

        {step === "confirm" && selectedCourse && (
          <div className="max-w-md mx-auto">
            <button onClick={() => setStep("select")} className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1">
              ← Orqaga
            </button>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="text-5xl text-center mb-4">
                {ICONS[selectedCourse.category?.name || ""] || "📚"}
              </div>
              <h2 className="text-2xl font-black text-gray-900 text-center mb-1">{selectedCourse.title}</h2>
              {selectedCourse.category && (
                <p className="text-center text-gray-400 text-sm mb-4">{selectedCourse.category.name}</p>
              )}
              <p className="text-gray-500 text-sm text-center mb-6">{selectedCourse.description}</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Video darslar</span>
                  <span className="font-semibold text-gray-800">{selectedCourse._count.lessons} ta</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kirish muddati</span>
                  <span className="font-semibold text-gray-800">Umrlik</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">To'lov turi</span>
                  <span className="font-semibold text-green-600">Bir martalik</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Jami to'lov</span>
                  <span className="font-black text-xl text-gray-900">
                    {selectedCourse.price === 0 ? (
                      <span className="text-green-600">Bepul</span>
                    ) : (
                      `${selectedCourse.price.toLocaleString("uz-UZ")} so'm`
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {paying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : selectedCourse.price === 0 ? (
                  "Bepul boshlash →"
                ) : (
                  `${selectedCourse.price.toLocaleString("uz-UZ")} so'm to'lash →`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Bir martalik to'lov · Barcha darslarga kirish · Sertifikat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
