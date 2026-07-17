import { useEffect, useRef, useState } from "react";
import agamiLogo from "../../assets/agami-logo.svg";
import rnpLogo from "../../assets/collaborators/rohini-nilekani-philanthropies.png";
import tresVistaLogo from "../../assets/collaborators/tresvista.png";
import trilegalLogo from "../../assets/collaborators/trilegal.png";
import logoDark from "../../assets/opennyai-logo-dark.svg";
import logo from "../../assets/opennyai-logo.svg";
import { useApproachStory } from "../hooks/useApproachStory.js";
import { useCollapsedHeader } from "../hooks/useCollapsedHeader.js";
import { pathForLocale, useLocaleSwap } from "../hooks/useLocaleSwap.js";
import { useParallax } from "../hooks/useParallax.js";
import { useSectionEntrance } from "../hooks/useSectionEntrance.js";
import { GlowAccentButton, GlowPrimaryButton } from "./BorderGlow.jsx";
import Grainient from "./Grainient.jsx";
import { HeroMedia } from "./HeroMedia.jsx";

const PROBLEMS = [
  {
    id: "bail",
    en: {
      status: "Live project · Big Bail Bash",
      title: "The law says they can go home. The system has not let them.",
      body: "We are starting with 50 eligible undertrials in one state—finding families, preparing applications, and coordinating lawyers.",
      action: "Help turn eligibility into freedom",
      short: "Turn eligibility into freedom",
      selector: "Undertrials eligible for release",
    },
    hi: {
      status: "सक्रिय पहल · बिग बेल बैश",
      title: "कानून कहता है कि वे घर जा सकते हैं। व्यवस्था ने अभी तक जाने नहीं दिया।",
      body: "हम एक राज्य में 50 पात्र विचाराधीन कैदियों से शुरुआत कर रहे हैं—परिवारों तक पहुँचना, आवेदन तैयार करना और वकीलों के काम का समन्वय करना।",
      action: "कानूनी पात्रता को आज़ादी में बदलने में मदद करें",
      short: "पात्रता को आज़ादी में बदलें",
      selector: "रिहाई के पात्र विचाराधीन कैदी",
    },
  },
  {
    id: "wages",
    en: {
      status: "In discovery · Wage recovery",
      title: "The work is done. The wages are still unpaid.",
      body: "Workers have valid claims. The barrier is a maze of information, filings, and follow-through before earned money reaches them.",
      action: "Help make wage recovery work",
      short: "Recover unpaid wages",
      selector: "Workers waiting for earned wages",
    },
    hi: {
      status: "खोज के चरण में · मज़दूरी वापसी",
      title: "काम पूरा हो चुका है। मज़दूरी अब भी बकाया है।",
      body: "मज़दूरों के दावे वैध हैं। उनकी कमाई उन तक पहुँचने से पहले जानकारी, आवेदन और निरंतर कार्रवाई की जटिल प्रक्रिया रास्ता रोकती है।",
      action: "मज़दूरी की वापसी को कारगर बनाने में मदद करें",
      short: "बकाया मज़दूरी वापस दिलाएँ",
      selector: "अपनी कमाई का इंतज़ार कर रहे मज़दूर",
    },
  },
  {
    id: "online-safety",
    en: {
      status: "Problem in focus · Online safety",
      title: "When a girl faces online harm, help should be easier to find than the abuse.",
      body: "We are shaping trusted guidance, safeguards, and reporting pathways that work at the moment they are needed.",
      action: "Help shape this problem",
      short: "Make online help safer",
      selector: "Safer online pathways for girls",
    },
    hi: {
      status: "केंद्रित समस्या · ऑनलाइन सुरक्षा",
      title: "ऑनलाइन नुकसान झेल रही किसी लड़की के लिए मदद, उत्पीड़न से अधिक कठिन नहीं होनी चाहिए।",
      body: "हम भरोसेमंद मार्गदर्शन, सुरक्षा उपाय और शिकायत के ऐसे रास्ते गढ़ रहे हैं जो ज़रूरत के समय सचमुच काम करें।",
      action: "इस समस्या को आकार देने में मदद करें",
      short: "ऑनलाइन मदद को सुरक्षित बनाएँ",
      selector: "लड़कियों के लिए सुरक्षित ऑनलाइन रास्ते",
    },
  },
  {
    id: "other",
    en: {
      short: "Bring another stuck problem",
      selector: "A different justice problem",
    },
    hi: {
      short: "कोई दूसरी अटकी समस्या लाएँ",
      selector: "न्याय की कोई अन्य समस्या",
    },
  },
];

const COLLABORATORS = [
  { name: "Agami", src: agamiLogo, width: 692, height: 162, variant: "agami" },
  { name: "Rohini Nilekani Philanthropies", src: rnpLogo, width: 849, height: 389, variant: "rnp" },
  { name: "Trilegal", src: trilegalLogo, width: 500, height: 99, variant: "trilegal" },
  { name: "TresVista", src: tresVistaLogo, width: 400, height: 134, variant: "tresvista" },
];

