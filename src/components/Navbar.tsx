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
    <nav className="bg-white border-b sticky top-0 z-50" style={{borderColor:"#E2E8F0"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:"#0F172A"}}>
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl" style={{color:"#0F172A"}}>
              Talim<span style={{color:"#94A3B8"}}>.Uz</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="transition-colors text-sm" style={{color:"#475569"}}>
              Kurslar
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href={user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}
                      className="transition-colors text-sm" style={{color:"#475569"}}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor:"#EEF2FF"}}>
                        <span className="font-semibold text-sm" style={{color:"#4F46E5"}}>
                          {user.name[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm" style={{color:"#0F172A"}}>{user.name}</span>
                      <button onClick={logout} className="text-sm transition-colors" style={{color:"#94A3B8"}}>
                        Chiqish
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm transition-colors" style={{color:"#475569"}}>
                      Kirish
                    </Link>
                    <Link
                      href="/register"
                      className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{backgroundColor:"#4F46E5"}}
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
