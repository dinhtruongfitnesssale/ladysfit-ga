import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv(filePath: string, opts: { override?: boolean } = {}): void {
  try {
    const lines = readFileSync(filePath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      const isPlaceholder = /\[.+\]/.test(val);
      if (!isPlaceholder && (opts.override || !process.env[key])) {
        process.env[key] = val;
      }
    }
  } catch {}
}

loadEnv(resolve(process.cwd(), ".env"));
loadEnv(resolve(process.cwd(), ".env.local"), { override: true });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Tài khoản admin đầu tiên lấy từ env — không hard-code thông tin đăng nhập
  // trong repo. Khai báo SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD trong .env.local
  // (xem .env.example) rồi chạy `npm run seed`.
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const rawPassword = process.env.SEED_ADMIN_PASSWORD?.trim();
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  if (!email || !rawPassword) {
    console.error(
      "SEED ERROR: thiếu SEED_ADMIN_EMAIL hoặc SEED_ADMIN_PASSWORD.\n" +
        "→ Copy .env.example thành .env.local và điền 2 biến này trước khi seed."
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin already exists: ${email}`);
    return;
  }
  const password = await bcrypt.hash(rawPassword, 12);
  const admin = await prisma.user.create({
    data: { name, email, password, role: "ADMIN" },
  });
  console.log(`✓ Admin created: ${admin.name} <${admin.email}>`);
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
