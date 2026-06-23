"use client";

import { useState } from "react";
import type { Lesson } from "@/types/teacher";

interface Props {
  courseId: string;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}

export default function LessonsTab({ courseId, lessons, setLessons }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "", duration: "", isFree: false });

  function resetForm() {
    setForm({ title: "", description: "", videoUrl: "", duration: "", isFree: false });
    setShowAdd(false); setEditId(null);
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
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        const updated = await res.json();
        setLessons(prev => prev.map(l => l.id === editId ? { ...l, ...updated } : l));
      } else {
        const res = await fetch(`/api/courses/${courseId}/lessons`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
        });
        const created = await res.json();
        setLessons(prev => [...prev, created]);
      }
      resetForm();
    } finally { setSaving(false); }
  }

  async function deleteLesson(id: string) {
    if (!confirm("Darsni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    setLessons(prev => prev.filter(l => l.id !== id));
  }

  function formatDur(sec: number | null) {
    if (!sec) return null;
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="space-y-4">
      {/* Add lesson button */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Darslar ro'yxati ({lessons.length})</h2>
        <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ title:"",description:"",videoUrl:"",duration:"",isFree:false }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Dars qo'shish
        </button>
      </div>

      {/* Add / Edit form */}
      {(showAdd || editId) && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">{editId ? "Darsni tahrirlash" : "Yangi dars"}</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Dars nomi *</label>
              <input value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
                placeholder="Masalan: JavaScript asoslari"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Tavsif</label>
              <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
                placeholder="Dars haqida qisqacha..." rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Video URL (YouTube, Vimeo yoki mp4)</label>
                <input value={form.videoUrl} onChange={e => setForm(p=>({...p,videoUrl:e.target.value}))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Davomiylik (soniya)</label>
                <input type="number" value={form.duration} onChange={e => setForm(p=>({...p,duration:e.target.value}))}
                  placeholder="600 (10 daqiqa)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isFree} onChange={e => setForm(p=>({...p,isFree:e.target.checked}))}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"/>
              <span className="text-sm text-gray-600">Bepul namuna dars (kirish talab etilmaydi)</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={saveLesson} disabled={saving || !form.title.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? "Saqlanmoqda..." : editId ? "Saqlash" : "Qo'shish"}
            </button>
            <button onClick={resetForm} className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Bekor
            </button>
          </div>
        </div>
      )}

      {/* Lessons list */}
      {lessons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">🎬</div>
          <p className="text-gray-500 font-medium">Hali dars qo'shilmagan</p>
          <p className="text-gray-400 text-sm mt-1">Yuqoridagi tugmadan boshlang</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.sort((a,b)=>a.position-b.position).map((lesson, idx) => (
            <div key={lesson.id} className={`bg-white rounded-xl border px-4 py-4 flex items-start gap-4 ${editId===lesson.id?"border-blue-300":"border-gray-200"}`}>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800 text-sm">{lesson.title}</span>
                  {lesson.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Bepul</span>}
                  {lesson.videoUrl && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🎬 Video</span>}
                </div>
                {lesson.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{lesson.description}</p>}
                {lesson.videoUrl && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">🔗 {lesson.videoUrl}</p>
                )}
                {lesson.duration && <span className="text-xs text-gray-400">⏱ {formatDur(lesson.duration)}</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => startEdit(lesson)}
                  className="text-xs text-blue-600 hover:underline">Tahrirlash</button>
                <button onClick={() => deleteLesson(lesson.id)}
                  className="text-xs text-red-500 hover:text-red-700">O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
