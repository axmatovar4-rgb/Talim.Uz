"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CertificateModal from "@/components/CertificateModal";
import { getEarnedCerts, getNextCert, CERT_LEVELS } from "@/lib/certificates";

interface Lesson {
  id: string; title: string; description: string | null;
  videoUrl: string | null; duration: number | null;
  position: number; isFree: boolean; completed?: boolean;
}
interface Course {
  id: string; title: string; description: string;
  category?: { name: string } | null;
  _count: { lessons: number };
}

function getEmbedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

export default function LearnPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [paid, setPaid] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newCert, setNewCert] = useState<(typeof CERT_LEVELS)[0] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/payment?courseId=${courseId}`).then(r => r.json()),
    ]).then(([c, p]) => {
      setCourse(c);
      setLessons(c.lessons || []);
      setActiveLesson((c.lessons || [])[0] || null);
      setPaid(p.paid);
    }).finally(() => setFetching(false));
  }, [courseId, user]);

  async function markComplete(lessonId: string) {
    const before = lessons.filter(l => l.completed).length;
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: true }),
    });
    setLessons(prev => {
      const updated = prev.map(l => l.id === lessonId ? { ...l, completed: true } : l);
      const after = updated.filter(l => l.completed).length;
      // Yangi sertifikat tekshirish
      const prevCerts = getEarnedCerts(before);
      const newCerts = getEarnedCerts(after);
      if (newCerts.length > prevCerts.length) {
        setNewCert(newCerts[newCerts.length - 1]);
      }
      return updated;
    });
  }

  const completedCount = lessons.filter(l => l.completed).length;
  const progressPct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const nextCert = getNextCert(completedCount);
  const earnedCerts = getEarnedCerts(completedCount);

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!paid) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-sm shadow-sm">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Kirish uchun to'lov kerak</h2>
        <p className="text-gray-400 text-sm mb-6">Bu yo'nalish uchun bir martalik to'lov amalga oshiring</p>
        <Link href="/onboarding" className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          To'lov sahifasiga o'tish
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sertifikat modal */}
      {newCert && <CertificateModal cert={newCert} userName={user?.name || ""} onClose={() => setNewCert(null)} />}

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <Link href="/dashboard/student" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0F172A" }}>
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-bold text-sm" style={{ color: "#0F172A" }}>Talim.Uz</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard/student" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span>🏠</span> Boshqaruv paneli
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700">
            <span>📹</span> Darslar
          </div>
          <Link href={`/learn/${courseId}/roadmap`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span>🗺️</span> Darslar xaritasi
          </Link>
          <Link href={`/profile`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span>👤</span> Profil
          </Link>
          <Link href="/onboarding" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span>🎯</span> Yo'nalish tanlash
          </Link>
        </nav>

        {/* Next cert hint */}
        {nextCert && (
          <div className="mx-3 mb-3 p-3 rounded-xl border" style={{ backgroundColor: nextCert.bg, borderColor: nextCert.color + "40" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: nextCert.color }}>
              {nextCert.emoji} Keyingi: {nextCert.subtitle}
            </p>
            <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{
                width: `${Math.min(100, (completedCount / nextCert.required) * 100)}%`,
                backgroundColor: nextCert.color,
              }} />
            </div>
            <p className="text-xs mt-1" style={{ color: nextCert.color }}>
              {completedCount}/{nextCert.required} dars
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{completedCount}/{lessons.length} dars</p>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progressPct}% — {earnedCerts.length > 0 ? earnedCerts[earnedCerts.length-1].subtitle : "Yangi boshlovchi"}</p>
        </div>
        <button onClick={async () => { await fetch("/api/auth/logout",{method:"POST"}); router.push("/"); }}
          className="mx-4 mb-4 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
          style={{ color: "#EF4444", backgroundColor: "#FEF2F2" }}>
          <span>🚪</span> Chiqish
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-sm">{course?.title}</h1>
            {course?.category && <p className="text-xs text-indigo-500">{course.category.name}</p>}
          </div>
          <div className="flex items-center gap-3">
            {earnedCerts.map(c => (
              <span key={c.id} title={c.title} className="text-lg cursor-default">{c.icon}</span>
            ))}
            <span className="text-xs text-gray-400">{completedCount}/{lessons.length} dars</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Video */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeLesson ? (
              <>
                <div className="bg-black rounded-2xl overflow-hidden aspect-video mb-5">
                  {activeLesson.videoUrl ? (
                    <iframe src={getEmbedUrl(activeLesson.videoUrl)} className="w-full h-full" allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={activeLesson.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <div className="text-center"><div className="text-5xl mb-2">🎬</div><p className="text-sm">Video qo'shilmagan</p></div>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Dars {activeLesson.position} / {lessons.length}</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{activeLesson.title}</h2>
                    {activeLesson.description && <p className="text-gray-500 text-sm leading-relaxed">{activeLesson.description}</p>}
                  </div>
                  {!activeLesson.completed ? (
                    <button onClick={() => markComplete(activeLesson.id)}
                      className="flex-shrink-0 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
                      ✅ Tugatdim
                    </button>
                  ) : (
                    <span className="flex-shrink-0 bg-green-100 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">✅ Tugatildi</span>
                  )}
                </div>
                {/* Next lesson */}
                {(() => {
                  const sorted = [...lessons].sort((a,b)=>a.position-b.position);
                  const next = sorted[sorted.findIndex(l=>l.id===activeLesson.id)+1];
                  if (!next) return <div className="text-center py-6 text-green-600 font-semibold">🎉 Barcha darslar tugadi!</div>;
                  return (
                    <button onClick={() => setActiveLesson(next)}
                      className="w-full border border-gray-200 rounded-xl p-4 text-left hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <p className="text-xs text-gray-400 mb-1">Keyingi dars</p>
                      <p className="font-semibold text-gray-800">{next.title}</p>
                    </button>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">📹</div><p>Dars tanlang</p></div>
            )}
          </div>

          {/* Lessons list */}
          <div className="w-72 border-l border-gray-100 bg-white overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 tracking-widest">DARSLAR</p>
              <span className="text-xs text-gray-400">{completedCount}/{lessons.length}</span>
            </div>
            {/* Cert milestones */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              {CERT_LEVELS.map(c => (
                <div key={c.id} className="flex items-center gap-2 py-1">
                  <span className="text-sm">{completedCount >= c.required ? c.icon : "🔒"}</span>
                  <span className={`text-xs ${completedCount >= c.required ? "text-gray-700 font-medium" : "text-gray-300"}`}>
                    {c.required} dars — {c.subtitle}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-2">
              {[...lessons].sort((a,b)=>a.position-b.position).map((lesson,idx)=>(
                <button key={lesson.id} onClick={()=>setActiveLesson(lesson)}
                  className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-colors flex items-start gap-3 ${activeLesson?.id===lesson.id?"bg-indigo-50 border border-indigo-200":"hover:bg-gray-50"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${lesson.completed?"bg-green-500 text-white":activeLesson?.id===lesson.id?"bg-indigo-500 text-white":"bg-gray-100 text-gray-500"}`}>
                    {lesson.completed ? "✓" : idx+1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${activeLesson?.id===lesson.id?"text-indigo-700":"text-gray-700"}`}>{lesson.title}</p>
                    {lesson.duration && <p className="text-xs text-gray-400 mt-0.5">⏱ {Math.floor(lesson.duration/60)} daqiqa</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
