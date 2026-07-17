import { describe, expect, test } from "bun:test";
import { localeFromPath, pathForLocale } from "./useLocaleSwap.js";

describe("locale path helpers", () => {
  test("maps homepage paths to English and Hindi", () => {
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath("/about/")).toBe("en");
    expect(localeFromPath("/hi")).toBe("hi");
    expect(localeFromPath("/hi/")).toBe("hi");
    expect(localeFromPath("/hi/misaal/")).toBe("hi");
  });

  test("returns the public homepage path for each locale", () => {
    expect(pathForLocale("en")).toBe("/");
    expect(pathForLocale("hi")).toBe("/hi/");
  });
});
