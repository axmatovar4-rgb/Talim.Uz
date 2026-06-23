"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import HomeLoginForm from "./HomeLoginForm";

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();

  if (!isOpen) return null;
  if (user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-1" style={{color:"#0F172A"}}>
          Akademiyaga <span style={{color:"#4F46E5"}}>kirish</span>
        </h2>
        <p className="text-sm mb-8" style={{color:"#94A3B8"}}>Shaxsiy hisobingizga kiring va o'qishni davom eting.</p>

        {/* Form */}
        <HomeLoginForm />

        {/* Divider */}
        <div className="mt-5 text-center text-sm" style={{color:"#CBD5E1"}}>yoki</div>

        {/* Register link */}
        <a
          href="/register"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{border:"1.5px solid #E2E8F0", color:"#475569"}}
        >
          ✦ Ro'yxatdan o'tish
        </a>

        {/* Help link */}
        <p className="text-center text-xs mt-6" style={{color:"#94A3B8"}}>
          Muammo bormi?{" "}
          <a href="/register" className="hover:underline" style={{color:"#4F46E5"}}>Biz bilan bog'laning</a>
        </p>
      </div>
    </div>
  );
}
