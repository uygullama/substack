import rawSiteData from "@/data/site.json";
import { siteConfigSchema } from "./site.schema";
import type {
  Locale,
  LocaleMeta,
  LocaleSourceConfig,
  ResolvedSiteConfig,
  ResolvedSiteContent,
  SiteConfig,
} from "./site.types";

// Parse and validate at runtime (or let it fail early in build)
const parsedConfig = siteConfigSchema.safeParse(rawSiteData);

if (!parsedConfig.success) {
  console.error("Invalid site.json structure:", parsedConfig.error);
  // Optional: throw new Error("Invalid site.json");
}

const siteConfig = rawSiteData as SiteConfig;
export const defaultLocale = siteConfig.i18n.defaultLocale;

export function getSupportedLocales(): Locale[] {
  return Object.keys(siteConfig.i18n.locales) as Locale[];
}

export function isLocale(value: string): value is Locale {
  return getSupportedLocales().includes(value as Locale);
}

export function requireLocale(value: string): Locale {
  if (isLocale(value)) return value as Locale;
  return defaultLocale;
}

export function requireSecondaryLocale(value: string): Locale {
  const loc = requireLocale(value);
  if (loc === defaultLocale) {
    throw new Error(`Expected secondary locale, got default: ${value}`);
  }
  return loc;
}

export function getSecondaryLocales(): Locale[] {
  return getSupportedLocales().filter((l) => l !== defaultLocale);
}

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return siteConfig.i18n.locales[locale];
}

export function getLocaleSource(locale: Locale): LocaleSourceConfig {
  return siteConfig.sources[locale] || {};
}

// Deep merge helper that overrides arrays but merges objects
function deepMerge<T extends object, U extends object>(
  target: T,
  source: U,
): T & U {
  const output = { ...target } as Record<string, unknown>;
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceKey = key as keyof U;
      const targetKey = key as keyof T;
      const sourceVal = source[sourceKey];

      if (isObject(sourceVal)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceVal });
        } else {
          output[key] = deepMerge(
            target[targetKey] as object,
            sourceVal as object,
          );
        }
      } else if (Array.isArray(sourceVal)) {
        // override array completely
        output[key] = sourceVal;
      } else {
        Object.assign(output, { [key]: sourceVal });
      }
    });
  }
  return output as T & U;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

export function getResolvedSiteContent(locale: Locale): ResolvedSiteContent {
  const baseContent = siteConfig.content[defaultLocale] || {};
  const overrideContent =
    locale !== defaultLocale ? siteConfig.content[locale] || {} : {};

  // Deep merge override on top of base
  return deepMerge(baseContent, overrideContent) as ResolvedSiteContent;
}

export function getResolvedSiteConfig(locale: Locale): ResolvedSiteConfig {
  const content = getResolvedSiteContent(locale);
  const meta = getLocaleMeta(locale);
  const source = getLocaleSource(locale);

  return {
    locale,
    meta,
    url: siteConfig.shared.url,
    substack: siteConfig.shared.substack,
    socials: siteConfig.shared.socials || {},
    contact: siteConfig.shared.contact || {},
    content,
    source,
  };
}