const FOUNDING_PARTNERS = ["EkStep", "NLSIU", "Thoughtworks"];

const COPY = {
  en: {
    nav: { about: "Why now", approach: "Approach", impact: "Track record", problems: "Explore the problems", menu: "Menu", close: "Close" },
    hero: {
      context: "Justice, made together",
      titleBefore: "How can we",
      titleAccent: "10×",
      titleAfter: "access to justice?",
      lede: "OpenNyAI is a collective unlocking the power of AI and community to transform how 1.4 billion Indians experience law and justice.",
      primary: "Explore the problems",
      secondary: "See how we solve them",
      problemsTitle: "Problems in motion",
    },
    agami: {
      title: "An Agami mission, backed by a field built over years.",
      statA: "4,000+ changemakers",
      statB: "2,000+ organisations",
      body: "OpenNyAI brings Agami's network, trust, and field-building experience into every problem it takes on.",
      community: "Meet the Agami community",
      video: "Watch Agami's approach",
    },
    approach: {
      title: ["We solve ", { highlight: "long-stuck justice problems" }, " with changemaker communities + AI."],
      body: "Communities bring context, trust, and action. AI brings speed, reach, and coordination. Together, they turn rights on paper into outcomes in people's lives.",
      whole: "The whole stuck problem",
      scale: ["Systemic scale", "Years unresolved"],
      subset: "Defined subset",
      ready: "Ready to solve",
      outcomeLabel: "One clear outcome",
      outcomeTitle: "Rights realised",
      steps: [
        {
          title: "Find the stuck challenge",
          body: ["Look for a problem where ", { highlight: "the law already supports people" }, ", but process, information, or coordination keeps the outcome out of reach."],
        },
        {
          title: "Narrow the real-world scope",
          body: ["Define a starting point ", { highlight: "we can act on now" }, ": one place, affected group, issue, or operating context."],
        },
        {
          title: "Solve it. For real.",
          body: ["Mobilise communities, institutions, practitioners, and AI in a time-bound sprint—and ", { highlight: "measure the outcome that matters" }, "."],
        },
      ],
    },
    why: {
      title: "The opportunities to transform justice are everywhere. So are the people ready to act.",
      body: "Across India, justicemakers are already proving what is possible. Communities hold knowledge, trust, and practical experience. AI can multiply their reach and coordination. OpenNyAI brings these abundant assets together around problems ready to move.",
      strengths: [
        ["People who show up", "Lawyers, law students, paralegals, technologists, researchers, and civil-society organisations working as one practical network."],
        ["AI that multiplies effort", "Useful where it removes friction: finding people, preparing applications, coordinating work, and learning from outcomes."],
        ["Public goods that travel", "Open tools, datasets, explainers, and operating knowledge that others can adapt without asking permission."],
      ],
    },
    impact: {
      title: "What this community has already made possible",
      body: "OpenNyAI helped pioneer open legal AI in India. These public goods and field stories show what becomes possible when legal knowledge, community insight, and technology are built together.",
      nerLabel: "Legal NER",
      nerTitle: "Indian judgments became machine-readable.",
      nerBody: "A first-of-its-kind open corpus and model taught machines to recognise the people, courts, laws, dates, and legal provisions inside Indian judgments.",
      nerStats: [["46,545", "annotated legal entities"], ["14", "Indian-legal entity types"], ["91.1", "reported F1 score"]],
      model: "Open the model",
      paper: "Read the research",
      jugalLabel: "Jugalbandi · Biwan, 2023",
      jugalTitle: "A scholarship answer, in the language Vandna speaks.",
      jugalBody: "An 18-year-old student asked Jugalbandi about scholarships in Hindi. It helped her find a scheme, understand eligibility and documents, and submit an application.",
      jugalStats: [["10", "Indian languages in the early pilot"], ["171", "government programmes covered"]],
      story: "Read Vandna's story",
      useCases: "Explore Jugalbandi use cases",
      now: "Now building",
      misaalTitle: "MISAAL: a community standard for high-quality socio-legal AI answers.",
      misaalAction: "See the standard",
    },
    participate: {
      title: "Start with the problem that won't let you look away.",
      body: "Choose one. Tell us what you can bring. We will connect you to the people already working on it.",
      choose: "Choose a problem",
      formTitle: "How can you help move it?",
      name: "Your name",
      namePlaceholder: "Name",
      email: "Email address",
      emailPlaceholder: "you@example.org",
      organisation: "Organisation (optional)",
      organisationPlaceholder: "Organisation or community",
      contribution: "What can you bring?",
      contributionPlaceholder: "Choose one",
      contributions: [
        ["legal", "Legal work"], ["technology", "Technology and AI"], ["research", "Research and evidence"],
        ["community", "Community knowledge"], ["institutional", "Institutional support"], ["funding", "Funding or resources"], ["other", "Something else"],
      ],
      details: "Tell us about the problem",
      detailsPlaceholder: "Who is affected, why is it stuck, and what would a clear win look like?",
      submit: "Help solve this problem",
      submitOther: "Share this problem",
      submitting: "Sending…",
      success: "Thank you. We will connect your interest to the right problem team.",
      existing: "We updated your problem interest with these latest details.",
      error: "We could not save this right now. Please try again or email hello@opennyai.org.",
      privacy: "We will use these details only to follow up about OpenNyAI's work.",
    },
    collaborators: {
      title: "Anchored by Agami, built by many",
      body: "OpenNyAI is a collaborative mission shaped by organisations across law, technology, public infrastructure, and philanthropy.",
      aria: "OpenNyAI collaborators",
      founders: "Founding partners",
    },
    footer: {
      line: "Community and AI, working together to make justice real.",
      about: "Why now", approach: "Approach", impact: "Track record", problems: "Problems", misaal: "MISAAL", agami: "Agami", contact: "Contact",
    },
    meta: {
      title: "OpenNyAI | Making Justice with AI and Community",
      description: "An Agami mission bringing changemaker communities and AI together to solve long-stuck justice problems in India.",
    },
  },
  hi: {
    nav: { about: "अभी क्यों", approach: "हमारा तरीका", impact: "हमारा काम", problems: "समस्याएँ देखें", menu: "मेन्यू", close: "बंद करें" },
    hero: {
      context: "न्याय, मिलकर बनाया गया",
      titleBefore: "न्याय तक पहुँच को",
      titleAccent: "10 गुना",
      titleAfter: "कैसे बढ़ाएँ?",
      lede: "OpenNyAI एक सामूहिक पहल है, जो AI और समुदाय की शक्ति से 1.4 अरब भारतीयों के कानून और न्याय के अनुभव को बदल रही है।",
      primary: "समस्याएँ देखें",
      secondary: "जानें कि हम इन्हें कैसे हल करते हैं",
      problemsTitle: "आगे बढ़ती समस्याएँ",
    },
    agami: {
      title: "Agami की एक पहल, वर्षों में तैयार हुए क्षेत्र की ताक़त के साथ।",
      statA: "4,000+ बदलावकर्मी",
      statB: "2,000+ संस्थाएँ",
      body: "OpenNyAI हर समस्या में Agami के नेटवर्क, भरोसे और क्षेत्र-निर्माण के अनुभव को साथ लाता है।",
      community: "Agami समुदाय से मिलें",
      video: "Agami का तरीका देखें",
    },
    approach: {
      title: ["हम बदलाव लाने वाले समुदायों + AI की शक्ति से ", { highlight: "वर्षों से अटकी न्याय समस्याएँ" }, " हल करते हैं।"],
      body: "समुदाय संदर्भ, भरोसा और कार्रवाई लाते हैं। AI गति, पहुँच और समन्वय बढ़ाता है। साथ मिलकर वे काग़ज़ी अधिकारों को लोगों के जीवन के वास्तविक परिणामों में बदलते हैं।",
      whole: "पूरी अटकी हुई समस्या",
      scale: ["व्यवस्था-स्तर का विस्तार", "वर्षों से अनसुलझी"],
      subset: "परिभाषित दायरा",
      ready: "हल करने को तैयार",
      outcomeLabel: "एक स्पष्ट परिणाम",
      outcomeTitle: "अधिकार साकार",
      steps: [
        {
          title: "अटकी चुनौती पहचानें",
          body: ["ऐसी समस्या खोजें जहाँ ", { highlight: "कानून लोगों के साथ हो" }, ", लेकिन प्रक्रिया, जानकारी या समन्वय के कारण परिणाम पहुँच से बाहर हो।"],
        },
        {
          title: "वास्तविक दायरा छोटा करें",
          body: ["ऐसी शुरुआत तय करें ", { highlight: "जिस पर अभी काम हो सके" }, ": एक जगह, प्रभावित समूह, मुद्दा या कामकाजी परिस्थिति।"],
        },
        {
          title: "इसे सचमुच हल करें",
          body: ["समुदायों, संस्थाओं, पेशेवरों और AI को समयबद्ध अभियान में साथ लाएँ—और ", { highlight: "उस परिणाम को मापें जो वास्तव में मायने रखता है" }, "।"],
        },
      ],
    },
    why: {
      title: "न्याय को बदलने के अवसर हर ओर हैं। और काम के लिए तैयार लोग भी।",
      body: "भारत भर में न्याय-निर्माता दिखा रहे हैं कि क्या संभव है। समुदायों के पास ज्ञान, भरोसा और व्यावहारिक अनुभव है। AI उनकी पहुँच और समन्वय कई गुना बढ़ा सकता है। OpenNyAI इन प्रचुर शक्तियों को उन समस्याओं के आसपास जोड़ता है जो आगे बढ़ने को तैयार हैं।",
      strengths: [
        ["काम के लिए सामने आने वाले लोग", "वकील, कानून के विद्यार्थी, पैरालीगल, तकनीक विशेषज्ञ, शोधकर्ता और नागरिक-सामाजिक संस्थाएँ—एक व्यावहारिक नेटवर्क के रूप में।"],
        ["मानवीय प्रयास को बढ़ाने वाला AI", "जहाँ यह अड़चन कम करे: लोगों को खोजना, आवेदन तैयार करना, काम का समन्वय करना और परिणामों से सीखना।"],
        ["दूर तक जाने वाली सार्वजनिक संपदा", "खुले औज़ार, डेटा, सरल व्याख्याएँ और कामकाजी ज्ञान, जिन्हें दूसरे बिना अनुमति माँगे अपना और बेहतर बना सकें।"],
      ],
    },
    impact: {
      title: "इस समुदाय ने पहले ही क्या संभव बनाया है",
      body: "OpenNyAI ने भारत में खुले कानूनी AI की शुरुआती दिशा बनाने में मदद की। ये सार्वजनिक संपदाएँ और ज़मीनी कहानियाँ दिखाती हैं कि कानूनी ज्ञान, सामुदायिक समझ और तकनीक साथ बनें तो क्या संभव है।",
      nerLabel: "कानूनी NER",
      nerTitle: "भारतीय फ़ैसले मशीनों के लिए पढ़ने योग्य बने।",
      nerBody: "एक अनूठे खुले कॉर्पस और मॉडल ने मशीनों को भारतीय फ़ैसलों में लोगों, अदालतों, कानूनों, तारीख़ों और कानूनी प्रावधानों को पहचानना सिखाया।",
      nerStats: [["46,545", "चिह्नित कानूनी इकाइयाँ"], ["14", "भारतीय कानून से जुड़ी इकाई श्रेणियाँ"], ["91.1", "रिपोर्ट किया गया F1 स्कोर"]],
      model: "मॉडल खोलें",
      paper: "शोध पढ़ें",
      jugalLabel: "Jugalbandi · बिवान, 2023",
      jugalTitle: "वंदना को छात्रवृत्ति का जवाब, उसकी अपनी भाषा में मिला।",
      jugalBody: "18 वर्षीय छात्रा ने Jugalbandi से हिंदी में छात्रवृत्ति के बारे में पूछा। उसे योजना, पात्रता और ज़रूरी दस्तावेज़ समझने और आवेदन करने में मदद मिली।",
      jugalStats: [["10", "शुरुआती पायलट में भारतीय भाषाएँ"], ["171", "सरकारी योजनाओं की जानकारी"]],
      story: "वंदना की कहानी पढ़ें",
      useCases: "Jugalbandi के उपयोग देखें",
      now: "अब बन रहा है",
      misaalTitle: "MISAAL: सामाजिक-कानूनी AI उत्तरों की गुणवत्ता के लिए समुदाय-निर्मित मानक।",
      misaalAction: "मानक देखें",
    },
    participate: {
      title: "उस समस्या से शुरू करें जिसे आप अनदेखा नहीं कर सकते।",
      body: "एक समस्या चुनें। बताएँ कि आप क्या योगदान दे सकते हैं। हम आपको उस पर काम कर रहे लोगों से जोड़ेंगे।",
      choose: "एक समस्या चुनें",
      formTitle: "आप इसे आगे बढ़ाने में कैसे मदद कर सकते हैं?",
      name: "आपका नाम",
      namePlaceholder: "नाम",
      email: "ईमेल पता",
      emailPlaceholder: "you@example.org",
      organisation: "संस्था (वैकल्पिक)",
      organisationPlaceholder: "संस्था या समुदाय",
      contribution: "आप क्या योगदान दे सकते हैं?",
      contributionPlaceholder: "एक विकल्प चुनें",
      contributions: [
        ["legal", "कानूनी काम"], ["technology", "तकनीक और AI"], ["research", "शोध और प्रमाण"],
        ["community", "सामुदायिक ज्ञान"], ["institutional", "संस्थागत सहयोग"], ["funding", "वित्तीय या अन्य संसाधन"], ["other", "कुछ और"],
      ],
      details: "समस्या के बारे में बताएँ",
      detailsPlaceholder: "कौन प्रभावित है, समस्या क्यों अटकी है, और स्पष्ट सफलता कैसी दिखेगी?",
      submit: "इस समस्या को हल करने में मदद करें",
      submitOther: "यह समस्या साझा करें",
      submitting: "भेज रहे हैं…",
      success: "धन्यवाद। हम आपकी रुचि को सही समस्या-समूह से जोड़ेंगे।",
      existing: "हमने इस समस्या में आपकी रुचि को नई जानकारी के साथ अपडेट कर दिया है।",
      error: "अभी इसे सहेजा नहीं जा सका। फिर कोशिश करें या hello@opennyai.org पर ईमेल करें।",
      privacy: "हम इन विवरणों का उपयोग केवल OpenNyAI के काम के बारे में आपसे संपर्क करने के लिए करेंगे।",
    },
    collaborators: {
      title: "Agami की नींव पर, अनेक साथियों ने मिलकर बनाया",
      body: "OpenNyAI एक साझा पहल है, जिसे कानून, तकनीक, सार्वजनिक डिजिटल ढाँचे और परोपकार के क्षेत्र की संस्थाओं ने मिलकर आकार दिया है।",
      aria: "OpenNyAI के सहयोगी",
      founders: "संस्थापक सहयोगी",
    },
    footer: {
      line: "समुदाय और AI—न्याय को वास्तविक बनाने के लिए साथ काम करते हुए।",
      about: "अभी क्यों", approach: "हमारा तरीका", impact: "हमारा काम", problems: "समस्याएँ", misaal: "MISAAL", agami: "Agami", contact: "संपर्क",
    },
    meta: {
      title: "OpenNyAI | समुदाय और AI के साथ न्याय-निर्माण",
      description: "Agami की एक पहल, जो भारत में वर्षों से अटकी न्याय समस्याओं को हल करने के लिए बदलावकर्मी समुदायों और AI को साथ लाती है।",
    },
  },
};

