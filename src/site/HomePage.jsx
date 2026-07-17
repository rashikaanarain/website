import { useEffect, useState } from "react";
import logo from "../../assets/opennyai-logo.svg";
import logoDark from "../../assets/opennyai-logo-dark.svg";
import { useParallax } from "../hooks/useParallax.js";

const communityStrengths = [
  {
    title: "A community that shows up",
    body: "Lawyers, law students, paralegals, technologists, researchers, and civil-society organisations working as one practical network.",
  },
  {
    title: "AI that multiplies effort",
    body: "Useful where it removes friction: finding people, preparing applications, coordinating work, and learning from outcomes.",
  },
  {
    title: "Public goods that travel",
    body: "Open tools, datasets, explainers, and operating knowledge that others can adapt without asking permission.",
  },
];

const approachSteps = [
  ["Find the stuck challenge", "Start where the law already supports people, but process, information, or coordination has failed them."],
  ["Choose a solvable group", "Define a place, issue, or affected community small enough to act with and large enough to learn from."],
  ["Solve it for real", "Work with affected communities, practitioners, institutions, and AI builders toward a measurable outcome."],
];

const participationCriteria = [
  ["The law is already on people's side", "The work is about making an existing right function, not waiting for a new law."],
  ["The gap is practical", "Friction, missing information, or coordination is holding the outcome back—not immovable opposition."],
  ["Winning can be named", "People released, wages recovered, or claims processed. We agree on the outcome before work begins."],
];

const missions = [
  ["Agami", "The movement building the field of justice innovation in India.", "https://www.agami.in"],
  ["PUCAR", "Building a people-centric dispute-resolution system.", "https://pucar.org"],
  ["Praani", "Bringing ecological wellbeing into our justice systems.", "https://www.agami.in/praani"],
  ["ODR", "Scaling dispute resolution outside the courts.", "https://www.agami.in/online-dispute-resolution"],
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand-home" href="#top" aria-label="OpenNyAI home">
        <img src={logoDark} alt="OpenNyAI" />
      </a>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
      <nav id="primary-navigation" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary">
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#approach" onClick={closeMenu}>Approach</a>
        <a href="#missions" onClick={closeMenu}>Community</a>
        <a href="#participate" onClick={closeMenu}>Participate</a>
        <a className="btn btn-primary nav-action" href="#join" onClick={closeMenu}>Join the mission</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-context">Justice, made together</p>
        <h1 id="hero-title">How can we <em>10×</em> access to justice?</h1>
        <p className="hero-lede">OpenNyAI brings community and AI together to solve long-stuck justice problems for real people.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#join">Join the mission</a>
          <a className="text-link" href="#about">See how it works <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-outcomes" data-parallax="0.075" aria-label="Examples of outcomes OpenNyAI works toward">
        <p>Rights already exist.</p>
        <p>People are still waiting.</p>
        <p className="hero-outcome-emphasis">We close the gap.</p>
        <div className="hero-case">
          <strong>First mission</strong>
          <span>Help undertrials who are already legally entitled to release come home.</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="section-intro">
        <h2 id="about-title">The system has not caught up with the law.</h2>
        <p>OpenNyAI built the bridge between India's legal and technology communities. Today, that community is the advantage: people with the trust, context, and determination to make rights work in practice.</p>
      </div>
      <div className="principle-list">
        {communityStrengths.map((item) => (
          <article className="principle" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="section section-dark" id="approach" aria-labelledby="approach-title">
      <div className="section-intro section-intro-wide">
        <h2 id="approach-title">Make one part of a hard problem move.</h2>
        <p>We choose a defined group, a measurable outcome, and a limited period. Then the community does the practical work of getting there.</p>
      </div>
      <ol className="process-list">
        {approachSteps.map(([title, body], index) => (
          <li key={title}>
            <span className="process-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="impact-strip" data-parallax="0.035">
        <p><strong>1,20,000</strong><span>undertrials estimated to be legally entitled to release</span></p>
        <p><strong>7,000+</strong><span>people used OpenNyAI's legal-AI tools</span></p>
        <p><strong>100+</strong><span>law students trained to build justice datasets</span></p>
      </div>
    </section>
  );
}

function Missions() {
  return (
    <section className="section missions-section" id="missions" aria-labelledby="missions-title">
      <div className="section-intro">
        <h2 id="missions-title">Part of a wider movement making justice.</h2>
        <p>OpenNyAI is an Agami mission. We share a belief that people can move from seeking justice to actively making it.</p>
      </div>
      <div className="mission-list">
        {missions.map(([name, description, href]) => (
          <a href={href} target="_blank" rel="noreferrer" key={name}>
            <strong>{name}</strong>
            <span>{description}</span>
            <span className="mission-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Participate() {
  return (
    <section className="section" id="participate" aria-labelledby="participate-title">
      <div className="section-intro section-intro-wide">
        <h2 id="participate-title">Bring us a justice problem you understand.</h2>
        <p>If a problem is stuck because the system has not caught up, we can help define a solvable group, bring in the right people, and build toward a real outcome.</p>
      </div>
      <div className="criteria-list">
        {participationCriteria.map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <a className="text-link participate-link" href="mailto:hello@opennyai.org?subject=A justice problem for OpenNyAI">Tell us about the problem <span aria-hidden="true">→</span></a>
    </section>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      if (!isJson) throw new Error("Signups are temporarily unavailable.");
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "We couldn't save your email.");

      setStatus("success");
      setMessage(result.alreadySubscribed ? "You're already on the list." : "You're on the list. We'll be in touch.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <label htmlFor="signup-email">Email address</label>
      <div className="signup-row">
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.org"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={status === "submitting"}
          aria-describedby={message ? "signup-message" : undefined}
        />
        <button className="btn btn-accent" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Joining…" : "Join the list"}
        </button>
      </div>
      {message && <p id="signup-message" className={`form-message ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
    </form>
  );
}

function Join() {
  return (
    <section className="join-section" id="join" aria-labelledby="join-title">
      <div className="join-copy">
        <h2 id="join-title">You do not need to own the problem to show up for it.</h2>
        <p>Join a sprint as a lawyer, technologist, researcher, or someone prepared to do the practical work.</p>
        <a className="text-link text-link-light" href="mailto:hello@opennyai.org?subject=I want to volunteer">Volunteer your time <span aria-hidden="true">→</span></a>
      </div>
      <SignupForm />
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logo} alt="OpenNyAI" />
        <p>Community and AI, working together to make justice real.</p>
      </div>
      <nav aria-label="Footer">
        <a href="#about">About</a>
        <a href="#approach">Approach</a>
        <a href="#participate">Participate</a>
        <a href="https://www.agami.in" target="_blank" rel="noreferrer">Agami</a>
        <a href="mailto:hello@opennyai.org">Contact</a>
      </nav>
      <p className="footer-copy">© Vayam Forum for Citizenship (Agami)</p>
    </footer>
  );
}

export function HomePage() {
  useParallax();
  useEffect(() => {
    document.title = "OpenNyAI | Making Justice with AI and Community";
  }, []);

  return (
    <div className="site-shell" id="top">
      <Header />
      <main>
        <Hero />
        <About />
        <Approach />
        <Missions />
        <Participate />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
