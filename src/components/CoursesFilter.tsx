"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function CoursesFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function applyFilter(categoryId?: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/courses?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilter(searchParams.get("categoryId") || undefined);
  }

  const activeCategoryId = searchParams.get("categoryId");

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Qidirish</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            🔍
          </button>
        </div>
      </form>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Kategoriyalar</h3>
        <div className="space-y-1">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              router.push(`/courses?${params.toString()}`);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !activeCategoryId
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Barcha kurslar
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => applyFilter(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategoryId === cat.id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
