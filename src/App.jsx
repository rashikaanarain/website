import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AdminApp } from "./admin/AdminApp.jsx";
import { HomePage } from "./site/HomePage.jsx";
import { SiteHeader } from "./site/SiteHeader.jsx";
import { preloadStaticRoute, StaticRoutePage } from "./site/StaticRoutePage.jsx";
import { isPublicRoute, PUBLIC_PAGE_IDS, routeFromUrl } from "./site/siteRoutes.js";

const HOME_METADATA = {
  en: {
    title: "OpenNyAI | Making Justice with AI and Community",
    description: "An Agami mission bringing changemaker communities and AI together to solve long-stuck justice problems in India.",
    canonical: "https://opennyai.org/",
  },
  hi: {
    title: "OpenNyAI | समुदाय और AI के साथ न्याय-निर्माण",
    description: "Agami की एक पहल, जो भारत में वर्षों से अटकी न्याय समस्याओं को हल करने के लिए बदलावकर्मी समुदायों और AI को साथ लाती है।",
    canonical: "https://opennyai.org/hi/",
  },
};

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToRouteHash(route) {
  if (!route.hash) return;
  if (route.page === PUBLIC_PAGE_IDS.HOME) {
    document.querySelector(route.hash)?.scrollIntoView({ block: "start" });
    return;
  }

  document.querySelector(".static-route-host")?.shadowRoot?.querySelector(route.hash)?.scrollIntoView({ block: "start" });
}

function PublicSiteApp() {
  const [route, setRoute] = useState(() => routeFromUrl(window.location.href));
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationIdRef = useRef(0);

  const commitRoute = useCallback((nextRoute, updateHistory) => {
    const href = `${nextRoute.pathname}${nextRoute.search}${nextRoute.hash}`;
    const update = () => {
      if (updateHistory) window.history.pushState({ openNyaiRoute: true }, "", href);
      flushSync(() => setRoute(nextRoute));
      if (nextRoute.hash) scrollToRouteHash(nextRoute);
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    if (document.startViewTransition && !reducedMotion()) {
      return document.startViewTransition(update).finished.catch(() => undefined);
    }

    update();
    return Promise.resolve();
  }, []);

  const transitionTo = useCallback(async (input, { updateHistory = true } = {}) => {
    const nextUrl = new URL(input, window.location.href);
    if (nextUrl.origin !== window.location.origin || !isPublicRoute(nextUrl.pathname)) {
      window.location.assign(nextUrl.href);
      return;
    }

    const nextRoute = routeFromUrl(nextUrl);
    const currentRoute = routeFromUrl(window.location.href);
    if (currentRoute.pathname === nextRoute.pathname && currentRoute.search === nextRoute.search) {
      if (updateHistory && `${currentRoute.search}${currentRoute.hash}` !== `${nextRoute.search}${nextRoute.hash}`) {
        window.history.pushState({ openNyaiRoute: true }, "", `${nextRoute.pathname}${nextRoute.search}${nextRoute.hash}`);
      }
      flushSync(() => setRoute(nextRoute));
      window.requestAnimationFrame(() => {
        if (nextRoute.hash) scrollToRouteHash(nextRoute);
        else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }

    const navigationId = ++navigationIdRef.current;
    setIsNavigating(true);

    try {
      await preloadStaticRoute(nextRoute.pathname);
      if (navigationId !== navigationIdRef.current) return;
      await commitRoute(nextRoute, updateHistory);
    } catch {
      window.location.assign(nextUrl.href);
    } finally {
      if (navigationId === navigationIdRef.current) setIsNavigating(false);
    }
  }, [commitRoute]);

  const navigate = useCallback((input) => transitionTo(input), [transitionTo]);
  const preload = useCallback((input) => {
    const url = new URL(input, window.location.href);
    if (url.origin === window.location.origin && isPublicRoute(url.pathname)) {
      preloadStaticRoute(routeFromUrl(url).pathname).catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onPopState = () => transitionTo(window.location.href, { updateHistory: false });
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [transitionTo]);

  useEffect(() => {
    const onDocumentClick = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download") || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !isPublicRoute(url.pathname)) return;
      event.preventDefault();
      navigate(url.href);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [navigate]);

  useEffect(() => {
    document.documentElement.lang = route.locale;
    document.documentElement.dataset.locale = route.locale;

    if (route.page === PUBLIC_PAGE_IDS.HOME) {
      const metadata = HOME_METADATA[route.locale];
      document.title = metadata.title;
      document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", metadata.canonical);
    }
  }, [route.locale, route.page]);

  return (
    <div className="site-shell" data-page={route.page} data-navigating={isNavigating || undefined}>
      <a className="global-skip-link" href="#route-main">{route.locale === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to content"}</a>
      <SiteHeader
        locale={route.locale}
        currentPage={route.page}
        navigate={navigate}
        preload={preload}
        isNavigating={isNavigating}
      />
      <div className="route-stage" data-route={route.page}>
        {route.page === PUBLIC_PAGE_IDS.HOME ? (
          <HomePage locale={route.locale} />
        ) : (
          <StaticRoutePage route={route} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return window.location.pathname.startsWith("/admin") ? <AdminApp /> : <PublicSiteApp />;
}
