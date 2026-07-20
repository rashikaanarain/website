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

  test("captures problem interests independently from mailing-list consent", async () => {
    const base = {
      name: "Asha Rao",
      email: "Asha@Example.org",
      organisation: "Justice Lab",
      contribution: "community",
      locale: "hi",
    };

    const first = await handleApi(request("/api/problem-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...base, problem: "bail" }),
    }));
    const update = await handleApi(request("/api/problem-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...base, problem: "bail", contribution: "legal" }),
    }));
    const secondProblem = await handleApi(request("/api/problem-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...base, problem: "wages" }),
    }));

    expect(first.status).toBe(201);
    expect(update.status).toBe(200);
    expect(secondProblem.status).toBe(201);
    expect(database.listProblemInterests()).toHaveLength(2);
    expect(database.listSignups()).toHaveLength(0);
  });

  test("rejects unknown problems and requires detail for a new problem", async () => {
    const submit = (problem, problemDetails = "") => handleApi(request("/api/problem-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Asha Rao",
        email: "asha@example.org",
        problem,
        contribution: "research",
        problemDetails,
      }),
    }));

    expect((await submit("not-real")).status).toBe(400);
    expect((await submit("other")).status).toBe(400);
    expect((await submit("other", "Court fee waivers are hard to discover.")).status).toBe(201);
  });

  test("requires a session before listing signups", async () => {
    const response = await handleApi(request("/api/admin/signups"));
    expect(response.status).toBe(401);
  });

  test("logs in, reads signups, and logs out", async () => {
    database.addSignup("person@example.org");
    database.addProblemInterest({
      name: "Asha Rao",
      email: "asha@example.org",
      organisation: null,
      problem: "bail",
      contribution: "legal",
      problemDetails: null,
      locale: "en",
    });
    const login = await handleApi(request("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    }));
    const cookie = login.headers.get("set-cookie").split(";")[0];

    expect(login.status).toBe(200);

    const list = await handleApi(request("/api/admin/signups", { headers: { Cookie: cookie } }));
    expect(list.status).toBe(200);
    const listing = await list.json();
    expect(listing.signups).toHaveLength(1);
    expect(listing.interests).toHaveLength(1);

    const logout = await handleApi(request("/api/admin/logout", { method: "POST", headers: { Cookie: cookie } }));
    expect(logout.status).toBe(200);

    const expiredSession = await handleApi(request("/api/admin/session", { headers: { Cookie: cookie } }));
    expect(expiredSession.status).toBe(401);
  });
});
