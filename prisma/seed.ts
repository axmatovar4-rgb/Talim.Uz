import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Ona tili" },    update: {}, create: { name: "Ona tili" } }),
    prisma.category.upsert({ where: { name: "Matematika" },  update: {}, create: { name: "Matematika" } }),
    prisma.category.upsert({ where: { name: "Ingliz tili" }, update: {}, create: { name: "Ingliz tili" } }),
    prisma.category.upsert({ where: { name: "Rus tili" },    update: {}, create: { name: "Rus tili" } }),
    prisma.category.upsert({ where: { name: "Dasturlash" },  update: {}, create: { name: "Dasturlash" } }),
    prisma.category.upsert({ where: { name: "Marketing" },   update: {}, create: { name: "Marketing" } }),
    prisma.category.upsert({ where: { name: "Dizayn" },      update: {}, create: { name: "Dizayn" } }),
  ]);

  // Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@talim.uz" },
    update: {},
    create: {
      name: "Akbar Ustoz",
      email: "teacher@talim.uz",
      password: await bcrypt.hash("password123", 10),
      role: "teacher",
    },
  });

  // Student
  await prisma.user.upsert({
    where: { email: "student@talim.uz" },
    update: {},
    create: {
      name: "Sarvar Talaba",
      email: "student@talim.uz",
      password: await bcrypt.hash("password123", 10),
      role: "student",
    },
  });

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@talim.uz" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@talim.uz",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  // Courses
  await prisma.course.upsert({
    where: { id: "course-js-001" },
    update: {},
    create: {
      id: "course-js-001",
      title: "JavaScript asoslari",
      description: "JavaScript dasturlash tilini noldan o'rganing. O'zgaruvchilar, funksiyalar, DOM va asinxron dasturlash.",
      price: 0,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[4].id,
      lessons: {
        create: [
          { title: "JavaScript nima?", position: 1, isFree: true, duration: 600 },
          { title: "O'zgaruvchilar va ma'lumot turlari", position: 2, isFree: true, duration: 900 },
          { title: "Funksiyalar", position: 3, isFree: false, duration: 1200 },
          { title: "Massivlar va obyektlar", position: 4, isFree: false, duration: 1500 },
          { title: "DOM bilan ishlash", position: 5, isFree: false, duration: 1800 },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { id: "course-react-002" },
    update: {},
    create: {
      id: "course-react-002",
      title: "React.js praktikasi",
      description: "React.js frameworkini o'rganib, zamonaviy web ilovalar yarating.",
      price: 99000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[4].id,
      lessons: {
        create: [
          { title: "React nima va nima uchun?", position: 1, isFree: true, duration: 720 },
          { title: "JSX sintaksisi", position: 2, isFree: true, duration: 840 },
          { title: "Komponentlar va props", position: 3, isFree: false, duration: 1080 },
          { title: "useState va useEffect", position: 4, isFree: false, duration: 1440 },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { id: "course-design-003" },
    update: {},
    create: {
      id: "course-design-003",
      title: "UI/UX Dizayn asoslari",
      description: "Figma yordamida professional interfeys va foydalanuvchi tajribasini loyihalashni o'rganing.",
      price: 149000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[6].id,
      lessons: {
        create: [
          { title: "Dizayn tamoyillari", position: 1, isFree: true, duration: 660 },
          { title: "Figma bilan tanishish", position: 2, isFree: true, duration: 900 },
          { title: "Wireframe yaratish", position: 3, isFree: false, duration: 1200 },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { id: "course-english-004" },
    update: {},
    create: {
      id: "course-english-004",
      title: "Ingliz tili B1 dan B2 gacha",
      description: "O'rta darajadan yuqori darajaga chiqing. Grammatika, so'zlashuv va yozish ko'nikmalari.",
      price: 79000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[2].id,
      lessons: {
        create: [
          { title: "Present tenses takrorlash", position: 1, isFree: true, duration: 780 },
          { title: "Past perfect ishlatish", position: 2, isFree: false, duration: 960 },
          { title: "Conditional sentences", position: 3, isFree: false, duration: 1020 },
        ],
      },
    },
  });

  // 5 — Ona tili
  await prisma.course.upsert({
    where: { id: "course-onatili-005" },
    update: {},
    create: {
      id: "course-onatili-005",
      title: "Ona tili va adabiyot",
      description: "O'zbek tili grammatikasi, imlo qoidalari, badiiy adabiyot tahlili. Maktab va olimpiada uchun.",
      price: 59000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[0].id,
      lessons: {
        create: [
          { title: "Fonetika va grafika", position: 1, isFree: true, duration: 720 },
          { title: "So'z turkumlari", position: 2, isFree: true, duration: 900 },
          { title: "Gap bo'laklari", position: 3, isFree: false, duration: 1080 },
          { title: "Imlo qoidalari", position: 4, isFree: false, duration: 960 },
        ],
      },
    },
  });

  // 6 — Matematika
  await prisma.course.upsert({
    where: { id: "course-math-006" },
    update: {},
    create: {
      id: "course-math-006",
      title: "Matematika: Algebra va Geometriya",
      description: "Algebraik ifodalar, tenglamalar, geometrik shakllar. DTM va olimpiadaga tayyorgarlik.",
      price: 69000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[1].id,
      lessons: {
        create: [
          { title: "Algebraik ifodalar", position: 1, isFree: true, duration: 840 },
          { title: "Chiziqli tenglamalar", position: 2, isFree: true, duration: 960 },
          { title: "Kvadrat tenglamalar", position: 3, isFree: false, duration: 1080 },
          { title: "Uchburchaklar", position: 4, isFree: false, duration: 1200 },
          { title: "Aylana va doira", position: 5, isFree: false, duration: 1080 },
        ],
      },
    },
  });

  // 7 — Rus tili
  await prisma.course.upsert({
    where: { id: "course-russian-007" },
    update: {},
    create: {
      id: "course-russian-007",
      title: "Rus tili: Boshlang'ichdan A2 gacha",
      description: "Rus tilini noldan o'rganing. Alifbo, asosiy so'zlar, kundalik muloqot va grammatika.",
      price: 69000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[3].id,
      lessons: {
        create: [
          { title: "Rus alifbosi va talaffuz", position: 1, isFree: true, duration: 660 },
          { title: "Salomlashish va tanishish", position: 2, isFree: true, duration: 780 },
          { title: "Ismlar va egalik", position: 3, isFree: false, duration: 900 },
          { title: "Fe'llar va zamon", position: 4, isFree: false, duration: 1020 },
        ],
      },
    },
  });

  // 8 — Marketing
  await prisma.course.upsert({
    where: { id: "course-marketing-008" },
    update: {},
    create: {
      id: "course-marketing-008",
      title: "Raqamli Marketing",
      description: "Instagram, Telegram, Google Ads va SEO — biznesingizni onlayn rivojlantiring.",
      price: 129000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[5].id,
      lessons: {
        create: [
          { title: "Marketing asoslari", position: 1, isFree: true, duration: 720 },
          { title: "Instagram marketing", position: 2, isFree: true, duration: 900 },
          { title: "Telegram kanali", position: 3, isFree: false, duration: 840 },
          { title: "Google Ads", position: 4, isFree: false, duration: 1200 },
          { title: "SEO asoslari", position: 5, isFree: false, duration: 1080 },
        ],
      },
    },
  });

  // 9 — Python
  await prisma.course.upsert({
    where: { id: "course-python-009" },
    update: {},
    create: {
      id: "course-python-009",
      title: "Python dasturlash",
      description: "Python tilini o'rganing: o'zgaruvchilar, funksiyalar, fayllar, va loyiha yaratish.",
      price: 109000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[4].id,
      lessons: {
        create: [
          { title: "Python nima?", position: 1, isFree: true, duration: 600 },
          { title: "O'zgaruvchilar va turlar", position: 2, isFree: true, duration: 840 },
          { title: "Shartli operatorlar", position: 3, isFree: false, duration: 960 },
          { title: "Funksiyalar", position: 4, isFree: false, duration: 1080 },
          { title: "Fayllar bilan ishlash", position: 5, isFree: false, duration: 1200 },
        ],
      },
    },
  });

  // 10 — Grafik Dizayn
  await prisma.course.upsert({
    where: { id: "course-graphic-010" },
    update: {},
    create: {
      id: "course-graphic-010",
      title: "Grafik Dizayn: Adobe & Canva",
      description: "Logotip, banner, poster yaratish. Branding va vizual identifikatsiya asoslari.",
      price: 119000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[6].id,
      lessons: {
        create: [
          { title: "Rang nazariyasi", position: 1, isFree: true, duration: 720 },
          { title: "Typography asoslari", position: 2, isFree: true, duration: 840 },
          { title: "Logotip yaratish", position: 3, isFree: false, duration: 1200 },
          { title: "Banner dizayn", position: 4, isFree: false, duration: 960 },
          { title: "Branding", position: 5, isFree: false, duration: 1080 },
        ],
      },
    },
  });

  console.log("✅ Seed muvaffaqiyatli bajarildi!");
  console.log("👤 O'qituvchi: teacher@talim.uz / password123");
  console.log("👤 Talaba: student@talim.uz / password123");
  console.log("👤 Admin: admin@talim.uz / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
