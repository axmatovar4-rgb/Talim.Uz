"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Email yoki parol noto'g'ri");
      return;
    }

    // Sahifani to'liq yangilab yo'naltirish
    if (data.user.role === "teacher" || data.user.role === "admin") {
      window.location.replace("/dashboard/teacher");
    } else {
      window.location.replace("/dashboard/student");
    }
  }

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAF7" }}>
      <div style={{ width: "100%", maxWidth: 380, backgroundColor: "white", border: "1.5px solid #E2E8F0", borderRadius: 20, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, backgroundColor: "#0F172A", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>T</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 }}>Kirish</h1>
          <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Email</label>
            <input
              name="email"
              type="text"
              required
              placeholder="email@example.com"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Parol</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 14, color: "#0F172A", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "13px", backgroundColor: "#0F172A", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Kirish..." : "Kirish →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94A3B8", marginTop: 20 }}>
          Hisob yo'qmi?{" "}
          <Link href="/register" style={{ color: "#4F46E5", fontWeight: 600 }}>Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}
