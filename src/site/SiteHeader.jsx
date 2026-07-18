import { useEffect, useRef, useState } from "react";
import agamiLogo from "../../assets/agami-logo.svg";
import logoDark from "../../assets/opennyai-logo-dark.svg";
import logo from "../../assets/opennyai-logo.svg";
import { useCollapsedHeader } from "../hooks/useCollapsedHeader.js";
import { GlowPrimaryButton } from "./BorderGlow.jsx";
import {
  alternateLocalePath,
  isPublicRoute,
  pathForPage,
  PUBLIC_PAGE_IDS,
} from "./siteRoutes.js";

const NAV_COPY = {
  en: {
    about: "About Us",
    misaal: "MISAAL",
    problems: "Explore Problems",
    menu: "Menu",
    close: "Close",
    primaryLabel: "Primary",
    homeLabel: "OpenNyAI home",
    closeMenu: "Close menu",
    network: {
      label: "Also visit",
      toggle: "Show network sites",
      close: "Close network sites",
      pucarDesc: "Public Collective for Avoidance and Resolution of Disputes",
      agamiDesc: "Ideas that serve justice",
    },
  },
  hi: {
    about: "हमारे बारे में",
    misaal: "MISAAL",
    problems: "समस्याएँ देखें",
    menu: "मेन्यू",
    close: "बंद करें",
    primaryLabel: "मुख्य नेविगेशन",
    homeLabel: "OpenNyAI मुखपृष्ठ",
    closeMenu: "मेन्यू बंद करें",
    network: {
      label: "ये भी देखें",
      toggle: "सहयोगी साइटें देखें",
      close: "सहयोगी साइटें बंद करें",
      pucarDesc: "विवादों के परिहार एवं समाधान हेतु सार्वजनिक समूह",
      agamiDesc: "न्याय की सेवा में विचार",
    },
  },
};

function isPlainLeftClick(event) {
  return !event.defaultPrevented
    && event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function SiteLink({ href, navigate, preload, onNavigate, children, ...props }) {
  function handleClick(event) {
    if (!isPlainLeftClick(event)) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || !isPublicRoute(url.pathname)) return;
    event.preventDefault();
    onNavigate?.();
    navigate(url.href);
  }

  function handleIntent() {
    preload?.(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      onFocus={handleIntent}
      onPointerEnter={handleIntent}
      {...props}
    >
      {children}
    </a>
  );
}

export function SiteHeader({ locale, currentPage, navigate, preload, isNavigating }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const collapsed = useCollapsedHeader();
  const clusterRef = useRef(null);
  const copy = NAV_COPY[locale];
  const hindi = locale === "hi";
  const homePath = pathForPage(PUBLIC_PAGE_IDS.HOME, locale);
  const aboutPath = pathForPage(PUBLIC_PAGE_IDS.ABOUT, locale);
  const misaalPath = pathForPage(PUBLIC_PAGE_IDS.MISAAL, locale);
  const languagePath = alternateLocalePath(window.location.pathname);
  const closeMenu = () => setMenuOpen(false);
  const closeNetwork = () => setNetworkOpen(false);

  const wasCollapsedRef = useRef(false);
  useEffect(() => {
    if (collapsed && !wasCollapsedRef.current) {
      setMenuOpen(false);
      setNetworkOpen(false);
    }
    wasCollapsedRef.current = collapsed;
  }, [collapsed]);

  useEffect(() => {
    closeMenu();
    closeNetwork();
  }, [currentPage, locale]);

  useEffect(() => {
    if (!networkOpen) return undefined;
    const onPointerDown = (event) => {
      if (!clusterRef.current?.contains(event.target)) closeNetwork();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeNetwork();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [networkOpen]);

  return (
    <header
      className={`site-header${collapsed ? " is-collapsed" : ""}${menuOpen ? " is-menu-open" : ""}${networkOpen ? " is-network-open" : ""}`}
      data-collapsed={collapsed ? "true" : "false"}
      data-page={currentPage}
    >
      {menuOpen && (
        <button className="nav-scrim" type="button" aria-label={copy.closeMenu} onClick={closeMenu} />
      )}
      <div className="site-header-cluster" ref={clusterRef}>
        <div className="brand-cluster">
          <SiteLink className="brand-home" href={homePath} navigate={navigate} preload={preload} aria-label={copy.homeLabel}>
            <img src={collapsed ? logoDark : logo} alt="OpenNyAI" />
          </SiteLink>
          <button
            className="network-toggle"
            type="button"
            aria-expanded={networkOpen}
            aria-controls="network-panel"
            aria-label={copy.network.toggle}
            onClick={() => {
              closeMenu();
              setNetworkOpen((open) => !open);
            }}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="header-actions">
          <SiteLink
            className={`language-switch${isNavigating ? " is-swapping" : ""}`}
            href={languagePath}
            lang={hindi ? "en" : "hi"}
            hrefLang={hindi ? "en" : "hi"}
            aria-busy={isNavigating || undefined}
            navigate={navigate}
            preload={preload}
            onNavigate={closeMenu}
          >
            <span className="language-switch-label">{hindi ? "English" : "हिंदी"}</span>
          </SiteLink>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => {
              closeNetwork();
              setMenuOpen((open) => !open);
            }}
          >
            {menuOpen ? copy.close : copy.menu}
          </button>
        </div>

        <nav id="primary-navigation" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label={copy.primaryLabel}>
          <SiteLink
            href={aboutPath}
            navigate={navigate}
            preload={preload}
            onNavigate={closeMenu}
            aria-current={currentPage === PUBLIC_PAGE_IDS.ABOUT ? "page" : undefined}
          >
            {copy.about}
          </SiteLink>
          <SiteLink
            href={misaalPath}
            navigate={navigate}
            preload={preload}
            onNavigate={closeMenu}
            aria-current={currentPage === PUBLIC_PAGE_IDS.MISAAL ? "page" : undefined}
          >
            {copy.misaal}
          </SiteLink>
          <GlowPrimaryButton className="nav-action-glow">
            <SiteLink className="btn btn-primary nav-action" href={`${homePath}#problems`} navigate={navigate} preload={preload} onNavigate={closeMenu}>
              {copy.problems}
            </SiteLink>
          </GlowPrimaryButton>
        </nav>

        <div className={`network-panel${networkOpen ? " is-open" : ""}`} id="network-panel" inert={!networkOpen}>
          <div className="network-panel-inner">
            <div className="network-panel-card">
              <div className="network-panel-head">
                <p>{copy.network.label}</p>
                <button className="network-close" type="button" aria-label={copy.network.close} onClick={closeNetwork}>
                  <svg viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <a className="network-link" href="https://pucar.org/" target="_blank" rel="noreferrer">
                <strong>PUCAR</strong>
                <span>{copy.network.pucarDesc}</span>
              </a>
              <a className="network-link network-link-agami" href="https://www.agami.in" target="_blank" rel="noreferrer">
                <img src={agamiLogo} alt="Agami" />
                <span>{copy.network.agamiDesc}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
