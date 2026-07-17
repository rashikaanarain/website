import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createApiHandler } from "./api.js";
import { createDatabase } from "./database.js";

let database;
let handleApi;

beforeEach(async () => {
  database = createDatabase(":memory:");
  database.upsertAdmin("admin", await Bun.password.hash("admin"));
  handleApi = createApiHandler(database, { secureCookies: false });
});

afterEach(() => database.close());

function request(path, options = {}) {
  return new Request(`http://localhost${path}`, options);
}

describe("API", () => {
  test("captures and deduplicates public signups", async () => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "Person@Example.org" }),
    };

    const first = await handleApi(request("/api/signups", options));
    const second = await handleApi(request("/api/signups", options));

    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect((await second.json()).alreadySubscribed).toBe(true);
    expect(database.listSignups()[0].email).toBe("person@example.org");
  });

  test("requires a session before listing signups", async () => {
    const response = await handleApi(request("/api/admin/signups"));
    expect(response.status).toBe(401);
  });

  test("logs in, reads signups, and logs out", async () => {
    database.addSignup("person@example.org");
    const login = await handleApi(request("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    }));
    const cookie = login.headers.get("set-cookie").split(";")[0];

    expect(login.status).toBe(200);

    const list = await handleApi(request("/api/admin/signups", { headers: { Cookie: cookie } }));
    expect(list.status).toBe(200);
    expect((await list.json()).signups).toHaveLength(1);

    const logout = await handleApi(request("/api/admin/logout", { method: "POST", headers: { Cookie: cookie } }));
    expect(logout.status).toBe(200);

    const expiredSession = await handleApi(request("/api/admin/session", { headers: { Cookie: cookie } }));
    expect(expiredSession.status).toBe(401);
  });
});
