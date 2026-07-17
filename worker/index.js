const SESSION_COOKIE = "opennyai_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const MAX_JSON_BYTES = 16 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROBLEM_SLUGS = new Set(["bail", "wages", "online-safety", "other"]);
const CONTRIBUTION_TYPES = new Set([
  "legal",
  "technology",
  "research",
  "community",
  "institutional",
  "funding",
  "other",
]);

const API_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

class RequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...API_HEADERS, ...extraHeaders },
  });
}

function methodNotAllowed(methods) {
  return json({ error: "Method not allowed." }, 405, { Allow: methods.join(", ") });
}

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new RequestError("Send the request as JSON.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new RequestError("The submission is too large.", 413);
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
    throw new RequestError("The submission is too large.", 413);
  }

  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw new RequestError("Send a valid JSON object.");
  }
}

function requiredText(body, field, label, maximumLength) {
  if (typeof body[field] !== "string") {
    throw new RequestError(label + " is required.");
  }
  const value = body[field].trim();
  if (!value) throw new RequestError(label + " is required.");
  if (value.length > maximumLength) {
    throw new RequestError(label + " is too long.");
  }
  return value;
}

function validatedEmail(body) {
  const email = requiredText(body, "email", "Email", 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new RequestError("Enter a valid email address.");
  return email;
}

function validateProblemInterest(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const organisation = typeof body.organisation === "string"
    ? body.organisation.trim() || null
    : null;
  const problem = typeof body.problem === "string" ? body.problem.trim() : "";
  const contribution = typeof body.contribution === "string" ? body.contribution.trim() : "";
  const problemDetails = typeof body.problemDetails === "string"
    ? body.problemDetails.trim() || null
    : null;

  if (!name || name.length > 120) throw new RequestError("Enter your name.");
  const email = validatedEmail(body);
  if (organisation?.length > 160) {
    throw new RequestError("Keep the organisation name under 160 characters.");
  }
  if (!PROBLEM_SLUGS.has(problem)) throw new RequestError("Choose a valid problem.");
  if (!CONTRIBUTION_TYPES.has(contribution)) {
    throw new RequestError("Choose how you can contribute.");
  }
  if (problemDetails?.length > 1600) {
    throw new RequestError("Keep the problem note under 1,600 characters.");
  }
  if (problem === "other" && !problemDetails) {
    throw new RequestError("Tell us about the problem you want to bring.");
  }

  return {
    name,
    organisation,
    email,
    problem,
    contribution,
    problemDetails,
    locale: body.locale === "hi" ? "hi" : "en",
  };
}

function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

function makeSessionCookie(value, maxAge = SESSION_DURATION_SECONDS) {
  const expired = maxAge === 0 ? "; Expires=Thu, 01 Jan 1970 00:00:00 GMT" : "";
  return SESSION_COOKIE + "=" + encodeURIComponent(value)
    + "; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=" + maxAge + expired;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

async function hashToken(token) {
  const bytes = await digest(token);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function constantTimeEqual(candidate, expected) {
  const [candidateHash, expectedHash] = await Promise.all([
    digest(candidate),
    digest(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < candidateHash.length; index += 1) {
    difference |= candidateHash[index] ^ expectedHash[index];
  }
  return difference === 0;
}

function requireDatabase(env) {
  if (!env.DB || typeof env.DB.prepare !== "function") {
    throw new RequestError("The signup service is not configured.", 503);
  }
  return env.DB;
}

function rewriteDocumentMetadata(response, requestUrl) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const pageUrl = new URL(requestUrl);
  pageUrl.search = "";
  pageUrl.hash = "";
  const origin = pageUrl.origin;

  return new HTMLRewriter()
    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute("content", pageUrl.href);
      },
    })
    .on('meta[property="og:image"], meta[name="twitter:image"]', {
      element(element) {
        element.setAttribute("content", new URL("/og.png", origin).href);
      },
    })
    .on('link[rel="canonical"]', {
      element(element) {
        element.setAttribute("href", pageUrl.href);
      },
    })
    .on('link[rel="alternate"][href]', {
      element(element) {
        const current = element.getAttribute("href");
        if (!current) return;
        const parsed = new URL(current, origin);
        element.setAttribute("href", new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, origin).href);
      },
    })
    .transform(response);
}

async function saveEmailSignup(database, email) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await database.prepare(
    "INSERT INTO email_signups (id, email, created_at) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING",
  ).bind(id, email, createdAt).run();

  const signup = await database.prepare(
    "SELECT id, email, created_at AS createdAt FROM email_signups WHERE email = ?",
  ).bind(email).first();

  if (!signup) throw new Error("Email signup was not persisted.");
  return { signup, alreadySubscribed: signup.id !== id };
}

async function saveProblemInterest(database, interest) {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await database.prepare(
    "INSERT INTO problem_interests (id, name, organisation, email, problem, contribution, problem_details, locale, created_at, updated_at) "
      + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(email, problem) DO NOTHING",
  ).bind(
    id,
    interest.name,
    interest.organisation,
    interest.email,
    interest.problem,
    interest.contribution,
    interest.problemDetails,
    interest.locale,
    timestamp,
    timestamp,
  ).run();

  const existing = await database.prepare(
    "SELECT id FROM problem_interests WHERE email = ? AND problem = ?",
  ).bind(interest.email, interest.problem).first();

  if (!existing) throw new Error("Problem interest was not persisted.");
  const alreadySubscribed = existing.id !== id;

  if (alreadySubscribed) {
    await database.prepare(
      "UPDATE problem_interests SET name = ?, organisation = ?, contribution = ?, problem_details = ?, locale = ?, updated_at = ? "
        + "WHERE id = ?",
    ).bind(
      interest.name,
      interest.organisation,
      interest.contribution,
      interest.problemDetails,
      interest.locale,
      timestamp,
      existing.id,
    ).run();
  }

  const savedInterest = await database.prepare(
    "SELECT id, name, organisation, email, problem, contribution, problem_details AS problemDetails, locale, "
      + "created_at AS createdAt, updated_at AS updatedAt FROM problem_interests WHERE id = ?",
  ).bind(existing.id).first();

  return { interest: savedInterest, alreadySubscribed };
}

