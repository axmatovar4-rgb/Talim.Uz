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
  const password = await bcrypt.hash("Robiya", 10);

  // Teacher - Robiya
  const teacher = await prisma.user.upsert({
    where: { email: "Robiya@gmail.com" },
    update: { password, role: "teacher", name: "Robiya" },
    create: {
      name: "Robiya",
      email: "Robiya@gmail.com",
      password,
      role: "teacher",
    },
  });
  console.log(`✅ O'qituvchi: ${teacher.email} / Robiya`);

  // Admin - ham Robiya
  const admin = await prisma.user.upsert({
    where: { email: "admin@talim.uz" },
    update: { password, name: "Robiya", role: "admin" },
    create: {
      name: "Robiya",
      email: "admin@talim.uz",
      password,
      role: "admin",
    },
  });
  console.log(`✅ Admin: ${admin.email} / Robiya`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
