import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const users = await prisma.user.findMany({
    where: { role: { in: ["admin", "teacher"] } },
    select: { email: true, role: true, password: true, name: true }
  });
  
  for (const u of users) {
    const ok = await bcrypt.compare("Robiya", u.password);
    console.log(`${u.role} | ${u.email} | parol "Robiya": ${ok ? "✅ TO'G'RI" : "❌ NOTO'G'RI"}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
