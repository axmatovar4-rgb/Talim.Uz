"use client";

const items = [
  "Prompt san'ati","Persona dizayni","Tool-calling","RAG",
  "Chain-of-thought","Few-shot","Token tejash","Spec-driven",
  "Multi-agent","React · Next.js","Backend API","Database",
  "Deploy · DevOps","Figma","UI/UX","SEO","SMM","Analytics",
];

export default function TickerBar() {
  const doubled = [...items, ...items];
  return (
    <div className="bg-white border-y border-gray-100 py-3 overflow-hidden">
      <div
        className="flex gap-6 w-max"
        style={{ animation: "ticker 30s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-sm text-gray-500 whitespace-nowrap flex items-center gap-2"
          >
            <span className="text-gray-200">+</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
