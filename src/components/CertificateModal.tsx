"use client";

import { CertLevel } from "@/lib/certificates";

interface Props {
  cert: CertLevel;
  userName: string;
  onClose: () => void;
}

export default function CertificateModal({ cert, userName, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden">
        {/* Confetti bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["🎉","⭐","✨","🌟","🎊"].map((e,i)=>(
            <span key={i} className="absolute text-2xl opacity-20" style={{
              top: `${[10,20,70,80,50][i]}%`,
              left: `${[5,85,10,90,50][i]}%`,
              transform: `rotate(${[15,-20,30,-10,0][i]}deg)`
            }}>{e}</span>
          ))}
        </div>

        <div className="text-7xl mb-4">{cert.icon}</div>
        <div className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-3"
          style={{ backgroundColor: cert.bg, color: cert.color }}>
          YANGI SERTIFIKAT
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">{cert.title}</h2>
        <p className="text-gray-500 mb-1">Tabriklaymiz,</p>
        <p className="text-xl font-bold text-gray-900 mb-4">{userName}!</p>
        <p className="text-sm text-gray-400 mb-6">
          Siz {cert.required} ta video darsni muvaffaqiyatli yakunladingiz va{" "}
          <span className="font-semibold" style={{ color: cert.color }}>{cert.subtitle}</span> darajasiga erishdingiz.
        </p>

        {/* Certificate card */}
        <div className="border-2 rounded-2xl p-5 mb-6" style={{ borderColor: cert.color, backgroundColor: cert.bg }}>
          <p className="text-xs text-gray-500 mb-1">TALIM.UZ AKADEMIYASI</p>
          <p className="font-black text-lg text-gray-900">{cert.title}</p>
          <p className="text-sm text-gray-600 mt-1">Berildi: {userName}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString("uz-UZ")}</p>
          <div className="mt-2 text-2xl">{cert.emoji}</div>
        </div>

        <button onClick={onClose}
          className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-700 transition-colors">
          Davom etish →
        </button>
      </div>
    </div>
  );
}
