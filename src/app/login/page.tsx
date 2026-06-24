"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#FAFAF7" }}>
      <div className="w-full max-w-sm">
        <div className="rounded-2xl p-8" style={{ backgroundColor: "white", border: "1.5px solid #E2E8F0" }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#0F172A" }}>
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>Kirish</h1>
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Hisobingizga kiring</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl" style={{ backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>Email</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", backgroundColor: "white" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>Parol</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", backgroundColor: "white" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#0F172A" }}
            >
              {loading ? "Kirish..." : "Kirish →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#94A3B8" }}>
            Hisob yo'qmi?{" "}
            <Link href="/register" className="font-medium" style={{ color: "#4F46E5" }}>
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
