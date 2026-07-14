import { afterEach, describe, expect, test } from "bun:test";
import { createDatabase } from "./database.js";

let database;

afterEach(() => {
  database?.close();
  database = undefined;
});

describe("database", () => {
  test("stores an email once and reports duplicates", () => {
    database = createDatabase(":memory:");

    const first = database.addSignup("person@example.org");
    const second = database.addSignup("person@example.org");

    expect(first.alreadySubscribed).toBe(false);
    expect(second.alreadySubscribed).toBe(true);
    expect(second.signup.id).toBe(first.signup.id);
    expect(database.listSignups()).toHaveLength(1);
  });

  test("upserts an administrator", async () => {
    database = createDatabase(":memory:");
    const firstHash = await Bun.password.hash("first-password");
    const secondHash = await Bun.password.hash("second-password");

    const first = database.upsertAdmin("admin", firstHash);
    database.createSession(first.id, "session-token-hash", new Date(Date.now() + 60_000).toISOString());
    expect(database.findSession("session-token-hash")).toBeTruthy();
    const second = database.upsertAdmin("admin", secondHash);

    expect(second.id).toBe(first.id);
    expect(await Bun.password.verify("second-password", database.findAdmin("admin").passwordHash)).toBe(true);
    expect(database.findSession("session-token-hash")).toBeNull();
  });
});
