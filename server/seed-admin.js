import { createDatabase } from "./database.js";

function argument(name) {
  const flag = `--${name}`;
  const index = Bun.argv.indexOf(flag);
  return index === -1 ? undefined : Bun.argv[index + 1];
}

const username = argument("username") || process.env.ADMIN_USERNAME || "admin";
const password = argument("password") || process.env.ADMIN_PASSWORD || "admin";

if (!username.trim() || !password) {
  console.error("Username and password cannot be empty.");
  process.exit(1);
}

const database = createDatabase();

try {
  const passwordHash = await Bun.password.hash(password, { algorithm: "argon2id" });
  const admin = database.upsertAdmin(username.trim(), passwordHash);
  console.log(`Seeded admin user "${admin.username}".`);
  if (username === "admin" && password === "admin") {
    console.warn("Default credentials are for local setup only. Seed a unique password before deployment.");
  }
} finally {
  database.close();
}
