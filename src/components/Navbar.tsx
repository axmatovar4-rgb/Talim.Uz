"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Bosh sahifada navbar ko'rsatilmaydi (split-screen layout o'zi navigatsiyani o'z ichiga oladi)
  if (pathname === "/") return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Talim<span className="text-blue-600">.Uz</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
              Kurslar
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href={user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm">{user.name}</span>
                      <button
                        onClick={logout}
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Chiqish
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Kirish
                    </Link>
                    <Link
                      href="/register"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Ro'yxatdan o'tish
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menyu"
          >
            <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700"></div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link href="/courses" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setMenuOpen(false)}>
              Kurslar
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href={user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}
                      className="block text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button onClick={logout} className="block text-red-500 py-2">
                      Chiqish
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-gray-600 py-2" onClick={() => setMenuOpen(false)}>
                      Kirish
                    </Link>
                    <Link href="/register" className="block text-blue-600 py-2" onClick={() => setMenuOpen(false)}>
                      Ro'yxatdan o'tish
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
