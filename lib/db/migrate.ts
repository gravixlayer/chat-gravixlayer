import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (
    !process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL.includes("[YOUR-PASSWORD]")
  ) {
    console.log(
      "⏭️  Skipping migrations - no database configured (using Supabase client or in-memory storage)"
    );
    process.exit(0);
  }

  try {
    const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(connection);

    console.log("⏳ Running migrations...");

    const start = Date.now();
    await migrate(db, { migrationsFolder: "./lib/db/migrations" });
    const end = Date.now();

    console.log("✅ Migrations completed in", end - start, "ms");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.log(
      "⏭️  Skipping migrations - database connection failed (using Supabase client)"
    );
    console.log(
      "This is normal when using Supabase without direct PostgreSQL access"
    );
    process.exit(0);
  }
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
