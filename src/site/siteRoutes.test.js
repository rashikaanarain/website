import { describe, expect, test } from "bun:test";
import {
  alternateLocalePath,
  isPublicRoute,
  localeForPath,
  normalizePathname,
  pageForPath,
  pathForPage,
  routeFromUrl,
} from "./siteRoutes.js";

describe("public site routes", () => {
  test("normalizes direct-load paths", () => {
    expect(normalizePathname("/")).toBe("/");
    expect(normalizePathname("/about")).toBe("/about/");
    expect(normalizePathname("hi/misaal/")).toBe("/hi/misaal/");
  });

  test("maps pages and locales without losing the current screen", () => {
    expect(pageForPath("/hi/about/")).toBe("about");
    expect(localeForPath("/hi/misaal/")).toBe("hi");
    expect(pathForPage("misaal", "en")).toBe("/misaal/");
    expect(pathForPage("about", "hi")).toBe("/hi/about/");
    expect(alternateLocalePath("/hi/about/")).toBe("/about/");
    expect(alternateLocalePath("/misaal/")).toBe("/hi/misaal/");
  });

  test("preserves search and hash state for client navigation", () => {
    expect(routeFromUrl("/hi/#problems")).toEqual({
      pathname: "/hi/",
      hash: "#problems",
      search: "",
      page: "home",
      locale: "hi",
    });
  });

  test("limits the client router to public screens", () => {
    expect(isPublicRoute("/about/")).toBe(true);
    expect(isPublicRoute("/admin/")).toBe(false);
  });
});
