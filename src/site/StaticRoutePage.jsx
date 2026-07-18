import { useEffect, useLayoutEffect, useRef, useState } from "react";
import aboutCss from "../../about/about.css?inline";
import { isPublicRoute, pageForPath, PUBLIC_PAGE_IDS } from "./siteRoutes.js";

const routeCache = new Map();

function routeStyle(css) {
  return css
    .replaceAll(":root", ":host")
    .replaceAll('html[lang="hi"]', ':host([lang="hi"])')
    .replaceAll("html[lang='hi']", ':host([lang="hi"])')
    .replace(/\bhtml\b/g, ":host")
    .replace(/\bbody\.nav-open\b/g, ".route-document.nav-open")
    .replace(/\bbody\b/g, ".route-document");
}

function extractRouteMarkup(template) {
  const content = template.content.cloneNode(true);
  content.querySelectorAll("header, script, .skip-link").forEach((node) => node.remove());
  const footer = content.querySelector("footer");
  const footerMarkup = footer?.outerHTML ?? "";
  footer?.remove();

  const existingMain = content.querySelector("main");
  if (existingMain) return `${existingMain.outerHTML}${footerMarkup}`;

  const holder = document.createElement("div");
  holder.append(content);
  return `<main id="main">${holder.innerHTML}</main>${footerMarkup}`;
}

async function parseRouteResponse(html, pathname) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const template = parsed.querySelector("#route-content");
  if (!template) throw new Error(`Route template missing for ${pathname}`);

  const inlineStyle = parsed.querySelector("style[data-route-style]")?.textContent;
  const page = pageForPath(pathname);
  const css = page === PUBLIC_PAGE_IDS.ABOUT ? aboutCss : (inlineStyle ?? "");

  return {
    pathname,
    page,
    markup: extractRouteMarkup(template),
    css: routeStyle(css),
    title: parsed.title,
    description: parsed.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical: parsed.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
  };
}

export function getCachedStaticRoute(pathname) {
  const cached = routeCache.get(pathname);
  return cached && !(cached instanceof Promise) ? cached : null;
}

export function preloadStaticRoute(pathname) {
  const page = pageForPath(pathname);
  if (page === PUBLIC_PAGE_IDS.HOME) return Promise.resolve(null);

  const cached = routeCache.get(pathname);
  if (cached) return cached instanceof Promise ? cached : Promise.resolve(cached);

  const request = fetch(pathname)
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load ${pathname}`);
      return response.text();
    })
    .then((html) => parseRouteResponse(html, pathname))
    .then((data) => {
      routeCache.set(pathname, data);
      return data;
    })
    .catch((error) => {
      routeCache.delete(pathname);
      throw error;
    });

  routeCache.set(pathname, request);
  return request;
}

function useStaticRouteData(pathname) {
  const [state, setState] = useState(() => ({ data: getCachedStaticRoute(pathname), error: null }));

  useEffect(() => {
    let active = true;
    const cached = getCachedStaticRoute(pathname);
    if (cached) {
      setState({ data: cached, error: null });
      return () => { active = false; };
    }

    setState({ data: null, error: null });
    preloadStaticRoute(pathname)
      .then((data) => {
        if (active) setState({ data, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, error });
      });

    return () => { active = false; };
  }, [pathname]);

  return state;
}

function setupAboutMotion(root) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = Array.from(root.querySelectorAll(".reveal"));
  let revealObserver;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10%", threshold: 0.12 });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const timeline = root.querySelector("[data-timeline]");
  let frame = 0;
  const updateTimeline = () => {
    frame = 0;
    if (!timeline) return;
    const bounds = timeline.getBoundingClientRect();
    const journey = Math.max(bounds.height - window.innerHeight * 0.35, 1);
    const travelled = window.innerHeight * 0.42 - bounds.top;
    const progress = Math.min(1, Math.max(0, travelled / journey));
    timeline.style.setProperty("--story-progress", progress.toFixed(4));
  };
  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateTimeline);
  };

  updateTimeline();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  return () => {
    revealObserver?.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

export function StaticRoutePage({ route, navigate }) {
  const hostRef = useRef(null);
  const { data, error } = useStaticRouteData(route.pathname);

  useEffect(() => {
    if (!data) return;
    document.title = data.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", data.description);
    if (data.canonical) document.querySelector('link[rel="canonical"]')?.setAttribute("href", data.canonical);
  }, [data]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || !data) return undefined;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; min-height: 100vh; background: #f6f1e6; color: #241e1a; }
        ${data.css}
      </style>
      <div class="route-document js">${data.markup}</div>
    `;

    const onClick = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !isPublicRoute(url.pathname)) return;
      event.preventDefault();
      navigate(url.href);
    };

    shadow.addEventListener("click", onClick);
    const cleanupMotion = data.page === PUBLIC_PAGE_IDS.ABOUT ? setupAboutMotion(shadow) : undefined;

    if (route.hash) {
      window.requestAnimationFrame(() => {
        shadow.querySelector(route.hash)?.scrollIntoView({ block: "start" });
      });
    }

    return () => {
      shadow.removeEventListener("click", onClick);
      cleanupMotion?.();
    };
  }, [data, navigate, route.hash]);

  if (error) {
    return (
      <section className="route-load-state" role="alert">
        <h1>We could not open this page.</h1>
        <p>Please refresh and try again.</p>
      </section>
    );
  }

  return (
    <div
      className="static-route-host"
      id="route-main"
      ref={hostRef}
      lang={route.locale}
      tabIndex="-1"
      aria-busy={!data || undefined}
    />
  );
}
