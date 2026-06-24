"use client";

import { useState } from "react";
import type { Lesson } from "@/types/teacher";

interface Props {
  courseId: string;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

// YouTube URL dan ID ajratib olish
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
    /youtube\.com\/shorts\/([^?\s]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function LessonsTab({ courseId, lessons, setLessons }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", videoUrl: "", duration: "", isFree: false,
  });

  const ytId = getYouTubeId(form.videoUrl);
  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;

  function resetForm() {
    setForm({ title: "", description: "", videoUrl: "", duration: "", isFree: false });
    setShowAdd(false);
    setEditId(null);
  }

  function startEdit(lesson: Lesson) {
    setForm({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration ? String(lesson.duration) : "",
      isFree: lesson.isFree,
    });
    setEditId(lesson.id);
    setShowAdd(false);
  }

  async function saveLesson() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/lessons/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setLessons(prev => prev.map(l => l.id === editId ? { ...l, ...updated } : l));
      } else {
        const res = await fetch(`/api/courses/${courseId}/lessons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setLessons(prev => [...prev, created]);
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm("Darsni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    setLessons(prev => prev.filter(l => l.id !== id));
  }

  function formatDur(sec: number | null) {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold" style={{ color: "#0F172A" }}>
          Darslar ({lessons.length})
        </h2>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditId(null);
            setForm({ title: "", description: "", videoUrl: "", duration: "", isFree: false });
          }}
          className="text-white text-sm px-4 py-2 rounded-xl font-medium"
          style={{ backgroundColor: "#0F172A" }}
        >
          + Dars qo'shish
        </button>
      </div>

      {/* Add/Edit form */}
      {(showAdd || editId) && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0" }}>
          <h3 className="font-bold mb-4" style={{ color: "#0F172A" }}>
            {editId ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
          </h3>

          <div className="space-y-4">
            {/* Dars nomi */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "#475569" }}>
                Dars nomi *
              </label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Masalan: JavaScript nima?"
                className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                style={{ border: "1.5px solid #E2E8F0", color: "#0F172A" }}
              />
            </div>

            {/* YouTube URL */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "#475569" }}>
                🎬 YouTube video linki
              </label>
              <input
                value={form.videoUrl}
                onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=... yoki https://youtu.be/..."
                className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                style={{ border: "1.5px solid #E2E8F0", color: "#0F172A" }}
              />

              {/* YouTube preview */}
              {ytId && (
                <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1.5px solid #E2E8F0" }}>
                  <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#F8FAFC" }}>
                    <span className="text-xs font-medium" style={{ color: "#16a34a" }}>✅ YouTube video topildi</span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>ID: {ytId}</span>
                  </div>
                  <div className="relative bg-black" style={{ paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`${embedUrl}?rel=0`}
                      title="YouTube preview"
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              )}

              {/* Invalid URL hint */}
              {form.videoUrl && !ytId && (
                <p className="mt-1 text-xs" style={{ color: "#EF4444" }}>
                  ⚠️ YouTube linki tanilmadi. youtube.com/watch?v=... yoki youtu.be/... formatida kiriting
                </p>
              )}
            </div>

            {/* Tavsif va davomiylik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "#475569" }}>Tavsif</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Dars haqida qisqacha..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none resize-none"
                  style={{ border: "1.5px solid #E2E8F0", color: "#0F172A" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "#475569" }}>
                  Davomiylik (soniya)
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                  placeholder="600 = 10 daqiqa"
                  className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none"
                  style={{ border: "1.5px solid #E2E8F0", color: "#0F172A" }}
                />
                <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>
                  600 = 10 daqiqa, 900 = 15 daqiqa
                </p>
              </div>
            </div>

            {/* Bepul */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={e => setForm(p => ({ ...p, isFree: e.target.checked }))}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm" style={{ color: "#475569" }}>
                Bepul namuna dars (ro'yxatdan o'tmagan ham ko'ra oladi)
              </span>
            </label>
          </div>

          <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
            <button
              onClick={saveLesson}
              disabled={saving || !form.title.trim()}
              className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#0F172A" }}
            >
              {saving ? "Saqlanmoqda..." : editId ? "Saqlash" : "Qo'shish"}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl text-sm"
              style={{ border: "1.5px solid #E2E8F0", color: "#475569" }}
            >
              Bekor
            </button>
          </div>
        </div>
      )}

      {/* Lessons list */}
      {lessons.length === 0 ? (
        <div className="text-center py-14 rounded-2xl" style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0" }}>
          <div className="text-4xl mb-3">🎬</div>
          <p className="font-medium" style={{ color: "#0F172A" }}>Hali dars qo'shilmagan</p>
          <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Yuqoridagi "+ Dars qo'shish" tugmasidan boshlang</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...lessons].sort((a, b) => a.position - b.position).map((lesson, idx) => {
            const ytThumb = lesson.videoUrl ? (() => {
              const id = getYouTubeId(lesson.videoUrl!);
              return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
            })() : null;

            return (
              <div key={lesson.id}
                className="rounded-xl flex items-center gap-3 p-3"
                style={{
                  backgroundColor: "white",
                  border: `1.5px solid ${editId === lesson.id ? "#4F46E5" : "#E2E8F0"}`
                }}>
                {/* Thumbnail or number */}
                {ytThumb ? (
                  <img src={ytThumb} alt="" className="w-16 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}>
                    {idx + 1}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#F0FDF4", color: "#16a34a" }}>Bepul</span>
                    )}
                    {lesson.videoUrl && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#EEF2FF", color: "#4F46E5" }}>▶ YouTube</span>
                    )}
                  </div>
                  {lesson.duration && (
                    <span className="text-xs" style={{ color: "#94A3B8" }}>⏱ {formatDur(lesson.duration)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(lesson)}
                    className="text-xs font-medium" style={{ color: "#4F46E5" }}>
                    Tahrirlash
                  </button>
                  <button onClick={() => deleteLesson(lesson.id)}
                    className="text-xs" style={{ color: "#EF4444" }}>
                    O'chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
