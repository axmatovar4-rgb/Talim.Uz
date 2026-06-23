const reviews = [
  {
    text: "Talim.Uz menga zamonaviy dasturlashning haqiqiy ma'nosini tushunishga yordam berdi. Endi har qanday loyihani ishlab chiqola olaman.",
    name: "Dilnoza Yusupova",
    role: "Kontent menejeri",
    color: "#818cf8",
  },
  {
    text: "100 qadamni yakunlaganimdan keyin freelance ishlarimda vaqtim 3 barobarga tejandi. Endi mening yordamchim.",
    name: "Jasur Mirzayev",
    role: "Dasturchi",
    color: "#6366f1",
  },
  {
    text: "Bu kurs menga fikrlash tizimini o'rgatdi. Endi har qanday muammoni tizimli hal qila olaman.",
    name: "Sarvar Toshmatov",
    role: "Startup asoschisi",
    color: "#34d399",
  },
  {
    text: "Sertifikat olganimdan keyin LinkedIn'da ish takliflari ko'paydi. Talim.Uz hayotimni o'zgartirdi.",
    name: "Malika Karimova",
    role: "Mutaxassis",
    color: "#f472b6",
  },
];

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {reviews.map((r) => (
        <div key={r.name} className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="text-4xl text-gray-100 font-serif leading-none mb-3">"</div>
            <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: r.color }}
            >
              {r.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{r.name}</p>
              <p className="text-xs text-gray-400">{r.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
