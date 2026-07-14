import "./styles.css";
import logo from "../assets/opennyai-logo.svg";
import logoDark from "../assets/opennyai-logo-dark.svg";

export default function App() {
  return (
    <>
      <div id="top" />

      <header className="site-header">
        <div className="brand">
          <a className="brand-home" href="#top" aria-label="OpenNyAI home">
            <img src={logoDark} alt="OpenNyAI" />
          </a>
          <a className="brand-switch-btn" href="#missions" aria-label="Explore the Agami ecosystem" title="Explore the Agami ecosystem">
            <svg viewBox="0 0 10 6" width="11" height="7" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
        <nav className="site-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#approach">Approach</a>
          <a href="#missions">Missions</a>
          <a href="#participate">Participate</a>
          <a className="nav-cta" href="#join">Join the Mission</a>
        </nav>
        <button className="nav-burger" type="button" aria-label="Open menu">Menu
          <svg viewBox="0 0 16 12" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1h14M1 6h14M1 11h14"/></svg>
        </button>
      </header>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Justice · AI · Community</span>
            <h1 className="hero-title">How can we <em>10x</em> access to justice?</h1>
            <p className="hero-lede">OpenNyAI is a collective unlocking the power of AI and community to transform how 1.4&nbsp;billion Indians experience law and justice — solving long-stuck problems for real people.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#join">Join the Mission</a>
              <a className="btn btn-ghost" href="#about">About OpenNyAI <span className="btn-arrow" aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="board" aria-label="What we're working on now">
            <p className="board-label"><span className="board-live"></span>Live right now</p>
            <a className="board-note" href="#participate">
              <b>Big Bail Bash</b>
              <span>Freeing undertrials already entitled to release under Section 479 BNSS.</span>
            </a>
            <a className="board-note" href="#approach">
              <b>Wages recovered</b>
              <span>Helping workers claim unpaid wages the law already owes them.</span>
            </a>
            <a className="board-note" href="#participate">
              <b>Bring a stuck problem</b>
              <span>Know a justice problem that has resisted change? Let's scope it.</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section" id="about">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why we exist</span>
            <h2>The law is often already on people's side. The system just hasn't caught up.</h2>
            <p>For years the legal world and the technology world in India couldn't talk to each other. OpenNyAI built the bridge — training law students, building open legal-AI tools, and gathering a community of lawyers, technologists, paralegals and researchers who show up for hard problems.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <p className="kicker">Community</p>
              <h3>People who show up</h3>
              <p>Lawyers, law students, paralegals, technologists, researchers and civil-society organisations — the network a lab in San Francisco cannot replicate.</p>
            </div>
            <div className="card">
              <p className="kicker">AI</p>
              <h3>Coordination at scale</h3>
              <p>We use AI where it multiplies human effort — templating applications, tracking cases, and finding the people who've been waiting.</p>
            </div>
            <div className="card">
              <p className="kicker">Public goods</p>
              <h3>Open by default</h3>
              <p>Tools, datasets, explainers and shared learning others can adapt, improve and build on — free and open source.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section on-dark" id="approach">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Our approach</span>
            <h2>We solve long-stuck justice problems — for a defined group of real people.</h2>
            <p>We start with problems that have stayed unresolved for too long. Then we narrow the scope, work with community and AI, and build a time-bound solution. As something real, for people who have been waiting long enough.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="num">01</div>
              <h3>Find the stuck challenge</h3>
              <p>Start with justice problems that have stayed unresolved across people, processes or institutions for too long.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <h3>Narrow the real-world scope</h3>
              <p>Define a subset we can act on now: a region, an affected group, an issue type or a limited operating context.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <h3>Solve it. For real.</h3>
              <p>Build with affected communities, AI builders and institutions in a limited period — creating proof, impact and momentum.</p>
            </div>
          </div>
          <div className="stat-row stat-row-spaced">
            <div className="stat"><b>1,20,000</b><span>Undertrials legally entitled to release, still in jail.</span></div>
            <div className="stat"><b>7,000+</b><span>People who used OpenNyAI's open legal-AI tools.</span></div>
            <div className="stat"><b>100+</b><span>Law students trained to build justice datasets.</span></div>
          </div>
        </div>
      </section>
      <section className="section on-dark missions-section" id="missions">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Part of Agami</span>
            <h2>An ecosystem making justice, not just seeking it.</h2>
            <p>OpenNyAI is one of Agami's collaborative missions — a movement of ideas and people reshaping the experience of justice in India.</p>
          </div>
          <div className="mission-grid">
            <a className="mission" href="https://www.agami.in" target="_blank" rel="noopener"><b>Agami</b><span>The movement building the field of justice innovation in India.</span></a>
            <a className="mission" href="https://pucar.org" target="_blank" rel="noopener"><b>PUCAR</b><span>Building a people-centric dispute-resolution system.</span></a>
            <a className="mission" href="https://www.agami.in/praani" target="_blank" rel="noopener"><b>Praani</b><span>Bringing ecological wellbeing into our justice systems.</span></a>
            <a className="mission" href="https://www.agami.in/online-dispute-resolution" target="_blank" rel="noopener"><b>ODR</b><span>Scaling dispute resolution outside the courts.</span></a>
          </div>
        </div>
      </section>
      <section className="section" id="participate">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Participate</span>
            <h2>Bring us a long-stuck justice problem you understand.</h2>
            <p>If you know a problem that's been stuck — not because the law is against it, but because the system hasn't caught up — OpenNyAI can help you scope a solvable subset, bring in the right people, and build a solution that works for a real group of people.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <p className="kicker">01 / Stuck now</p>
              <h3>A problem worth unblocking</h3>
              <p>The law is already on the side of the people affected. We're not here to change it — we're here to make it work.</p>
            </div>
            <div className="card">
              <p className="kicker">02 / The subset</p>
              <h3>A community ready to act</h3>
              <p>The gap is friction, missing coordination or information failure — not powerful interests blocking the outcome.</p>
            </div>
            <div className="card">
              <p className="kicker">03 / The signal</p>
              <h3>A public good others can use</h3>
              <p>You can describe what winning looks like before we start: people released, wages recovered, claims processed.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-band on-dark" id="join">
        <div className="wrap">
          <h2>Get your hands dirty. You don't need to own a problem to show up for one.</h2>
          <p>Join a live OpenNyAI sprint — as a lawyer, technologist, researcher, or simply someone who wants to do the hard work of solving a real justice problem.</p>
          <div className="cta-actions">
            <a className="btn btn-primary" href="mailto:hello@opennyai.org">Volunteer your time</a>
            <a className="btn btn-ghost" href="#participate">Bring a problem</a>
          </div>
          <form className="signup" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Enter your e-mail ID" aria-label="Email address" />
            <button className="btn btn-primary" type="submit">Join</button>
          </form>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-top">
          <img src={logo} alt="OpenNyAI" />
          <p>Unlocking the power of AI and community to transform how India accesses justice.</p>
        </div>
        <div className="footer-map">
          <div className="footer-col">
            <p className="footer-col-title">OpenNyAI</p>
            <a href="#about">About</a>
            <a href="#approach">Our approach</a>
            <a href="#participate">Participate</a>
            <a href="#join">Join the mission</a>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Ecosystem</p>
            <a href="https://www.agami.in" target="_blank" rel="noopener">Visit Agami</a>
            <a href="https://pucar.org" target="_blank" rel="noopener">PUCAR</a>
            <a href="mailto:hello@opennyai.org">Contact us</a>
          </div>
        </div>
        <div className="footer-copy">
          Copyright © Vayam Forum for Citizenship (Agami). All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
