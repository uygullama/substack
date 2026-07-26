export type Locale = "tr" | "en" | "de";

export interface LocaleMeta {
  enabled: boolean;
  label: string;
  htmlLang: string;
  intlLocale: string;
  openGraphLocale: string;
  direction: "ltr" | "rtl";
}

export interface Socials {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  substack?: string;
}

export interface Contact {
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
}

export interface SubstackSource {
  pages?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface LocaleSourceConfig {
  substack?: SubstackSource;
}

export interface NavigationItem {
  label: string;
  href?: string;
}

export interface Navigation {
  items: Record<string, NavigationItem>;
}

export interface SiteContent {
  siteName?: string;
  description?: string;
  navigation?: Navigation;
}

export interface SiteConfig {
  $schema?: string;
  schemaVersion: number;
  i18n: {
    defaultLocale: Locale;
    locales: Record<Locale, LocaleMeta>;
  };
  shared: {
    url: string;
    substack: string;
    socials?: Socials;
    contact?: Contact;
  };
  sources: Record<Locale, LocaleSourceConfig>;
  content: Record<Locale, SiteContent>;
}

export interface ResolvedSiteContent {
  siteName: string;
  description: string;
  navigation: Navigation;
}

export interface ResolvedSiteConfig {
  locale: Locale;
  meta: LocaleMeta;
  url: string;
  substack: string;
  socials: Socials;
  contact: Contact;
  content: ResolvedSiteContent;
  source: LocaleSourceConfig;
}
