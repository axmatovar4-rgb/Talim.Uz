import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "Ona tili" },     update: {}, create: { name: "Ona tili" } }),
    prisma.category.upsert({ where: { name: "Matematika" },   update: {}, create: { name: "Matematika" } }),
    prisma.category.upsert({ where: { name: "Ingliz tili" },  update: {}, create: { name: "Ingliz tili" } }),
    prisma.category.upsert({ where: { name: "Rus tili" },     update: {}, create: { name: "Rus tili" } }),
    prisma.category.upsert({ where: { name: "Dasturlash" },   update: {}, create: { name: "Dasturlash" } }),
    prisma.category.upsert({ where: { name: "Marketing" },    update: {}, create: { name: "Marketing" } }),
    prisma.category.upsert({ where: { name: "Dizayn" },       update: {}, create: { name: "Dizayn" } }),
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
  const course1 = await prisma.course.create({
    data: {
      title: "JavaScript asoslari",
      description: "JavaScript dasturlash tilini noldan o'rganing. O'zgaruvchilar, funksiyalar, DOM va asinxron dasturlash.",
      price: 0,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[0].id,
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

  await prisma.course.create({
    data: {
      title: "React.js praktikasi",
      description: "React.js frameworkini o'rganib, zamonaviy web ilovalar yarating. Komponentlar, hooks, va state management.",
      price: 99000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[0].id,
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

  await prisma.course.create({
    data: {
      title: "UI/UX Dizayn asoslari",
      description: "Figma yordamida professional interfeys va foydalanuvchi tajribasini loyihalashni o'rganing.",
      price: 149000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[1].id,
      lessons: {
        create: [
          { title: "Dizayn tamoyillari", position: 1, isFree: true, duration: 660 },
          { title: "Figma bilan tanishish", position: 2, isFree: true, duration: 900 },
          { title: "Wireframe yaratish", position: 3, isFree: false, duration: 1200 },
        ],
      },
    },
  });

  await prisma.course.create({
    data: {
      title: "Ingliz tili B1 dan B2 gacha",
      description: "O'rta darajadan yuqori darajaga chiqing. Grammatika, so'zlashuv va yozish ko'nikmalari.",
      price: 79000,
      isPublished: true,
      teacherId: teacher.id,
      categoryId: categories[4].id,
      lessons: {
        create: [
          { title: "Present tenses takrorlash", position: 1, isFree: true, duration: 780 },
          { title: "Past perfect ishlatish", position: 2, isFree: false, duration: 960 },
          { title: "Conditional sentences", position: 3, isFree: false, duration: 1020 },
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
