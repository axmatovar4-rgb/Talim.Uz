"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Bosh sahifada navbar ko'rsatilmaydi
  if (pathname === "/") return null;

  // Learn sahifasida ham o'z navbari bor
  if (pathname.startsWith("/learn/")) return null;

  // Sahifaga qarab orqaga link
  const backMap: Record<string, { label: string; href: string }> = {
    "/courses": { label: "Bosh sahifa", href: "/" },
    "/login": { label: "Bosh sahifa", href: "/" },
    "/register": { label: "Bosh sahifa", href: "/" },
    "/onboarding": { label: "Dashboard", href: "/dashboard/student" },
    "/profile": { label: "Dashboard", href: "/dashboard/student" },
    "/dashboard/student": { label: "Bosh sahifa", href: "/" },
    "/dashboard/teacher": { label: "Bosh sahifa", href: "/" },
  };

  // Dynamic sahifalar
  let backLink = backMap[pathname];
  if (!backLink && pathname.startsWith("/courses/")) {
    backLink = { label: "Kurslar", href: "/courses" };
  }
  if (!backLink && pathname.startsWith("/dashboard/teacher/courses/")) {
    backLink = { label: "Dashboard", href: "/dashboard/teacher" };
  }

  const dashboardHref = user?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <nav className="bg-white border-b sticky top-0 z-50" style={{ borderColor: "#E2E8F0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">

          {/* Orqaga tugma */}
          {backLink && (
            <button
              onClick={() => router.push(backLink!.href)}
              className="flex items-center gap-1 text-sm transition-colors flex-shrink-0"
              style={{ color: "#94A3B8" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="hidden sm:inline">{backLink.label}</span>
            </button>
          )}

          {/* Divider */}
          {backLink && <span style={{ color: "#E2E8F0" }}>|</span>}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0F172A" }}>
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-base" style={{ color: "#0F172A" }}>
              Talim<span style={{ color: "#94A3B8" }}>.Uz</span>
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5 text-sm">
            <Link href="/courses" className="transition-colors" style={{ color: "#475569" }}>
              Kurslar
            </Link>
            {!loading && user && (
              <Link href={dashboardHref} className="transition-colors" style={{ color: "#475569" }}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth area */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/profile">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: "#4F46E5" }}>
                        {user.name[0].toUpperCase()}
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="text-xs transition-colors hidden sm:block"
                      style={{ color: "#94A3B8" }}
                    >
                      Chiqish
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login"
                      className="text-sm transition-colors"
                      style={{ color: "#475569" }}>
                      Kirish
                    </Link>
                    <Link href="/register"
                      className="text-sm text-white px-3 py-1.5 rounded-lg font-medium"
                      style={{ backgroundColor: "#0F172A" }}>
                      Ro'yxatdan o'tish
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-1.5 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "#475569" }}
              aria-label="Menyu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t space-y-2" style={{ borderColor: "#F1F5F9" }}>
            <Link href="/courses" className="block py-2 text-sm" style={{ color: "#475569" }} onClick={() => setMenuOpen(false)}>
              Kurslar
            </Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="block py-2 text-sm" style={{ color: "#475569" }} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile" className="block py-2 text-sm" style={{ color: "#475569" }} onClick={() => setMenuOpen(false)}>
                  Profil
                </Link>
                <button onClick={logout} className="block py-2 text-sm w-full text-left" style={{ color: "#EF4444" }}>
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-sm" style={{ color: "#475569" }} onClick={() => setMenuOpen(false)}>
                  Kirish
                </Link>
                <Link href="/register" className="block py-2 text-sm font-medium" style={{ color: "#4F46E5" }} onClick={() => setMenuOpen(false)}>
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