async function authenticate(request, database) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token || token.length !== 64) return null;

  const tokenHash = await hashToken(token);
  const now = new Date().toISOString();
  const session = await database.prepare(
    "SELECT username FROM admin_sessions WHERE token_hash = ? AND expires_at > ?",
  ).bind(tokenHash, now).first();

  if (!session) {
    await database.prepare(
      "DELETE FROM admin_sessions WHERE token_hash = ? AND expires_at <= ?",
    ).bind(tokenHash, now).run();
  }

  return session;
}

async function handleEmailSignup(request, env) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  const body = await readJson(request);
  const result = await saveEmailSignup(requireDatabase(env), validatedEmail(body));
  return json(result, result.alreadySubscribed ? 200 : 201);
}

async function handleProblemInterest(request, env) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  const body = await readJson(request);
  const result = await saveProblemInterest(requireDatabase(env), validateProblemInterest(body));
  return json(result, result.alreadySubscribed ? 200 : 201);
}

async function handleAdminLogin(request, env) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  if (typeof env.ADMIN_USERNAME !== "string" || !env.ADMIN_USERNAME
    || typeof env.ADMIN_PASSWORD !== "string" || !env.ADMIN_PASSWORD) {
    return json({ error: "Admin sign-in is not configured." }, 503);
  }

  const body = await readJson(request);
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const [validUsername, validPassword] = await Promise.all([
    constantTimeEqual(username, env.ADMIN_USERNAME),
    constantTimeEqual(password, env.ADMIN_PASSWORD),
  ]);

  if (!validUsername || !validPassword) {
    return json({ error: "The username or password is incorrect." }, 401);
  }

  const database = requireDatabase(env);
  const token = randomToken();
  const tokenHash = await hashToken(token);
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000).toISOString();

  await database.batch([
    database.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(createdAt),
    database.prepare("DELETE FROM admin_sessions WHERE username = ?").bind(env.ADMIN_USERNAME),
    database.prepare(
      "INSERT INTO admin_sessions (token_hash, username, created_at, expires_at) VALUES (?, ?, ?, ?)",
    ).bind(tokenHash, env.ADMIN_USERNAME, createdAt, expiresAt),
  ]);

  return json(
    { user: { username: env.ADMIN_USERNAME } },
    200,
    { "Set-Cookie": makeSessionCookie(token) },
  );
}

async function handleAdminSession(request, env) {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  const session = await authenticate(request, requireDatabase(env));
  return session
    ? json({ user: { username: session.username } })
    : json({ error: "Sign in required." }, 401);
}

async function handleAdminSignups(request, env) {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  const database = requireDatabase(env);
  const session = await authenticate(request, database);
  if (!session) return json({ error: "Sign in required." }, 401);

  const [signupRows, interestRows] = await database.batch([
    database.prepare(
      "SELECT id, email, created_at AS createdAt FROM email_signups ORDER BY created_at DESC, id DESC",
    ),
    database.prepare(
      "SELECT id, name, organisation, email, problem, contribution, problem_details AS problemDetails, locale, "
        + "created_at AS createdAt, updated_at AS updatedAt FROM problem_interests ORDER BY updated_at DESC, id DESC",
    ),
  ]);

  return json({
    signups: signupRows.results || [],
    interests: interestRows.results || [],
  });
}

async function handleAdminLogout(request, env) {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  const token = readCookie(request, SESSION_COOKIE);
  if (token && token.length === 64) {
    await requireDatabase(env).prepare(
      "DELETE FROM admin_sessions WHERE token_hash = ?",
    ).bind(await hashToken(token)).run();
  }
  return json({ ok: true }, 200, { "Set-Cookie": makeSessionCookie("", 0) });
}

async function handleApi(request, env, pathname) {
  if (pathname === "/api/signups") return handleEmailSignup(request, env);
  if (pathname === "/api/problem-interests") return handleProblemInterest(request, env);
  if (pathname === "/api/admin/login") return handleAdminLogin(request, env);
  if (pathname === "/api/admin/session") return handleAdminSession(request, env);
  if (pathname === "/api/admin/signups") return handleAdminSignups(request, env);
  if (pathname === "/api/admin/logout") return handleAdminLogout(request, env);
  return json({ error: "Not found." }, 404);
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    try {
      return await handleApi(request, env, url.pathname);
    } catch (error) {
      if (error instanceof RequestError) return json({ error: error.message }, error.status);
      console.error("Worker API request failed", error);
      return json({ error: "The request could not be completed." }, 500);
    }
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") {
    return new Response("Static assets are unavailable.", { status: 503 });
  }
  let response = await env.ASSETS.fetch(request);
  const lastSegment = url.pathname.split("/").pop() || "";
  if (response.status === 404 && !lastSegment.includes(".")) {
    response = await env.ASSETS.fetch(new Request(new URL("/", request.url), request));
  }
  return rewriteDocumentMetadata(response, request.url);
}

export default {
  fetch: handleRequest,
};
