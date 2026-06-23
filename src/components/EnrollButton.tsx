"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  price: number;
}

export default function EnrollButton({
  courseId,
  isEnrolled,
  isLoggedIn,
  price,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const router = useRouter();

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        setEnrolled(true);
      } else {
        const data = await res.json();
        alert(data.error || "Xato yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  }

  if (enrolled) {
    return (
      <div className="w-full bg-green-50 border border-green-200 text-green-700 text-center py-3 rounded-xl font-semibold">
        ✅ Kursga yozilgansiz
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 text-lg"
    >
      {loading ? "Kutilmoqda..." : price === 0 ? "Bepul boshlash" : "Kursga yozilish"}
    </button>
  );
}
