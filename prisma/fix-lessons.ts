import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const COURSES: Record<string, string[]> = {
  "course-english-004": [
    "Present Simple takrorlash","Present Continuous","Present Perfect",
    "Present Perfect Continuous","Past Simple","Past Continuous",
    "Past Perfect","Future Simple","Future Continuous",
    "Future Perfect","Modal fe'llar","Passive Voice",
    "Conditional 0 va 1","Conditional 2 va 3","Reported Speech",
    "Relative Clauses","Gerund va Infinitive","Articles",
    "Prepositions","Adjectives va Adverbs","Comparison",
    "Vocabulary: Business","Vocabulary: Travel","Vocabulary: Technology",
    "Speaking: Tanishish","Speaking: Ish suhbati","Writing: Email",
    "Writing: Essay","Listening Practice","Final Test",
  ],
  "course-onatili-005": [
    "Fonetika asoslari","Unli va undosh tovushlar","Bo'g'in va urg'u",
    "Imlo qoidalari 1","Imlo qoidalari 2","So'z turkumlari: Ot",
    "So'z turkumlari: Fe'l","So'z turkumlari: Sifat","Son va olmosh",
    "Ravish va bog'lovchi","Gap bo'laklari: Ega","Gap bo'laklari: Kesim",
    "Ikkinchi darajali bo'laklar","Sodda gap","Qo'shma gap",
    "To'liqsiz gaplar","Nutq madaniyati","Ijodiy yozuv",
    "Matn tahlili","Badiiy uslub","Publitsistik uslub",
    "Rasmiy uslub","Ilmiy uslub","So'z yasalishi",
    "Sinonimlar va antonimlar","Iboralar va maqollar","Insho yozish",
    "Diktant tayyorlash","Adabiyot: She'r tahlili","Yakuniy test",
  ],
  "course-math-006": [
    "Natural sonlar","Butun sonlar","Kasr sonlar",
    "O'nli kasrlar","Foizlar","Nisbat va proporsiya",
    "Algebraik ifodalar","Ko'paytirish formulalari","Chiziqli tenglama",
    "Tenglama sistemasi","Kvadrat tenglama","Viyet teoremasi",
    "Tengsizliklar","Modulli tenglama","Daraja va ildiz",
    "Logarifm asoslari","Trigonometriya","sin, cos, tan",
    "Uchburchak","To'rtburchak","Aylana va doira",
    "Ko'pburchaklar","Koordinata tekisligi","Vektor",
    "Stereometriya asoslari","Ehtimollik","Statistika",
    "Kombinatorika","Ketma-ketlik","DTM masalalari",
  ],
  "course-russian-007": [
    "Rus alifbosi","Talaffuz qoidalari","Salomlashish",
    "Tanishish","Raqamlar","Ranglar",
    "Kunlar va oylar","Soat va vaqt","Oila a'zolari",
    "Uy va xona","Oziq-ovqat","Kiyim-kechak",
    "Transport","Shahar va yo'l","Do'konda suhbat",
    "Kasb va ish","Erkin vaqt","Sevimli mashg'ulot",
    "Ob-havo","Tabiat","Ot turkumi",
    "Fe'l turkumi","Sifat turkumi","Kelishiklar",
    "Hozirgi zamon","O'tgan zamon","Kelasi zamon",
    "Savol gaplari","Inkor gaplari","Yakuniy test",
  ],
  "course-marketing-008": [
    "Marketing asoslari","Bozor tahlili","Target auditoriya",
    "Brand yaratish","Logo va uslub","Instagram marketing",
    "Instagram Reels","Instagram Stories","Telegram kanal",
    "Telegram bot","Facebook marketing","YouTube marketing",
    "TikTok marketing","Content marketing","Kontent rejasi",
    "Copywriting asoslari","Sarlavha yozish","Email marketing",
    "SMS marketing","SEO asoslari","Google Analytics",
    "Google Ads","Targetli reklama","Retargeting",
    "Influencer marketing","Affiliate marketing","Tahlil va KPI",
    "A/B testing","CRM tizimi","Real loyiha",
  ],
  "course-python-009": [
    "Python nima?","O'rnatish va sozlash","O'zgaruvchilar",
    "Ma'lumot turlari","String metodlari","Sonlar va hisoblash",
    "Boolean va mantiq","if/elif/else","for sikli",
    "while sikli","Ro'yxat (list)","Kortej (tuple)",
    "Lug'at (dict)","To'plam (set)","Funksiyalar",
    "Parametrlar va return","Lambda funksiya","Rekursiya",
    "Fayllar bilan ishlash","Istisno boshqarish","Modullar",
    "OOP: Sinf va obyekt","OOP: Meros","OOP: Polimorfizm",
    "pip va kutubxonalar","requests kutubxonasi","pandas asoslari",
    "matplotlib","SQLite bilan ishlash","Mini loyiha: bot",
  ],
  "course-graphic-010": [
    "Grafik dizayn nima?","Rang nazariyasi","Rang kombinatsiyasi",
    "Typography 1","Typography 2","Kompozitsiya qoidalari",
    "Canva bilan tanishish","Canva: Poster","Canva: Banner",
    "Canva: Prezentatsiya","Canva: Logo","Adobe Illustrator kirish",
    "Illustrator: Asosiy asboblar","Illustrator: Shapes","Illustrator: Pen tool",
    "Illustrator: Typography","Logotip dizayn 1","Logotip dizayn 2",
    "Adobe Photoshop kirish","Photoshop: Layerlar","Photoshop: Retush",
    "Photoshop: Poster","Mock-up yaratish","Social media dizayn",
    "Business card dizayn","Branding to'plami","Print dizayn",
    "Packaging dizayn","Portfolio tayyorlash","Freelance boshlash",
  ],
};

async function main() {
  for (const [courseId, titles] of Object.entries(COURSES)) {
    const existing = await prisma.lesson.count({ where: { courseId } });
    if (existing >= 10) {
      console.log(`⏭ ${courseId}: allaqachon ${existing} dars bor`);
      continue;
    }
    // O'chirib qayta yozamiz
    await prisma.lesson.deleteMany({ where: { courseId } });
    for (let i = 0; i < titles.length; i++) {
      await prisma.lesson.create({
        data: {
          title: titles[i],
          position: i + 1,
          isFree: i < 2,
          duration: 600 + Math.floor(Math.random() * 600),
          courseId,
        },
      });
    }
    console.log(`✅ ${courseId}: ${titles.length} dars qo'shildi`);
  }
  console.log("\n🎉 Tugadi!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
