import { hash } from "bcryptjs";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

config({ path: ".env.local" });
config({ path: ".env" });

import { getDb } from "../src/lib/db";
import { profiles, users } from "../src/lib/db/schema";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!databaseUrl) {
    console.error("DATABASE_URL não definida.");
    process.exit(1);
  }

  if (!email || !password) {
    console.error("ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórios.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  try {
    const migrations = [
      "001_initial_schema.sql",
      "002_clients_module.sql",
      "003_lead_pipeline_status.sql",
    ];

    for (const file of migrations) {
      const migrationPath = resolve(__dirname, `../db/migrations/${file}`);
      const migrationSql = readFileSync(migrationPath, "utf-8");
      await sql.unsafe(migrationSql);
      console.log(`Migration aplicada: ${file}`);
    }
  } catch (err) {
    console.error("Erro ao aplicar schema:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }

  const db = getDb();
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Usuário admin já existe: ${normalizedEmail}`);
    process.exit(0);
  }

  const passwordHash = await hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      email: normalizedEmail,
      passwordHash,
    })
    .returning();

  await db.insert(profiles).values({
    id: user.id,
    email: normalizedEmail,
    fullName: normalizedEmail.split("@")[0],
    role: "admin",
  });

  console.log(`Admin criado: ${normalizedEmail}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
