"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CERT_LEVELS } from "@/lib/certificates";

interface Lesson {
  id: string; title: string; position: number;
  duration: number | null; completed?: boolean;
}
interface Course {
  id: string; title: string;
  category?: { name: string } | null;
}

type Filter = "all" | "beginner" | "intermediate" | "advanced" | "master";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Barchasi",
  beginner: "Boshlovchi (1-10)",
  intermediate: "O'rta (11-20)",
  advanced: "Yuqori (21-35)",
  master: "Master (36-50)",
};

function getFilter(pos: number): Filter {
  if (pos <= 10) return "beginner";
  if (pos <= 20) return "intermediate";
  if (pos <= 35) return "advanced";
  return "master";
}

export default function RoadmapPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/courses/${courseId}`)
      .then(r => r.json())
      .then(d => {
        setCourse(d);
        setLessons(d.lessons || []);
      })
      .finally(() => setFetching(false));
  }, [courseId, user]);

  const completedCount = lessons.filter(l => l.completed).length;
  const filtered = filter === "all" ? lessons : lessons.filter(l => getFilter(l.position) === filter);

  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#E2E8F0", borderTopColor: "#4F46E5" }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      {/* Navbar */}
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-3 flex items-center gap-4"
        style={{ borderColor: "#E2E8F0" }}>
        <Link href={`/learn/${courseId}`}
          className="flex items-center gap-1 text-sm"
          style={{ color: "#94A3B8" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Darslarga qaytish
        </Link>
        <span style={{ color: "#E2E8F0" }}>|</span>
        <span className="font-semibold text-sm" style={{ color: "#0F172A" }}>
          {course?.title} — Darslar xaritasi
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1" style={{ color: "#0F172A" }}>Darslar xaritasi</h1>
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            {completedCount}/{lessons.length} dars tugatildi
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%`, backgroundColor: "#4F46E5" }} />
          </div>
        </div>

        {/* Sertifikat bosqichlari */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {CERT_LEVELS.map(cert => {
            const earned = completedCount >= cert.required;
            return (
              <div key={cert.id} className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: earned ? cert.bg : "white",
                  border: `1.5px solid ${earned ? cert.color + "40" : "#E2E8F0"}`
                }}>
                <div className="text-2xl mb-1">{earned ? cert.icon : "🔒"}</div>
                <p className="text-xs font-bold" style={{ color: earned ? cert.color : "#94A3B8" }}>
                  {cert.subtitle}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                  {cert.required} dars
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                backgroundColor: filter === f ? "#0F172A" : "white",
                color: filter === f ? "white" : "#475569",
                border: "1.5px solid #E2E8F0"
              }}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Darslar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...filtered].sort((a, b) => a.position - b.position).map(lesson => (
            <Link key={lesson.id} href={`/learn/${courseId}`}
              className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-sm"
              style={{
                backgroundColor: lesson.completed ? "#F0FDF4" : "white",
                border: `1.5px solid ${lesson.completed ? "#BBF7D0" : "#E2E8F0"}`
              }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: lesson.completed ? "#16a34a" : "#F1F5F9",
                  color: lesson.completed ? "white" : "#94A3B8"
                }}>
                {lesson.completed ? "✓" : lesson.position}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#0F172A" }}>
                  {lesson.title}
                </p>
                {lesson.duration && (
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    ⏱ {Math.floor(lesson.duration / 60)} daqiqa
                  </p>
                )}
              </div>
              <span className="text-xs flex-shrink-0"
                style={{ color: lesson.completed ? "#16a34a" : "#CBD5E1" }}>
                {lesson.completed ? "✅" : "▶"}
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10" style={{ color: "#94A3B8" }}>
            Bu bo'limda hali darslar yo'q
          </div>
        )}
      </div>
    </div>
  );
}
