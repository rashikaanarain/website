# OpenNyAI Website - Context

This file consolidates the source material for building the new OpenNyAI website. It captures the organization's strategic pivot, the messaging direction for the new site, the content of the existing site, and the parent-org context. Use it as the single reference when designing and writing the new site.

_Sources ingested: strategy/website-content Google Doc; current live site (opennyai.org); the "Techno Human V1" Framer prototype; Agami parent-org site (agami.in). Compiled July 2026._

---

## 1. The big picture: what changed and why

OpenNyAI is pivoting from **building AI for justice** to **making justice with AI**. The new website exists to communicate this shift.

**2022–2025 (OpenNyAI 1.0/2.0) - building the foundations.** When OpenNyAI started, the legal world and the technology world in India couldn't talk to each other. Lawyers didn't know what AI could do; technologists didn't know Indian legal problems were worth solving. OpenNyAI built the bridge and the building blocks:

- Trained 100+ law students to annotate legal data; built the **Rhetorical Roles model** - the first tool that could read an Indian court judgment and identify its parts (facts, arguments, precedents, ruling).
- Built **Legal NER** to spot entities (party names, courts, dates, laws) inside judgments.
- Built a **Judgment Summariser** that compressed 200-page orders into minutes of reading. 7,000+ people used these tools.
- Built **Jugalbandi**, an open-source conversational AI stack for voice-based chatbots in any Indian language, on WhatsApp, for any legal question.
- Worked with **entrepreneurs and paralegal organizations** to build case-management tools and knowledge systems making legal services more efficient, affordable, and scalable.
- Built a **community** - the Maker Residency and learning circles brought lawyers, technologists, judges, and civil-society practitioners together. Proved interdisciplinary Indian legal-AI collaboration was possible.

**Why pivot now.** The field moved faster than expected. The tools OpenNyAI spent years building - summarisation, multilingual chatbots, legal NER - are now available to anyone with a smartphone. Frontier systems (GPT-4, Gemini, Claude, Sarvam) do in seconds what took months to model. The "building blocks" layer is no longer the gap. Competing there means fighting labs with billions in compute and no attachment to justice - not a fight OpenNyAI should pick, and not the fight that needs OpenNyAI. What **cannot** be replicated by a lab in San Francisco is the community: law students, lawyers, legal-aid orgs, practitioners, researchers - the relationships, trust, and willingness to show up for hard problems. That is OpenNyAI's actual asset.

**2026 (OpenNyAI 3.0) - making justice with AI.** OpenNyAI's open community comes together each year around hard, specific legal problems and solves them, combining human expertise with AI coordination. Framed internally as **"solvathons"** or sprint-based interventions - short, time-bound (ideally 4–5 months), measurable.

---

## 2. Problem-selection criteria (the OpenNyAI 3.0 filter)

Every problem OpenNyAI takes on must meet these criteria. This is the core logic that should shape the "how we choose problems" / "participate" messaging on the site.

1. **Community is the advantage.** The problem must be one where OpenNyAI's network (law students, lawyers, technologists, paralegals, researchers, CSOs) creates leverage that technology alone can't replicate. If it can only be solved by a Supreme Court judgment or legislative amendment, it's the wrong problem.
2. **The law is already on the side of the people affected** - and there's a bright spot already working. It's not about changing the law or finding a novel problem; it's about making existing law actually work, and giving "wind beneath the wings" of an existing justicemaker.
3. **The gap is friction, not opposition.** The system isn't working because of complexity, information asymmetry, capacity constraints, or coordination failure - not because powerful interests are actively blocking the outcome.
4. **There is a clear measure of success.** You know what "done" looks like before starting: prisoners released, FIRs filed, compensation/wages paid.
5. **Scale large enough to matter, small enough to pilot.** Thousands of affected people; a pilot of 50–100 can test whether the approach works.
6. **Community & tech alignment.** The solution must genuinely require a marriage of community effort and technology - the AI/tech demonstration is a key value-add, not a force-fit.
7. **Actionable participation.** Clear, real roles for lawyers, law students, and volunteers.
8. **Timebound.** Short-term, ideally within a 4–5 month window.
9. **(Under exploration)** Possibility of a place-based approach.

