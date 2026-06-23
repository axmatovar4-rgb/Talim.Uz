"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Category { id: string; name: string; }

export default function CoursesFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const activeCategoryId = searchParams.get("categoryId");

  function applyFilter(categoryId?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/courses?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter(activeCategoryId || undefined);
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <label className="block text-sm font-medium mb-2" style={{ color: "#475569" }}>Qidirish</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi..."
            className="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none"
            style={{ border: "1.5px solid #E2E8F0", backgroundColor: "white", color: "#0F172A" }}
          />
          <button type="submit"
            className="px-3 py-2 rounded-lg text-sm text-white"
            style={{ backgroundColor: "#4F46E5" }}>
            🔍
          </button>
        </div>
      </form>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-3" style={{ color: "#475569" }}>Kategoriyalar</h3>
        <div className="space-y-1">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              router.push(`/courses?${params.toString()}`);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: !activeCategoryId ? "#EEF2FF" : "transparent",
              color: !activeCategoryId ? "#4F46E5" : "#475569",
              fontWeight: !activeCategoryId ? 600 : 400,
            }}
          >
            Barcha kurslar
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => applyFilter(cat.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: activeCategoryId === cat.id ? "#EEF2FF" : "transparent",
                color: activeCategoryId === cat.id ? "#4F46E5" : "#475569",
                fontWeight: activeCategoryId === cat.id ? 600 : 400,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