function Header({ locale, copy, onSwitchLocale, isSwapping }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const collapsed = useCollapsedHeader();
  const closeMenu = () => setMenuOpen(false);
  const hindi = locale === "hi";
  const nextLocale = hindi ? "en" : "hi";
  const nextPath = pathForLocale(nextLocale);

  // Close the drawer only while transitioning into the collapsed bar,
  // not whenever collapsed is already true (that blocked re-opening after scroll).
  const wasCollapsedRef = useRef(false);
  useEffect(() => {
    if (collapsed && !wasCollapsedRef.current) {
      setMenuOpen(false);
    }
    wasCollapsedRef.current = collapsed;
  }, [collapsed]);

  function handleLanguageClick(event) {
    // Keep real navigation for modified clicks / open-in-new-tab.
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    event.preventDefault();
    closeMenu();
    onSwitchLocale(nextLocale);
  }

  return (
    <header
      className={`site-header${collapsed ? " is-collapsed" : ""}${menuOpen ? " is-menu-open" : ""}`}
      data-collapsed={collapsed ? "true" : "false"}
    >
      {menuOpen && (
        <button
          className="nav-scrim"
          type="button"
          aria-label={hindi ? "मेन्यू बंद करें" : "Close menu"}
          onClick={closeMenu}
        />
      )}
      <div className="site-header-cluster">
        <a className="brand-home" href="#top" aria-label={hindi ? "OpenNyAI मुखपृष्ठ" : "OpenNyAI home"}>
          <img src={collapsed ? logoDark : logo} alt="OpenNyAI" />
        </a>
        <div className="header-actions">
          <a
            className={`language-switch${isSwapping ? " is-swapping" : ""}`}
            href={nextPath}
            lang={nextLocale}
            hrefLang={nextLocale}
            aria-busy={isSwapping || undefined}
            onClick={handleLanguageClick}
          >
            <span className="language-switch-label">
              {hindi ? "English" : "हिंदी"}
            </span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? copy.nav.close : copy.nav.menu}
          </button>
        </div>
        <nav
          id="primary-navigation"
          className={`site-nav${menuOpen ? " is-open" : ""}`}
          aria-label={hindi ? "मुख्य नेविगेशन" : "Primary"}
        >
          <a href="#about" onClick={closeMenu}>{copy.nav.about}</a>
          <a href="#approach" onClick={closeMenu}>{copy.nav.approach}</a>
          <a href="#impact" onClick={closeMenu}>{copy.nav.impact}</a>
          <GlowPrimaryButton className="nav-action-glow">
            <a className="btn btn-primary nav-action" href="#problems" onClick={closeMenu}>{copy.nav.problems}</a>
          </GlowPrimaryButton>
        </nav>
      </div>
    </header>
  );
}