Strategic framing (from Sachin): discipline in adhering to criteria avoids past patterns of "murky" goal-setting; OpenNyAI is building a "national muscle" to demonstrate that communities can come together to solve specific, manageable problems rather than getting lost in long-term abstract advocacy.

---

## 3. Flagship project: Big Bail Bash (BBB)

The first community project OpenNyAI will catalyse under the new model - the proof case for 3.0.

**The problem.** An estimated ~1,20,000 people are in Indian jails right now who are legally entitled to be free. Under Section 436A CrPC (now Section 479 BNSS), any undertrial who has served half the maximum sentence for their alleged offence must be released on bail. The law is clear, the right exists - yet they remain jailed not because they lost an argument, but because nobody filed the paperwork.

**Why it's the ideal OpenNyAI problem.** Draws on the full community; law is already on the side of eligible undertrials; the gap is implementation (information, capacity, coordination), not legal reform; success is measurable (prisoners released); large enough to matter, focused enough to pilot.

**Brightspots referenced:** Project Second Chance & Sampatti Card.

**Pilot goal:** 50 prisoners released in one state, proving the pipeline works before scaling. If it works (and the team believes it will), it becomes the template - a new problem (or two) each year, a community that knows how to solve it, and AI that makes coordination possible.

**Three stages of BBB:**

1. **Discovery at scale** - public campaign (radio, local stores, community outreach) to find families of eligible prisoners, outside the formal government system.
2. **Representation at scale** - mobilise pro bono lawyers; templatize 436A applications so they don't require heavy individual effort.
3. **Support systems** - case tracking, documentation, getting Vakalatnamas sorted on the ground.

**Operational workstreams (12 tasks across 5 buckets):**

- _Narrative & Mobilisation:_ break down the BBB narrative for lawyers (make the "why" land before the "how"); find/define incentives for lawyers (recognition, pro bono credit, belonging, reduced friction).
- _Lawyer Management:_ mobilise lawyers who know how to file 436A; allocate 4–5 cases per lawyer with tracking; run test cases to validate the teach-and-replicate model; build relationships with friendly DLSA lawyers who can authorise pro bono lawyers to appear.
- _Legal Infrastructure:_ templatize the 436A application; map court-specific practices for the pilot state (e.g., Delhi); solve case-paper access (criminal case papers, GD entries, investigation reports).
- _Access & Authorisation:_ solve the Vakalatnama problem (signed authorisation from an imprisoned accused - likely via families found in the campaign).
- _Operations & Tracking:_ build a lightweight case-management system (allocation, stage, hearing dates, outcomes); create a feedback loop on rejected applications to refine the template.

**Discovery / data notes (open questions):** The formal pipeline runs Prison → Prison Legal Cell → DALSA → State Legal Authority → empanelled lawyers → court. ePrisons has a 436A column with entry date, but is not very reliable (multiple cases, data-quality issues); reimagining/ reworking ePrisons data is a consideration. Framed as a "100-day problem," more acute in smaller states (e.g., Jharkhand prisons). Rough figures discussed: ~5% of prison population; ~30,000 in some framings. Open questions the team is sizing: rate at which undertrial numbers are reducing; how much time to release ~1 lakh with AI; degree of government support required; whether AI can triage by skill set / education / work done.

---

## 4. Other candidate problems

**Wage theft / unpaid wages** (Industrial Disputes Act, Payment of Wages Act). Millions of workers are owed wages they can legally claim. Law is clear; brightspot **Aajevika Bureau** and the Labour Courts exist. Gap is entirely friction - workers don't know where to file, the process is intimidating, employers bet on attrition. Measurable outcome: wages recovered. Community role: obvious.

**Security/protection for domestic-violence victims** (surfaced in the prototype as an example subset).

**Law-school legal-aid cells** as a volunteer engine (reference: Paladin pro bono case study, Seattle University School of Law).

Open internal to-dos: find ~4 strong, fully-scoped problem statements; convert initiatives into Notion roadmaps; resolve the "Missile/Misaal" project stakeholder bottleneck (via Anshul); integrate new inquiries (e.g., leftover district funds for healthcare/education) with Varun; explore survey-onboarding support (Madiha).

---

## 5. Messaging direction for the new site

The Google Doc contains an explicit **old-copy → new-copy** revision table. The through-line: move from cautious, abstract "demonstration" language toward concrete, human, outcome-first language ("real change, for real people"; "We don't prototype justice. We deliver it."). Key rewrites:

