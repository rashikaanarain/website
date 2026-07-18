const HOME = "home";
const ABOUT = "about";
const MISAAL = "misaal";

export const PUBLIC_PAGE_IDS = { HOME, ABOUT, MISAAL };

export function normalizePathname(pathname = "/") {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
}

export function localeForPath(pathname = "/") {
  return normalizePathname(pathname).startsWith("/hi/") ? "hi" : "en";
}

export function pageForPath(pathname = "/") {
  const normalized = normalizePathname(pathname);
  if (normalized.endsWith("/about/")) return ABOUT;
  if (normalized.endsWith("/misaal/")) return MISAAL;
  return HOME;
}

export function pathForPage(page, locale = "en") {
  const prefix = locale === "hi" ? "/hi" : "";
  if (page === ABOUT) return `${prefix}/about/`;
  if (page === MISAAL) return `${prefix}/misaal/`;
  return locale === "hi" ? "/hi/" : "/";
}

export function alternateLocalePath(pathname = "/") {
  const page = pageForPath(pathname);
  const locale = localeForPath(pathname);
  return pathForPage(page, locale === "hi" ? "en" : "hi");
}

export function routeFromUrl(input, base = "http://localhost") {
  const url = input instanceof URL ? input : new URL(input, base);
  const pathname = normalizePathname(url.pathname);
  return {
    pathname,
    hash: url.hash,
    search: url.search,
    page: pageForPath(pathname),
    locale: localeForPath(pathname),
  };
}

export function isPublicRoute(pathname = "/") {
  const normalized = normalizePathname(pathname);
  return [
    "/",
    "/hi/",
    "/about/",
    "/hi/about/",
    "/misaal/",
    "/hi/misaal/",
  ].includes(normalized);
}
