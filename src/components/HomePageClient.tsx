"use client";

import { useState } from "react";
import Link from "next/link";
import TickerBar from "./TickerBar";
import Testimonials from "./Testimonials";
import LoginModal from "./LoginModal";

interface Stats {
  users: number;
  courses: number;
  enrollments: number;
}

export default function HomePageClient({ stats }: { stats: Stats }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{backgroundColor:"#FFFFFF"}}>
      {/* ── NAVBAR ── */}
      <header className="flex items-center justify-between px-8 py-5 border-b sticky top-0 z-50" style={{backgroundColor:"#FFFFFF", borderColor:"#E2E8F0"}}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor:"#0F172A"}}>
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-lg" style={{color:"#0F172A"}}>Talim<span style={{color:"#94A3B8"}}>.Uz</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{color:"#475569"}}>
          <Link href="/courses" className="hover:text-gray-900 transition-colors">Yo'nalishlar</Link>
          <Link href="#roadmap" className="hover:text-gray-900 transition-colors">Yo'l xaritasi</Link>
          <Link href="#reviews" className="hover:text-gray-900 transition-colors">Sharhlar</Link>
          <Link href="#faq" className="hover:text-gray-900 transition-colors">Tez-tez so'raladi</Link>
        </nav>
        <button 
          onClick={() => setIsLoginModalOpen(true)}
          className="text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          style={{backgroundColor:"#0F172A"}}
        >
          Kirish
        </button>
      </header>

      {/* ── HERO SPLIT ── */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* LEFT */}
        <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 py-12 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{backgroundColor:"#EEF2FF"}}>🎓</div>
            <span className="text-sm font-medium" style={{color:"#475569"}}>TALIM.UZ AKADEMIYASI</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{color:"#16a34a", backgroundColor:"#f0fdf4"}}>● {stats.users} o'quvchi faol</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6" style={{color:"#0F172A"}}>
            Online ta'lim<br /><span style={{color:"#94A3B8"}}>yangi bosqichda.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-md mb-8" style={{color:"#475569"}}>
            {stats.courses}+ kurs, mentor bilan amaliyot. Har qadam — video, suhbat, baholash va sertifikat.
          </p>
          <div className="flex items-center gap-2 mb-8">
            <div className="text-xs px-4 py-2 rounded-lg font-mono flex items-center gap-2" style={{backgroundColor:"#1E293B", color:"#4ade80"}}>
              <span style={{color:"#64748b"}}>$</span><span>talim</span>
              <span style={{color:"#64748b"}}>--track</span>
              <span style={{color:"#fbbf24"}}>dasturlash|dizayn|marketing</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-10">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white px-6 py-3 rounded-full font-semibold transition-colors"
              style={{backgroundColor:"#0F172A"}}
            >
              Akademiyaga kirish →
            </button>
            <Link href="/courses" className="px-6 py-3 rounded-full font-semibold transition-colors" style={{border:"1.5px solid #CBD5E1", color:"#475569"}}>
              Yo'nalishlar
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex -space-x-2">
              {["#f87171","#60a5fa","#34d399","#a78bfa"].map((c,i)=>(
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{backgroundColor:c}}>
                  {["A","B","C","D"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm" style={{color:"#f59e0b"}}>★★★★★</span>
            <span className="font-bold text-sm" style={{color:"#0F172A"}}>4.9</span>
            <span className="text-sm" style={{color:"#94A3B8"}}>{stats.enrollments}+ faol o'quvchi</span>
          </div>
        </div>
        {/* RIGHT — Brain illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{backgroundColor:"#F8FAFC"}}>
          {/* Floating windows */}
          <div className="absolute top-20 right-20 w-32 h-24 bg-white rounded-lg shadow-lg p-3 animate-pulse" style={{animationDuration:"3s"}}>
            <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
            <div className="w-3/4 h-2 bg-gray-200 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-blue-200 rounded"></div>
          </div>
          <div className="absolute bottom-32 right-32 w-28 h-20 bg-white rounded-lg shadow-lg p-3 animate-pulse" style={{animationDuration:"4s", animationDelay:"1s"}}>
            <div className="w-full h-2 bg-green-200 rounded mb-2"></div>
            <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
          </div>
          <div className="absolute top-40 right-40 w-24 h-16 bg-white rounded-lg shadow-lg p-3 animate-pulse" style={{animationDuration:"3.5s", animationDelay:"0.5s"}}>
            <div className="w-full h-2 bg-purple-200 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
          </div>
          
          {/* Brain SVG */}
          <div className="w-80 h-80 lg:w-96 lg:h-96 opacity-90 pointer-events-none select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 6"/>
              <circle cx="200" cy="200" r="140" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 5"/>
              <circle cx="200" cy="200" r="100" stroke="#d1d5db" strokeWidth="1"/>
              <path d="M200 140 C190 130,170 128,158 138 C145 148,140 160,142 172 C138 176,132 182,133 192 C130 202,135 214,143 220 C140 230,143 242,153 248 C163 254,175 252,182 246 C185 252,188 258,192 260 L200 260" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M200 140 C210 130,230 128,242 138 C255 148,260 160,258 172 C262 176,268 182,267 192 C270 202,265 214,257 220 C260 230,257 242,247 248 C237 254,225 252,218 246 C215 252,212 258,208 260 L200 260" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="200" y1="140" x2="200" y2="260" stroke="#111827" strokeWidth="1.5" strokeDasharray="4 3"/>
              <path d="M158 165 C165 160,172 165,170 172" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M148 185 C155 178,165 180,163 190" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M152 205 C160 198,172 202,168 212" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M160 225 C168 220,178 223,175 232" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M215 155 L230 155 L230 165 L245 165" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M220 175 L235 175 L235 190 L248 190" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M215 200 L225 200 L225 210 L240 210" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <circle cx="230" cy="165" r="2.5" fill="#111827"/>
              <circle cx="248" cy="190" r="2.5" fill="#111827"/>
              <circle cx="240" cy="210" r="2.5" fill="#111827"/>
              <rect x="258" y="152" width="90" height="26" rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
              <text x="266" y="170" fontSize="10" fill="#374151" fontFamily="sans-serif" fontWeight="600">Dasturlash</text>
              <rect x="268" y="282" width="96" height="26" rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
              <text x="276" y="300" fontSize="10" fill="#374151" fontFamily="sans-serif" fontWeight="600">AI Engineering</text>
              <rect x="18" y="268" width="82" height="26" rx="7" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
              <text x="26" y="286" fontSize="10" fill="#374151" fontFamily="sans-serif" fontWeight="600">Dizayn</text>
              <circle cx="318" cy="128" r="5" fill="#fbbf24"/>
              <circle cx="78" cy="298" r="4" fill="#fbbf24"/>
              <circle cx="338" cy="308" r="3.5" fill="#f87171"/>
              <circle cx="58" cy="158" r="3" fill="#60a5fa"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <TickerBar />

      {/* ── YO'NALISHLAR ── */}
      <section className="py-20 px-8" style={{backgroundColor:"#F3F3EE"}}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm mb-3" style={{color:"#94A3B8"}}>3 ta yo'nalish</p>
          <h2 className="text-4xl font-black text-center mb-2" style={{color:"#0F172A"}}>
            O'zingizning <span style={{color:"#4F46E5"}}>o'qish yo'lingiz</span>
          </h2>
          <p className="text-center mb-12 max-w-lg mx-auto" style={{color:"#475569"}}>
            Har yo'nalish kurslardan iborat. Yo'nalishingizni tanlaydi, siz esa o'z sur'atingizda bosib o'tasiz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag:"DASTURLASH", title:"Zamonaviy veb ishlab chiqish", desc:"React, Next.js, Node.js — to'liq stack. Boshlovchidan Senior darajasigacha.", tags:["React","Next.js","Backend","Deploy"], color:"from-gray-800 to-gray-950" },
              { tag:"DIZAYN", title:"UI/UX va grafik dizayn", desc:"Figma, branding, prototiplash — professional darajada yarating.", tags:["Figma","Branding","UX","Prototype"], color:"from-teal-700 to-teal-950" },
              { tag:"MARKETING", title:"Raqamli marketing san'ati", desc:"SEO, SMM, targetli reklama — biznesingizni o'stirish.", tags:["SEO","SMM","Ads","Analytics"], color:"from-purple-700 to-pink-800" },
            ].map((item)=>(
              <div key={item.tag} className={`bg-gradient-to-b ${item.color} rounded-2xl p-7 flex flex-col justify-between min-h-[320px]`}>
                <div>
                  <span className="text-xs font-bold tracking-widest text-white/60 border border-white/20 px-3 py-1 rounded-full">{item.tag}</span>
                  <h3 className="text-2xl font-black text-white mt-5 mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-5 mt-4">
                    {item.tags.map(t=>(
                      <span key={t} className="text-xs text-white/70 border border-white/20 px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-yellow-400 mb-3">
                    {stats.courses * 25}+ qadam · 4 bo'lim
                  </div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(12)].map((_,i)=>(
                      <div key={i} className={`flex-1 h-1.5 rounded-full ${i<4?"bg-yellow-400":"bg-white/20"}`}/>
                    ))}
                  </div>
                  <Link href="/courses" className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
                    Boshlash →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-8">→ Yon tomonga aylantirib ko'ring</p>
        </div>
      </section>

      {/* ── YO'L XARITASI ── */}
      <section id="roadmap" className="py-20 px-8" style={{backgroundColor:"#FFFFFF"}}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm mb-3" style={{color:"#94A3B8"}}>Yo'l xaritasi</p>
          <h2 className="text-4xl font-black text-center mb-3" style={{color:"#0F172A"}}>
            Bir qadam — bir <span style={{color:"#4F46E5"}}>tajriba</span>
          </h2>
          <p className="text-center mb-14 max-w-lg mx-auto" style={{color:"#475569"}}>
            Har bir qadam shu 8 bosqichdan o'tadi. Tartibli, izchil, mukammal.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n:"01", title:"Ro'yxatdan o'tish", desc:"Emailingiz va parolingizni belgilab, bir daqiqada hisob yarating" },
              { n:"02", title:"Yo'nalish tanlash", desc:"7 ta yo'nalishdan birini tanlang va bir martalik to'lov qiling" },
              { n:"03", title:"Video darslarni ko'ring", desc:"Har bir dars 10-15 daqiqalik tushuntirili video. Istalgan vaqtda" },
              { n:"04", title:"Amaliyot bajaring", desc:"Har darsdan keyin topshiriq — bilimingizni mustahkamlang" },
              { n:"05", title:"Boshlovchi sertifikat", desc:"10 ta darsni tugating — Boshlovchi sertifikatini oling", dark:true },
              { n:"06", title:"O'rta daraja", desc:"20 ta dars — O'rta daraja sertifikati sizniki", dark:false },
              { n:"07", title:"Yuqori daraja", desc:"35 ta darsni yakunlang — Yuqori daraja sertifikatini qo'lga kiriting", dark:false },
              { n:"08", title:"Master sertifikat", desc:"50 ta darsni tugatgan o'quvchiga Master sertifikati beriladi", dark:true },
            ].map((item)=>(
              <div key={item.n} className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  backgroundColor: item.dark ? "#0F172A" : "#F8FAFC",
                  border: item.dark ? "none" : "1.5px solid #E2E8F0"
                }}>
                <p className="text-xs font-bold tracking-widest mb-3" style={{color: item.dark ? "#475569" : "#94A3B8"}}>
                  BOSQICH {item.n}
                </p>
                <h4 className="font-bold text-base mb-2" style={{color: item.dark ? "#F8FAFC" : "#0F172A"}}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{color: item.dark ? "#64748B" : "#475569"}}>{item.desc}</p>
                <div className="absolute bottom-4 right-4 text-6xl font-black opacity-10" style={{color: item.dark ? "#fff" : "#CBD5E1"}}>{item.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-8" style={{background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)"}}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { num: stats.enrollments * 25 + "+", label:"QADAM", sub:"kurslar × darslar" },
            { num:"4", label:"BO'LIM", sub:"Boshlovchidan Master darajasigacha" },
            { num:"85", label:"BALL/100", sub:"Mentor o'tish bali" },
            { num:"∞", label:"IMKONIYAT", sub:"Kursdan keyin rivojlanish" },
          ].map((s)=>(
            <div key={s.label}>
              <div className="text-5xl font-black text-yellow-400 mb-1">{s.num}</div>
              <div className="text-xs font-bold tracking-widest text-white/50 mb-1">{s.label}</div>
              <div className="text-sm text-white/40">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHARHLAR ── */}
      <section id="reviews" className="py-20 px-8" style={{backgroundColor:"#F3F3EE"}}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm mb-3" style={{color:"#94A3B8"}}>Sharhlar</p>
          <h2 className="text-4xl font-black text-center mb-14" style={{color:"#0F172A"}}>
            O'quvchilar <span style={{color:"#4F46E5"}}>nima deydi</span>
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* ── CTA QORA KARD ── */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-950 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-10">
            <div className="flex-1">
              <span className="text-xs font-bold tracking-widest text-green-400 flex items-center gap-1 mb-5">
                ● BUGUN BOSHLANG · 2026
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                Birinchi qadam<br />
                — <span className="text-gray-400">bugun.</span><br />
                Ertangi kasbingiz <span className="text-indigo-400">shu yerda.</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-sm">
                Ro'yxatdan o'ting, yo'nalishingizni tanlang va darhol o'qishni boshlang. Hamma narsa sizning qo'lingizda.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="bg-white text-gray-900 px-7 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                  Bepul ro'yxatdan o'tish →
                </Link>
                <Link href="/courses" className="border border-gray-700 text-gray-300 px-7 py-3.5 rounded-full font-medium hover:border-gray-500 transition-colors">
                  Kurslarni ko'rish
                </Link>
              </div>
            </div>
            <div className="w-full md:w-72 bg-gray-900 rounded-2xl p-5 flex-shrink-0">
              <p className="text-xs text-gray-500 font-bold tracking-widest mb-4">BOSHLASH — 3 QADAM</p>
              {[
                { n:"01", t:"Ro'yxatdan o'ting", d:"Email va parol bilan bir daqiqada hisob yarating" },
                { n:"02", t:"Yo'nalishni tanlang", d:"Ona tili · Matematika · Ingliz tili · Dasturlash va boshqalar" },
                { n:"03", t:"O'qishni boshlang", d:"To'lov qilib, barcha video darslarga kirish oling" },
              ].map((s)=>(
                <div key={s.n} className="flex gap-3 mb-4 last:mb-0">
                  <span className="text-xs text-gray-600 font-bold w-5 flex-shrink-0 pt-0.5">{s.n}</span>
                  <div>
                    <p className="text-sm text-white font-semibold">{s.t}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
              <div className="mt-5 pt-4 border-t border-gray-800 text-xs text-gray-600 tracking-widest">
                {stats.courses} KURS · 7 YO'NALISH · 1 MARTALIK TO'LOV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-14 px-8" style={{backgroundColor:"#FFFFFF", borderTop:"1.5px solid #E2E8F0"}}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{backgroundColor:"#0F172A"}}>
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="font-bold" style={{color:"#0F172A"}}>Talim<span style={{color:"#94A3B8"}}>.Uz</span></span>
            </div>
            <p className="text-sm leading-relaxed" style={{color:"#475569"}}>
              O'zbekistonning onlayn ta'lim akademiyasi. {stats.courses}+ kurs · 7 yo'nalish · 1 maqsad.
            </p>
          </div>
          {[
            { title:"PLATFORMA", links:[["Yo'nalishlar","/courses"],["Yo'l xaritasi","#roadmap"],["Sharhlar","#reviews"]] },
            { title:"YORDAM", links:[["Tez-tez so'raladi","#faq"],["Kirish","/login"],["Ro'yxatdan o'tish","/register"]] },
            { title:"ALOQA", links:[["Telegram","#"],["Instagram","#"],["Email","#"]] },
          ].map((col)=>(
            <div key={col.title}>
              <p className="text-xs font-bold tracking-widest mb-4" style={{color:"#94A3B8"}}>{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(([label,href])=>(
                  <li key={label}>
                    <Link href={href} className="text-sm hover:text-gray-900 transition-colors" style={{color:"#475569"}}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2" style={{borderTop:"1px solid #E2E8F0"}}>
          <p className="text-xs" style={{color:"#94A3B8"}}>© 2026 Talim.Uz Akademiyasi. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs" style={{color:"#94A3B8"}}>Toshkent · O'zbekiston</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
