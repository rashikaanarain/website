import { useEffect, useMemo, useState } from "react";
import logoDark from "../../assets/opennyai-logo-dark.svg";

async function api(path, options) {
  const response = await fetch(path, options);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (!isJson) throw new Error("The admin service is unavailable.");
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Something went wrong.");
  return result;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      onLogin();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <a href="/" className="admin-brand" aria-label="Return to OpenNyAI home">
        <img src={logoDark} alt="OpenNyAI" />
      </a>
      <section className="login-panel" aria-labelledby="login-title">
        <h1 id="login-title">Admin sign in</h1>
        <p>Review the people who have joined the OpenNyAI mailing list.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required autoFocus />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="form-message error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function downloadCsv(signups) {
  const rows = [["Email", "Joined at"], ...signups.map((signup) => [signup.email, signup.createdAt])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `opennyai-signups-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Dashboard({ onLogout }) {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/signups")
      .then((result) => setSignups(result.signups))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return signups.filter((signup) => new Date(signup.createdAt).toDateString() === today).length;
  }, [signups]);

  async function handleLogout() {
    try {
      await api("/api/admin/logout", { method: "POST" });
      onLogout();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <a href="/" className="admin-brand" aria-label="Return to OpenNyAI home"><img src={logoDark} alt="OpenNyAI" /></a>
        <button className="text-button" type="button" onClick={handleLogout}>Sign out</button>
      </header>
      <main className="admin-main">
        <div className="admin-heading">
          <div>
            <h1>Email signups</h1>
            <p>{signups.length} total · {todayCount} today</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => downloadCsv(signups)} disabled={!signups.length}>Export CSV</button>
        </div>
        {loading && <div className="table-skeleton" aria-label="Loading signups"><span /><span /><span /></div>}
        {error && <p className="admin-error" role="alert">{error}</p>}
        {!loading && !error && signups.length === 0 && (
          <div className="admin-empty">
            <h2>No signups yet</h2>
            <p>New mailing-list submissions will appear here.</p>
          </div>
        )}
        {!loading && !error && signups.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Email</th><th>Joined</th></tr></thead>
              <tbody>
                {signups.map((signup) => (
                  <tr key={signup.id}>
                    <td><a href={`mailto:${signup.email}`}>{signup.email}</a></td>
                    <td><time dateTime={signup.createdAt}>{formatDate(signup.createdAt)}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export function AdminApp() {
  const [session, setSession] = useState("loading");

  useEffect(() => {
    document.title = "Email signups | OpenNyAI Admin";
    api("/api/admin/session")
      .then(() => setSession("authenticated"))
      .catch(() => setSession("anonymous"));
  }, []);

  if (session === "loading") return <div className="admin-loading" aria-label="Loading" />;
  if (session === "anonymous") return <Login onLogin={() => setSession("authenticated")} />;
  return <Dashboard onLogout={() => setSession("anonymous")} />;
}
