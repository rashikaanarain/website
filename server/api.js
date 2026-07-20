const SESSION_COOKIE = "opennyai_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROBLEM_SLUGS = new Set(["bail", "wages", "online-safety", "other"]);
const CONTRIBUTION_TYPES = new Set(["legal", "technology", "research", "community", "institutional", "funding", "other"]);

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers });
}

function parseCookies(request) {
  return Object.fromEntries(
    (request.headers.get("cookie") || "")
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part.includes("="))
      .map((part) => {
        const separator = part.indexOf("=");
        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      }),
  );
}

function makeCookie(value, { secure = false, maxAge = SESSION_DURATION_SECONDS } = {}) {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function shouldUseSecureCookie(request, secureCookies) {
  const url = new URL(request.url);
  return secureCookies && (url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https");
}

async function hashToken(token) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function authenticate(request, database) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  return database.findSession(await hashToken(token));
}

export function createApiHandler(database, { secureCookies = process.env.NODE_ENV === "production" } = {}) {
  database.deleteExpiredSessions();

  return async function handleApi(request) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/signups") {
      const body = await readJson(request);
      const email = body?.email?.trim().toLowerCase();

      if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return json({ error: "Enter a valid email address." }, 400);
      }

      const result = database.addSignup(email);
      return json({ signup: result.signup, alreadySubscribed: result.alreadySubscribed }, result.alreadySubscribed ? 200 : 201);
    }

    if (request.method === "POST" && url.pathname === "/api/problem-interests") {
      const body = await readJson(request);
      const name = body?.name?.trim();
      const email = body?.email?.trim().toLowerCase();
      const organisation = body?.organisation?.trim() || null;
      const problem = body?.problem?.trim();
      const contribution = body?.contribution?.trim();
      const problemDetails = body?.problemDetails?.trim() || null;
      const locale = body?.locale === "hi" ? "hi" : "en";

      if (!name || name.length > 120) {
        return json({ error: "Enter your name." }, 400);
      }
      if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return json({ error: "Enter a valid email address." }, 400);
      }
      if (organisation?.length > 160) {
        return json({ error: "Keep the organisation name under 160 characters." }, 400);
      }
      if (!PROBLEM_SLUGS.has(problem)) {
        return json({ error: "Choose a valid problem." }, 400);
      }
      if (!CONTRIBUTION_TYPES.has(contribution)) {
        return json({ error: "Choose how you can contribute." }, 400);
      }
      if (problemDetails?.length > 1600) {
        return json({ error: "Keep the problem note under 1,600 characters." }, 400);
      }
      if (problem === "other" && !problemDetails) {
        return json({ error: "Tell us about the problem you want to bring." }, 400);
      }

      const result = database.addProblemInterest({
        name,
        email,
        organisation,
        problem,
        contribution,
        problemDetails,
        locale,
      });
      return json({ interest: result.interest, alreadySubscribed: result.alreadySubscribed }, result.alreadySubscribed ? 200 : 201);
    }

    if (request.method === "POST" && url.pathname === "/api/admin/login") {
      const body = await readJson(request);
      const username = body?.username?.trim();
      const password = body?.password;
      const admin = username ? database.findAdmin(username) : null;
      const valid = admin && typeof password === "string" && await Bun.password.verify(password, admin.passwordHash);

      if (!valid) return json({ error: "The username or password is incorrect." }, 401);

      const token = createSessionToken();
      const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000).toISOString();
      database.createSession(admin.id, await hashToken(token), expiresAt);
      const useSecureCookie = shouldUseSecureCookie(request, secureCookies);

      return json(
        { user: { id: admin.id, username: admin.username } },
        200,
        { "Set-Cookie": makeCookie(token, { secure: useSecureCookie }) },
      );
    }

    if (request.method === "GET" && url.pathname === "/api/admin/session") {
      const admin = await authenticate(request, database);
      return admin ? json({ user: admin }) : json({ error: "Sign in required." }, 401);
    }

    if (request.method === "GET" && url.pathname === "/api/admin/signups") {
      const admin = await authenticate(request, database);
      if (!admin) return json({ error: "Sign in required." }, 401);
      return json({ signups: database.listSignups(), interests: database.listProblemInterests() });
    }

    if (request.method === "POST" && url.pathname === "/api/admin/logout") {
      const token = parseCookies(request)[SESSION_COOKIE];
      if (token) database.deleteSession(await hashToken(token));
      const useSecureCookie = shouldUseSecureCookie(request, secureCookies);
      return json({ ok: true }, 200, { "Set-Cookie": makeCookie("", { secure: useSecureCookie, maxAge: 0 }) });
    }

    return json({ error: "Not found." }, 404);
  };
}