function Hero({ locale, copy, onChooseProblem }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroMedia />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-context">{copy.hero.context}</p>
          <h1 id="hero-title">{copy.hero.titleBefore} <em>{copy.hero.titleAccent}</em> {copy.hero.titleAfter}</h1>
          <p className="hero-lede">{copy.hero.lede}</p>
          <div className="hero-actions">
            <GlowAccentButton animated>
              <a className="btn btn-accent" href="#problems">{copy.hero.primary}</a>
            </GlowAccentButton>
            <a className="text-link" href="#approach">{copy.hero.secondary} <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-problems" id="problems" aria-labelledby="problems-title">
          <h2 id="problems-title">{copy.hero.problemsTitle}</h2>
          {PROBLEMS.slice(0, 3).map((problem) => {
            const text = problem[locale];
            return (
              <article className="problem-brief" key={problem.id}>
                <p className="problem-status">{text.status}</p>
                <h3>{text.title}</h3>
                <p>{text.body}</p>
                <a href="#participate" onClick={() => onChooseProblem(problem.id)}>{text.action} <span aria-hidden="true">→</span></a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AgamiProof({ copy }) {
  return (
    <section className="agami-proof" id="community" aria-labelledby="agami-proof-title" data-entrance>
      <div className="agami-proof-brand">
        <img src={agamiLogo} alt="Agami" />
        <h2 id="agami-proof-title">{copy.agami.title}</h2>
      </div>
      <div className="agami-proof-stats" aria-label={`${copy.agami.statA}; ${copy.agami.statB}`}>
        <strong>{copy.agami.statA}</strong>
        <span aria-hidden="true">×</span>
        <strong>{copy.agami.statB}</strong>
      </div>
      <div className="agami-proof-copy">
        <p>{copy.agami.body}</p>
        <p className="agami-links">
          <a href="https://www.agami.in" target="_blank" rel="noreferrer">{copy.agami.community} ↗</a>
          <a href="https://youtu.be/urqgxbqYUWU" target="_blank" rel="noreferrer">{copy.agami.video} ↗</a>
        </p>
      </div>
    </section>
  );
}

function HighlightedText({ segments, className }) {
  return segments.map((segment, index) => (
    typeof segment === "string"
      ? <span key={`text-${index}`}>{segment}</span>
      : <mark className={className} key={`highlight-${index}`}>{segment.highlight}</mark>
  ));
}

function Approach({ copy, locale }) {
  // resyncKey rebinds scrub after language swap; stable step keys keep nodes mounted.
  const { flowRef, stepRefs, activeStage } = useApproachStory(copy.approach.steps.length, locale);
  const stageLabels = [copy.approach.whole, copy.approach.subset, copy.approach.ready];

  return (
    <section className="section section-dark approach-section" id="approach" aria-labelledby="approach-title">
      <div className="section-intro section-intro-wide">
        <h2 id="approach-title">
          <HighlightedText segments={copy.approach.title} className="approach-title-mark" />
        </h2>
        <p>{copy.approach.body}</p>
      </div>
      <div
        className="approach-flow"
        ref={flowRef}
        data-active-stage={activeStage}
        data-story-mode="scrub"
      >
        <div className="flow-backdrop" aria-hidden="true">
          <Grainient
            color1="#E58DBB"
            color2="#1C3540"
            color3="#0A151A"
            timeSpeed={0.18}
            colorBalance={0.08}
            warpStrength={1.1}
            warpFrequency={4.5}
            warpSpeed={1.2}
            warpAmplitude={56.0}
            blendAngle={-18.0}
            blendSoftness={0.06}
            rotationAmount={420.0}
            noiseScale={2.1}
            grainAmount={0.08}
            grainScale={2.2}
            grainAnimated={false}
            contrast={1.45}
            gamma={1.0}
            saturation={1.05}
            centerX={0.0}
            centerY={0.0}
            zoom={0.95}
          />
        </div>
        <div className="flow-visual" aria-hidden="true">
          <div className="problem-map">
            <div className="story-phase" aria-hidden="true">
              <span>{stageLabels[activeStage]}</span>
            </div>
            <div className="story-meter" aria-hidden="true">
              {stageLabels.map((label, index) => (
                <span className={`story-meter-seg story-meter-seg-${index}`} data-label={label} key={label}>
                  <i />
                </span>
              ))}
            </div>
            <div className="problem-map-head">
              <span>{copy.approach.whole}</span>
              <span>{copy.approach.scale[0]}<br />{copy.approach.scale[1]}</span>
            </div>
            <div className="problem-field-shell">
              <div className="problem-field">
                <div className="problem-grid" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, index) => (
                    <span
                      className={`problem-node${[9, 10, 15, 16].includes(index) ? " focus" : ""}`}
                      data-index={index}
                      key={index}
                    />
                  ))}
                </div>
                <div className="scope-frame">
                  <span className="scope-corner tl" /><span className="scope-corner tr" /><span className="scope-corner bl" /><span className="scope-corner br" />
                  <span className="scope-label">
                    <span className="scope-copy">{copy.approach.subset}</span>
                    <span className="solve-copy">{copy.approach.ready}</span>
                  </span>
                </div>
                <div className="story-connector connector-a" aria-hidden="true" />
                <div className="story-connector connector-b" aria-hidden="true" />
              </div>
            </div>
            <div className="flow-transfer" />
            <div className="solved-outcome">
              <span className="outcome-mark">✓</span>
              <span>
                <span className="outcome-label">{copy.approach.outcomeLabel}</span>
                <span className="outcome-title">{copy.approach.outcomeTitle}</span>
              </span>
            </div>
          </div>
        </div>
        <ol className="flow-steps">
          {copy.approach.steps.map(({ title, body }, index) => (
            <li
              className={`flow-step${activeStage === index ? " active" : ""}`}
              data-stage={index}
              aria-current={activeStage === index ? "step" : undefined}
              ref={(node) => {
                if (node) stepRefs.current[index] = node;
                else delete stepRefs.current[index];
              }}
              key={`approach-step-${index}`}
            >
              <div className="flow-step-inner">
                <span className="flow-step-number">{String(index + 1).padStart(2, "0")}</span>
                <h3><span className="flow-step-title-copy">{title}</span></h3>
                <p><HighlightedText segments={body} className="flow-copy-mark" /></p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyNow({ copy }) {
  return (
    <section className="section" id="about" aria-labelledby="about-title" data-entrance>
      <div className="section-intro">
        <h2 id="about-title">{copy.why.title}</h2>
        <p>{copy.why.body}</p>
      </div>
      <div className="principle-list">
        {copy.why.strengths.map(([title, body]) => (
          <article className="principle" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrackRecord({ locale, copy }) {
  return (
    <section className="section track-record-section" id="impact" aria-labelledby="impact-title" data-entrance>
      <div className="section-intro section-intro-wide">
        <h2 id="impact-title">{copy.impact.title}</h2>
        <p>{copy.impact.body}</p>
      </div>
      <div className="track-record-layout">
        <article className="ner-proof">
          <p className="proof-label">{copy.impact.nerLabel}</p>
          <h3>{copy.impact.nerTitle}</h3>
          <p>{copy.impact.nerBody}</p>
          <dl className="proof-stats">
            {copy.impact.nerStats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
          <p className="proof-links">
            <a href="https://huggingface.co/opennyaiorg/en_legal_ner_trf" target="_blank" rel="noreferrer">{copy.impact.model} ↗</a>
            <a href="https://aclanthology.org/2022.nllp-1.15/" target="_blank" rel="noreferrer">{copy.impact.paper} ↗</a>
          </p>
        </article>
        <article className="jugalbandi-proof">
          <p className="proof-label">{copy.impact.jugalLabel}</p>
          <h3>{copy.impact.jugalTitle}</h3>
          <p>{copy.impact.jugalBody}</p>
          <dl className="jugalbandi-stats">
            {copy.impact.jugalStats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
          <p className="proof-links">
            <a href="https://news.microsoft.com/source/asia/features/with-help-from-next-generation-ai-indian-villagers-gain-easier-access-to-government-services/" target="_blank" rel="noreferrer">{copy.impact.story} ↗</a>
            <a href="https://docs.jugalbandi.opennyai.org/use-cases-of-jugalbandi" target="_blank" rel="noreferrer">{copy.impact.useCases} ↗</a>
          </p>
        </article>
      </div>
      <div className="misaal-now">
        <span>{copy.impact.now}</span>
        <strong>{copy.impact.misaalTitle}</strong>
        <a href={locale === "hi" ? "/hi/misaal/" : "/misaal/"}>{copy.impact.misaalAction} →</a>
      </div>
    </section>
  );
}

function SignupForm({ locale, copy, selectedProblem }) {
  const [form, setForm] = useState({ name: "", email: "", organisation: "", contribution: "", problemDetails: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const isOther = selectedProblem === "other";

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/problem-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, problem: selectedProblem, locale }),
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      if (!isJson) throw new Error("unavailable");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "unavailable");

      setStatus("success");
      setMessage(result.alreadySubscribed ? copy.participate.existing : copy.participate.success);
      setForm({ name: "", email: "", organisation: "", contribution: "", problemDetails: "" });
    } catch {
      setStatus("error");
      setMessage(copy.participate.error);
    }
  }

  return (
    <form className="problem-signup" onSubmit={handleSubmit}>
      <h3>{copy.participate.formTitle}</h3>
      <div className="form-grid">
        <label>{copy.participate.name}<input name="name" autoComplete="name" placeholder={copy.participate.namePlaceholder} value={form.name} onChange={updateField} required maxLength={120} disabled={status === "submitting"} /></label>
        <label>{copy.participate.email}<input name="email" type="email" autoComplete="email" placeholder={copy.participate.emailPlaceholder} value={form.email} onChange={updateField} required maxLength={254} disabled={status === "submitting"} /></label>
        <label>{copy.participate.organisation}<input name="organisation" autoComplete="organization" placeholder={copy.participate.organisationPlaceholder} value={form.organisation} onChange={updateField} maxLength={160} disabled={status === "submitting"} /></label>
        <label>{copy.participate.contribution}
          <select name="contribution" value={form.contribution} onChange={updateField} required disabled={status === "submitting"}>
            <option value="">{copy.participate.contributionPlaceholder}</option>
            {copy.participate.contributions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
      </div>
      {isOther && (
        <label className="problem-details">{copy.participate.details}
          <textarea name="problemDetails" placeholder={copy.participate.detailsPlaceholder} value={form.problemDetails} onChange={updateField} required maxLength={1600} disabled={status === "submitting"} />
        </label>
      )}
      <GlowAccentButton className="problem-signup-submit" glowRadius={16} glowIntensity={0.55} fillOpacity={0.22}>
        <button className="btn btn-accent" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? copy.participate.submitting : isOther ? copy.participate.submitOther : copy.participate.submit}
        </button>
      </GlowAccentButton>
      <p className="form-privacy">{copy.participate.privacy}</p>
      {message && <p className={`form-message ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
    </form>
  );
}

function Participate({ locale, copy, selectedProblem, onChooseProblem }) {
  return (
    <section className="participate-section" id="participate" aria-labelledby="participate-title" data-entrance>
      <div className="participate-intro">
        <h2 id="participate-title">{copy.participate.title}</h2>
        <p>{copy.participate.body}</p>
      </div>
      <div className="participate-workspace">
        <fieldset className="problem-selector">
          <legend>{copy.participate.choose}</legend>
          {PROBLEMS.map((problem) => (
            <label className={selectedProblem === problem.id ? "selected" : ""} key={problem.id}>
              <input type="radio" name="problem-choice" value={problem.id} checked={selectedProblem === problem.id} onChange={() => onChooseProblem(problem.id)} />
              <span><strong>{problem[locale].short}</strong><small>{problem[locale].selector}</small></span>
            </label>
          ))}
        </fieldset>
        <SignupForm locale={locale} copy={copy} selectedProblem={selectedProblem} />
      </div>
    </section>
  );
}

function Footer({ locale, copy }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logo} alt="OpenNyAI" />
        <p>{copy.footer.line}</p>
      </div>
      <nav aria-label={locale === "hi" ? "पादलेख नेविगेशन" : "Footer"}>
        <a href="#about">{copy.footer.about}</a>
        <a href="#approach">{copy.footer.approach}</a>
        <a href="#impact">{copy.footer.impact}</a>
        <a href="#problems">{copy.footer.problems}</a>
        <a href={locale === "hi" ? "/hi/misaal/" : "/misaal/"}>{copy.footer.misaal}</a>
        <a href="https://www.agami.in" target="_blank" rel="noopener noreferrer">{copy.footer.agami}</a>
        <a href="mailto:hello@opennyai.org">{copy.footer.contact}</a>
      </nav>
      <p className="footer-copy">© Vayam Forum for Citizenship (Agami)</p>
    </footer>
  );
}

function CollaboratorsBand({ copy }) {
  return (
    <section className="collaborators-band" aria-labelledby="collaborators-title">
      <div className="collaborators-band-inner">
        <header className="collaborators-band-header">
          <h2 id="collaborators-title">{copy.collaborators.title}</h2>
          <p>{copy.collaborators.body}</p>
        </header>
        <ul className="collaborators-logo-rail" aria-label={copy.collaborators.aria}>
          {COLLABORATORS.map((collaborator) => (
            <li className={`collaborator-logo collaborator-logo-${collaborator.variant}`} key={collaborator.name}>
              <img
                src={collaborator.src}
                alt={collaborator.name}
                width={collaborator.width}
                height={collaborator.height}
                decoding="async"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
        <div className="collaborators-founders">
          <p>{copy.collaborators.founders}</p>
          <ul aria-label={copy.collaborators.founders}>
            {FOUNDING_PARTNERS.map((partner) => <li key={partner}>{partner}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ locale: requestedLocale }) {
  const { locale, isSwapping, stageRef, switchLocale } = useLocaleSwap(requestedLocale);
  const copy = COPY[locale];
  const [selectedProblem, setSelectedProblem] = useState("bail");
  useParallax();
  useSectionEntrance();

  useEffect(() => {
    const absoluteUrl = new URL(pathForLocale(locale), window.location.origin).href;
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    document.title = copy.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", copy.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", copy.meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", absoluteUrl);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", copy.meta.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", copy.meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", absoluteUrl);
  }, [copy, locale]);

  return (
    <div className="site-shell" id="top" data-swapping={isSwapping ? "true" : undefined}>
      <Header
        locale={locale}
        copy={copy}
        isSwapping={isSwapping}
        onSwitchLocale={switchLocale}
      />
      <div className="locale-swap-stage" ref={stageRef}>
        <div className="locale-swap-layer" lang={locale}>
          <main>
            <Hero locale={locale} copy={copy} onChooseProblem={setSelectedProblem} />
            <AgamiProof copy={copy} />
            <Approach copy={copy} locale={locale} />
            <WhyNow copy={copy} />
            <TrackRecord locale={locale} copy={copy} />
            <Participate locale={locale} copy={copy} selectedProblem={selectedProblem} onChooseProblem={setSelectedProblem} />
            <CollaboratorsBand copy={copy} />
          </main>
          <Footer locale={locale} copy={copy} />
        </div>
      </div>
    </div>
  );
}