| Section | Old | New (target) |
|---|---|---|
| Hero framing | "We turn long-stuck justice challenges into focused demonstrations" | "We solve long-stuck justice problems, for a defined group of real people." |
| Approach intro | "…build a time-bound solution that creates real impact and evidence for the bigger system." | "…build a time-bound solution. As something real, for people who have been waiting long enough." |
| Step 3 | "**Demonstrate what's possible** - Build with affected communities, AI builders and institutions… creating proof, impact and momentum for the larger challenge." | "**Solve it. For real.** Build with affected communities, AI builders and institutions in a limited period - creating proof, impact." |
| Tagline | "Stuck challenge → focused subset → real demonstration → system confidence." | "Stuck challenge → focused subset → real change, for real people." |
| Participate headline | "Bring a long-stuck justice challenge into focus." (generic) | "…If you know a problem that's been stuck - not because the law is against it, but because the system hasn't caught up - OpenNyAI can help you scope a solvable subset, bring in the right people, and build a solution that works for a real group of people." |
| Problem criteria (new, wasn't on site) | - | "The problems we take on share a few things: → The law is already on the side of the people affected. → The gap is friction, missing coordination, or information failure - not powerful interests blocking the outcome. → You can describe what winning looks like before we start: people released, wages recovered, claims processed." |
| Volunteer CTA (new) | - | "Get your hands dirty. You don't need to own a problem to show up for one. Sign up to work on a live OpenNyAI sprint - as a lawyer, technologist, researcher, or simply someone who wants to do the hard work of solving a real justice problem. [CTA: Volunteer your time →]" |
| Impact | "A demonstration with stakes…" | "A solution with real impact… We don't prototype justice. We deliver it, in focused, time-bound sprints, to the people who need it most." |

**Tone shift to preserve:** confident, concrete, human. Avoid hedged words like "demonstration," "prototype," "evidence for the bigger system." Prefer outcomes and named people.

---

## 6. New site structure - the "Techno Human V1" prototype

The Framer prototype at the techno-human URL shows the intended structure and section order for the new site:

- **Hero:** eyebrow "JUSTICE OPPORTUNITIES × AI × COMMUNITY" → headline "We solve long-stuck justice problems with AI and changemaker communities" → CTAs "Join the Mission" / "About OpenNyAI."
- **Who convenes:** three actor types - "Long-stuck justice problem," "Technologists and AI mavens," "Justice Innovators" - with the line "We combine community intelligence, institutional experience and AI capability to create practical paths through problems that have stayed stuck for years."
- **Our Approach:** "There are justice problems out there that can be solved right now," illustrated with examples - *Bail for the Automatically Eligible* (BBB), *Security and protection for domestic violence victims*, *Build AI-enabled public goods* - mapped to the three steps (find the stuck challenge → narrow the subset → build/solve with community + AI + institutions).
- **Participate:** "Bring to OpenNyAI a long-stuck justice problem you understand," with three qualifiers - `01 / STUCK NOW` (a problem worth unblocking), `02 / THE SUBSET` (a community ready to act), `03 / THE SIGNAL` (a public good others can use).
- **Impact:** "Impact that strengthens the justice ecosystem" - three pillars: `01 PUBLIC GOODS` (open tools, explainers, datasets, benchmarks, shared learning), `02 CONNECTED` (critical connections among practitioners, students, innovators, CSOs, institutions, state actors), `03 MISSION RECOGNITION` (partnerships, showcases, grants, press, ecosystem support). Note: several "Add demo output / Add connection detail / Add mission signal" placeholders remain - **content still needed here.**
- **Collaborators** section, then footer.

**Footer / persistent elements (carry over from current site):** "OpenNyAI - Unlocking the power of AI to transform access to justice" · About OpenNyAI · Visit Agami · Contact Us · email-signup ("Enter your e-mail ID" → Join) · Copyright © Vayam Forum for Citizenship (Agami). Nav shows **About**, **Contact Us**, and a **MISAAL** item.

**Note on Google Doc "Tab 1 can stay exactly the same":** the doc's tab-by-tab notes refer to specific pages/sections of the build; treat the old→new table (Section 5) as authoritative for copy changes, and this prototype as authoritative for structure.

---

## 7. Current live site (opennyai.org) - for reference

The existing site is a scroll-driven Framer site. Sparse copy, animation-led. Core elements:

- Nav: About, Contact Us, **MISAAL**.
- Hero: "How can we 10x access to justice? Join us on a mission to unlock the power of AI to transform how 1.4 billion Indians access justice." CTA "Join the Mission."
- Sections: "About OpenNyAI," "Why do we exist? A short story," "Collaborators."
- Footer identical to the prototype's (see above).
- Meta description (SEO): "A collective of innovators building open-source AI Digital Public Goods that transform how citizens in India experience law and justice."

This is the baseline being replaced. The AI-tools / digital-public-goods framing here is exactly what 3.0 is moving beyond (from "building AI DPGs" → "making justice with AI + community"). Public goods remain an *output*, not the identity.

---

## 8. Parent org: Agami (agami.in)

OpenNyAI is one of Agami's collaborative missions. Agami context matters for tone, brand family, and cross-links.

- **What Agami is:** "A movement of ideas and people seeking to transform the experience of Justice in India." Belief: the way to radically improve law and justice in India is for citizens to go beyond *seeking* justice to *making* it - "No longer is Justice sought, it is made." Anyone advancing justice solutions is a **Justicemaker**; #MakeforJustice.
- **Legal entity:** Agami is the tradename of **Vayam Forum for Citizenship**, a Section 8 non-profit established 2018 to advance innovation in law and justice. (Same entity in OpenNyAI's copyright line.)
- **What Agami does:** tells stories of what's possible, discovers innovators, enables networks for collective impact, builds digital public goods.
- **Agami's missions:** **PUCAR** (people-centric dispute resolution), **OpenNyAI** (AI ecosystem for justice innovation), **Praani** (ecological wellbeing/coexistence in justice systems), **Online Dispute Resolution (ODR)**.
- **Agami's programs/community:** Justicemakers Mela (year-end gathering; JMM26 is Nov 28–29 at Freedom Park, Bengaluru, 3k+ changemakers), Agamishaala (learning space for innovators), Agami Prize (national innovation prize; 2026 announced in April).
- **Brand voice:** movement-oriented, warm, community-first, agency-driven ("Now we make justice"). OpenNyAI's new voice should feel like a member of this family - the "make justice" verb is shared DNA.

**Relationship to OpenNyAI:** OpenNyAI is Agami's AI-for-justice mission. The pivot to community-powered "solvathons" pulls OpenNyAI closer to Agami's core Justicemaker ethos - community as the engine, AI as the multiplier.

---

## 9. Working glossary

- **OpenNyAI 3.0** - the 2026 model: annual community sprints solving specific, law-favored justice problems with AI coordination.
- **Solvathon** - internal term for a time-bound, sprint-based problem-solving intervention.
- **436A / Section 479 BNSS** - the legal right of undertrials who've served half the max sentence to be released on bail; the basis of Big Bail Bash.
- **Big Bail Bash (BBB)** - flagship first project: release undertrials legally entitled to freedom.
- **DALSA / DLSA / SLSA** - District/State Legal Services Authorities (part of the legal-aid pipeline).
- **Vakalatnama** - signed authorisation letting a lawyer appear for a client.
- **ePrisons** - government prison data system (has a 436A column; reliability is a known issue).
- **Brightspot** - an existing initiative already working on a problem that OpenNyAI amplifies (e.g., Project Second Chance, Aajevika Bureau).
- **Justicemaker** - Agami's term for anyone making/advancing justice solutions.
- **MISAAL / Misaal ("Missile")** - an OpenNyAI project referenced in nav and internal notes (currently has a stakeholder bottleneck).

---

## 10. Open items / still needed before/while building

- Fill the prototype's Impact placeholders ("Add demo output / connection detail / mission signal") with real examples.
- Finalize 3–4 fully-scoped candidate problem statements beyond BBB (wage theft, DV protection, others).
- Confirm which existing pages carry over unchanged ("Tab 1 stays the same") vs. get rewritten.
- Decide how much of the old AI-tools legacy (Rhetorical Roles, Legal NER, Summariser, Jugalbandi) to feature as "public goods / past work" vs. retire.
- Clarify final IA: does MISAAL/Misaal get its own destination in the new site?
