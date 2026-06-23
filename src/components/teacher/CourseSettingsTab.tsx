"use client";

import { useState, useEffect } from "react";
import type { Course } from "@/types/teacher";

interface Category { id: string; name: string; }

interface Props {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

export default function CourseSettingsTab({ course, setCourse }: Props) {
  const [form, setForm] = useState({
    title: course.title,
    description: course.description,
    price: String(course.price),
    thumbnail: course.thumbnail || "",
    categoryId: course.categoryId || "",
    isPublished: course.isPublished,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then(r=>r.json()).then(setCategories);
  }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: Number(form.price) || 0,
          thumbnail: form.thumbnail || null,
          categoryId: form.categoryId || null,
          isPublished: form.isPublished,
        }),
      });
      const updated = await res.json();
      setCourse((prev) => prev ? { ...prev, ...updated } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  async function togglePublish() {
    const newVal = !form.isPublished;
    setForm(p => ({ ...p, isPublished: newVal }));
    await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: newVal }),
    });
    setCourse(prev => prev ? { ...prev, isPublished: newVal } : prev);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main settings */}
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Asosiy ma'lumotlar</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Kurs nomi *</label>
              <input value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Tavsif *</label>
              <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
                rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Narx (so'm)</label>
                <input type="number" min="0" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))}
                  placeholder="0 = bepul"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Kategoriya</label>
                <select value={form.categoryId} onChange={e => setForm(p=>({...p,categoryId:e.target.value}))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white">
                  <option value="">— Tanlanmagan —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Muqova rasm URL</label>
              <input value={form.thumbnail} onChange={e => setForm(p=>({...p,thumbnail:e.target.value}))}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"/>
              {form.thumbnail && (
                <img src={form.thumbnail} alt="muqova" className="mt-2 w-full h-36 object-cover rounded-lg border border-gray-200"/>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            <button onClick={handleSave} disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">✅ Saqlandi!</span>}
          </div>
        </div>
      </div>

      {/* Right sidebar settings */}
      <div className="space-y-4">
        {/* Publish */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Nashr holati</h3>
          <div className={`flex items-center justify-between p-3 rounded-lg ${form.isPublished?"bg-green-50 border border-green-200":"bg-gray-50 border border-gray-200"}`}>
            <div>
              <p className={`text-sm font-semibold ${form.isPublished?"text-green-700":"text-gray-600"}`}>
                {form.isPublished ? "✅ Faol" : "⏸ Qoralama"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.isPublished ? "Talabalar ko'ra oladi" : "Faqat siz ko'rasiz"}
              </p>
            </div>
            <button onClick={togglePublish}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${form.isPublished?"bg-red-100 text-red-600 hover:bg-red-200":"bg-green-600 text-white hover:bg-green-700"}`}>
              {form.isPublished ? "Yashirish" : "Nashr qilish"}
            </button>
          </div>
        </div>

        {/* Quick info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Kurs ID</h3>
          <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-2 rounded-lg break-all">{course.id}</p>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-100 p-5">
          <h3 className="font-semibold text-red-600 mb-3">Xavfli zona</h3>
          <p className="text-xs text-gray-400 mb-3">Kursni o'chirish qaytarib bo'lmaydi. Barcha darslar ham o'chadi.</p>
          <button
            onClick={async () => {
              if (!confirm("Kursni butunlay o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi!")) return;
              await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
              window.location.href = "/dashboard/teacher";
            }}
            className="w-full text-sm text-red-500 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium">
            Kursni o'chirish
          </button>
        </div>
      </div>
    </div>
  );
}
