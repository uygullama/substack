# Substack Template — Çok Dilli, SEO Uyumlu ve Prod-Grade Geliştirme Planı

## 1. Amaç

Mevcut Next.js/Substack template’i aşağıdaki özelliklere sahip bir yayın altyapısına dönüştürmek:

* Varsayılan dil prefix’siz çalışacak:

  * `/`
  * `/about`
  * `/posts`
  * `/posts/example-post`
* Ek diller locale prefix’i kullanacak:

  * `/en`
  * `/en/about`
  * `/en/posts`
  * `/en/posts/example-post`
* `proxy.ts` veya locale rewrite kullanılmayacak.
* `site.json`, locale-independent ve locale-specific verileri açık biçimde ayıracak.
* Ek dil konfigürasyonu eksik olduğunda, uygun alanlar varsayılan dile fallback yapacak.
* Substack üzerindeki yazı dili tag’lerle belirlenecek data/tags.json 'a aktarilan  etiketler.  site.json icinde dile gore maplenecek. 
* Post listesi `posts/` yalnızca ilgili dilin yazılarını gösterecek.
* Canonical, `hreflang`, sitemap, metadata ve structured data locale-aware olacak.
* Yeni bir dil eklemek route kodu değiştirmeyi gerektirmeyecek.

Mevcut `site.json` yalnızca tek `lang` alanı taşıyor ve `tagMap` ile `pageMap` tek dil varsayımına dayanıyor.

---

# 2. Sabit mimari kararlar

## 2.1 Route stratejisi

Varsayılan dil gerçek, prefix’siz filesystem route’larında bulunacak.

```text
src/app/
├── (default)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── [tags]/
│           └── page.tsx
│
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── posts/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── [tags]/
│           └── page.tsx
│
├── sitemap.ts
├── robots.ts
└── api/
    └── revalidate/
        └── route.ts
```

Public URL sonucu:

```text
/                     → tr
/about                → tr
/posts                → tr
/posts/yazi-slug      → tr

/en                   → en
/en/about             → en
/en/posts             → en
/en/posts/post-slug   → en
```

`/tr/...` route’ları oluşturulmayacak. Gerekirse yalnızca `next.config.ts` üzerinden statik redirect tanımlanacak:

```text
/tr/about → /about
/tr/posts → /posts
```

Proxy, middleware veya internal rewrite bulunmayacak.

---

## 2.2 Route dosyaları yalnızca adapter olacak

Default ve secondary locale route dosyalarında sayfa implementasyonu tekrar edilmeyecek.

```text
src/components/pages/
├── home.tsx
├── about.tsx
├── posts.tsx
├── post.tsx
└── tags.tsx
```

Default route:

```tsx
// src/app/(default)/posts/page.tsx

import { PostsPage } from "@/components/pages/posts";
import { defaultLocale } from "@/i18n/config";

export default function Page() {
  return <PostsPage locale={defaultLocale} />;
}
```

Secondary locale route:

```tsx
// src/app/[locale]/posts/page.tsx

import { PostsPage } from "@/components/pages/posts";
import { requireSecondaryLocale } from "@/i18n/config";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = requireSecondaryLocale(rawLocale);

  return <PostsPage locale={locale} />;
}
```

Ortak sayfa:

```tsx
// src/components/pages/posts.tsx

export async function PostsPage({
  locale,
}: {
  locale: Locale;
}) {
  const config = getResolvedSiteConfig(locale);
  const archive = await substackRepository.getPostsByLocale({
    locale,
    page: 1,
    limit: 20,
  });

  const tags = getResolvedTags(locale);
  const posts = archive.filter(i=>i.postTags.includes(tags));
  const hasMore = archive.length >= 20;

  return (
    <PostsView
      locale={locale}
      config={config}
      archive={posts}
      hasMore={hasMore}
    />
  );
}
```

---

# 3. `site.json` v2 yapısı

`site.json` dört farklı sorumluluğa ayrılmalı:

1. `i18n`: Dil kimliği ve teknik locale bilgileri.
2. `shared`: Dilden bağımsız site verileri.
3. `sources`: Substack üzerindeki locale-specific kaynak eşlemeleri.
4. `content`: Kullanıcıya gösterilen çevrilebilir site içeriği.

Önerilen yapı:

```json
{
  "$schema": "./site.schema.json",
  "schemaVersion": 2,

  "i18n": {
    "defaultLocale": "tr",
    "locales": {
      "tr": {
        "enabled": true,
        "label": "Türkçe",
        "htmlLang": "tr",
        "intlLocale": "tr-TR",
        "openGraphLocale": "tr_TR",
        "direction": "ltr"
      },
      "en": {
        "enabled": true,
        "label": "English",
        "htmlLang": "en",
        "intlLocale": "en-US",
        "openGraphLocale": "en_US",
        "direction": "ltr"
      }
    }
  },

  "shared": {
    "url": "https://example.com",
    "substack": "https://uygulama.substack.com",

    "socials": {
      "twitter": "https://twitter.com/example",
      "linkedin": "https://linkedin.com/company/example",
      "instagram": "https://instagram.com/example",
      "github": "https://github.com/example",
      "substack": "https://uygulama.substack.com"
    },

    "contact": {
      "email": "info@example.com",
      "phone": "+90 000 000 00 00",
      "mapEmbedUrl": "https://www.google.com/maps/embed"
    }
  },

  "sources": {
    "tr": {
      "substack": {
        "pages": {
          "about":  "hakkmzda"
        },
        "tags": {
          "news": "haberler"
        }
      }
    },

    "en": {
      "substack": {
        "pages": {
          "about":  "about-us"
        },
        "tags": {
          "news": "news"
        }
      }
    }
  },

  "content": {
    "tr": {
      "siteName": "uyguLama",
      "description": "Teknoloji, tasarım ve dijital ürün geliştirme.",

      "navigation": {
        "items": {
          "posts": {
            "label": "Yazılar",
            "href": "/posts"
          },
          "about": {
            "label": "Hakkımızda",
            "href": "/about"
          },
          "services": {
            "label": "Hizmetler",
            "href": "/#services"
          },
          "contact": {
            "label": "İletişim",
            "href": "/#contact"
          }
        }
      }
    },

    "en": {
      "description": "Technology, design and digital product development.",

      "navigation": {
        "items": {
          "posts": {
            "label": "Posts"
          },
          "about": {
            "label": "About"
          },
          "services": {
            "label": "Services"
          },
          "contact": {
            "label": "Contact"
          }
        }
      }
    }
  }
}
```

---

# 4. Fallback kuralları

Her alan varsayılan dile fallback yapmamalı. Teknik locale ve içerik kaynağı alanlarında fallback yanlış dilde içerik gösterilmesine neden olabilir.

## 4.1 Fallback yapılabilecek alanlar

Aşağıdaki alanlar `en` içinde bulunmuyorsa `tr` değerleri kullanılabilir:

* `siteName`
* `description`
* Navigation item özellikleri
* Buton ve UI mesajları
* Section başlıkları
* Hizmet açıklamaları
* İletişim metinleri
* Tema ve görsel seçenekleri

Örnek:

```json
"en": {
  "navigation": {
    "items": {
      "posts": {
        "label": "Posts"
      }
    }
  }
}
```

Bu durumda:

* `posts.label`: İngilizce override
* `posts.href`: Default locale konfigürasyonundan fallback
* Diğer navigation item’ları: Default locale’den fallback

## 4.2 Fallback yapılmaması gereken alanlar

Şunlar her etkin dil için zorunlu olmalı:

* `htmlLang`
* `intlLocale`
* `openGraphLocale`
* `languageTagSlug`
* Locale-specific Substack post slug’ları
* Locale-specific Substack topic tag’leri
* URL prefix bilgisi
* Dil yönü

## 4.3 Substack içerik fallback’i

Site konfigürasyonu fallback yapabilir; Substack yazı gövdesi varsayılan olarak fallback yapmamalı.

Örnek:

```text
/en/about
```

için İngilizce `about-us` postu bulunamazsa önerilen davranış:

```text
404 Not Found
```

İngilizce URL altında Türkçe içerik göstermek ve sayfayı `lang="en"` olarak işaretlemek doğru değildir.

---

# 5. Config resolver katmanı

`site.json` bileşenler tarafından doğrudan import edilmemeli.

Şu an birçok component `siteData` nesnesine doğrudan erişiyor. Header da navigation verisini doğrudan bu dosyadan alıyor.

Yeni yapı:

```text
src/lib/config/
├── site.schema.ts
├── site.types.ts
├── site.raw.ts
├── site.resolver.ts
└── site.paths.ts
```

## 5.1 Temel fonksiyonlar

```ts
export function getDefaultLocale(): Locale;

export function getSupportedLocales(): Locale[];

export function isLocale(value: string): value is Locale;

export function requireLocale(value: string): Locale;

export function getLocaleMeta(locale: Locale): LocaleMeta;

export function getLocaleSource(locale: Locale): LocaleSourceConfig;

export function getResolvedSiteContent(
  locale: Locale,
): ResolvedSiteContent;

export function getResolvedSiteConfig(
  locale: Locale,
): ResolvedSiteConfig;
```

## 5.2 Merge davranışı

Custom deep merge kuralları:

| Değer tipi            | Davranış                                  |
| --------------------- | ----------------------------------------- |
| Eksik property        | Default locale değerini kullan            |
| String/number/boolean | Locale override değerini kullan           |
| Object                | Recursive merge                           |
| Array                 | Tamamen değiştir, index bazlı merge yapma |
| `null`                | Alanı açıkça temizle/devre dışı bırak     |
| `undefined` / eksik   | Fallback uygula                           |

Navigation gibi koleksiyonların array yerine ID bazlı object olması bu nedenle önemlidir.

Yanlış model:

```json
"navigation": [
  { "label": "Posts" }
]
```

Doğru model:

```json
"navigation": {
  "items": {
    "posts": {
      "label": "Posts"
    }
  }
}
```

Böylece yalnızca `label` override edilir; `href` varsayılan konfigürasyondan alınabilir.

## 5.3 Runtime validation

`site.json` Zod ile doğrulanmalı.

Kontroller:

* Default locale, `locales` içinde bulunuyor mu?
* Enabled locale için `sources` tanımlı mı?
* Default locale content bloğu eksiksiz mi?

Validation build sırasında çalışmalı:

```text
bun run validate-config
```

Prod build:

```text
validate-config → typecheck → test → next build
```

---

# 6. Locale routing yardımcıları

Tüm linkler merkezi bir URL helper üzerinden oluşturulmalı.

```ts
export function localizedPath(
  locale: Locale,
  pathname: string,
): string {
  const normalized =
    pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === defaultLocale) {
    return normalized;
  }

  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}
```

Sonuç:

```ts
localizedPath("tr", "/");
// "/"

localizedPath("tr", "/about");
// "/about"

localizedPath("en", "/");
// "/en"

localizedPath("en", "/about");
// "/en/about"
```

Component içinde hard-coded locale prefix kullanılmamalı:

```tsx
<Link href={localizedPath(locale, "/posts")}>
  {config.navigation.items.posts.label}
</Link>
```

Anchor link:

```ts
localizedPath("tr", "/#contact");
// "/#contact"

localizedPath("en", "/#contact");
// "/en/#contact"
```

Mevcut Header, homepage dışındayken anchor üretmek için `usePathname()` kullanıyor.

Yeni yapıda Header’a `locale` verilecek ve bütün linkler `localizedPath()` ile oluşturulacak. Bu nedenle pathname’e bağlı URL düzeltme mantığı kaldırılabilecek.

---

# 7. Substack tag sözleşmesi

## 7.1 Topic tag’leri

Topic/category tag’lerinin de locale-specific olması önerilir:

```text
haberler
teknoloji
news
technology
```

Böylece `/en/news` sayfası `site.json` içinde ingilizce olarak maplendigi icin ingilizce olarak ele alinmali. 

---

# 8. Tag manifest sistemi

Mevcut sistem tag’leri script ile çekip `src/data/tags.json` dosyasına yazıyor.

Runtime’da ise tag dosyası `fs.readFileSync` ile okunuyor.

Bu yapı şu şekilde değiştirilmeli:

```text
scripts/
└── sync-substack-tags.ts

src/generated/
└── substack-tags.json
```

Tags:

```json
{
  "generatedAt": "2026-07-26T00:00:00.000Z",
  "publicationUrl": "https://uygulama.substack.com",
  "tags": [
    {
      "id": "uuid-1",
      "publication_id": "publication-id-1",
      "slug": "haberler",
      "name": "Haberler",
    },
    {
      "id": "uuid-2",
      "publication_id": "publication-id-2",
      "slug": "news",
      "name": "News",
    }
  ]
}
```

Manifest doğrudan statik JSON import ile kullanılmalı:

```ts
import manifest from "@/data/substack-tags.json";
```

Her request’te filesystem işlemi yapılmamalı.

---

# 9. Substack adapter refactor

Mevcut interface şu yetenekleri içeriyor:

* `getPosts`
* `getPost`
* `getSections`
* `search`
* `getTagBySlug`

Yeni yapı transport ile domain repository’yi ayırmalı:

```text
src/lib/substack/
├── schemas.ts
├── transport.ts
├── normalizers.ts
├── manifest.ts
├── repository.ts
├── errors.ts
└── types.ts
```

## 9.1 Transport

Yalnızca HTTP iletişimi:

```ts
interface SubstackTransport {
  getArchive(input: {
    offset: number;
    limit: number;
    postTagId?: string;
  }): Promise<unknown>;

  getPost(slug: string): Promise<unknown>;

  search(query: string): Promise<unknown>;
}
```

## 9.2 Repository

Locale ve site kurallarını bilen katman:

```ts
interface SubstackRepository {
  getPostsByLocale(input: {
    locale: Locale;
    page: number;
    limit: number;
    topic?: string;
  }): Promise<ArchivePage>;

  getPostByLocale(input: {
    locale: Locale;
    slug: string;
  }): Promise<Post | null>;

  getContentPage(input: {
    locale: Locale;
    pageKey: string;
  }): Promise<Post | null>;

  getTopics(locale: Locale): Topic[];
}
```

## 9.3 Normalize edilmiş archive sonucu

```ts
interface ArchivePage {
  items: PostSummary[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextPage: number | null;
  locale: Locale;
}
```

---

# 10. Dil bazlı archive filtreleme

## Tag filtresi

Seçilmişse locale-specific topic tag doğrudan archive request’ine gönderilecek:

```text
/en/news
↓
news tag ID
↓
archive?post_tag_id=<news-id>
```

---


# 11. Post detay sayfası dil doğrulaması

Bir İngilizce post slug’ı Türkçe URL altında çağrılabilir:

```text
/posts/english-post
```

Bu nedenle yalnızca slug üzerinden `getPost()` çağırmak yeterli değildir.

Akış:

```text
URL locale → tr
↓
post slug ile getir
↓
post.lang === 'tr' veya bos mu?
↓
yoksa notFound()
```

Repository:

```ts
async function getPostByLocale({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const post = await transport.getPost(slug);

  if (!post) {
    return null;
  }

  const source = getLocaleSource(locale);
  const normalized = normalizePost(post);

  const hasExpectedLanguage =
    normalized.lang === locale || normalized.lang === "" ?? false;

  if (!hasExpectedLanguage) {
    return null;
  }

  return normalized;
}
```

Böylece:

```text
/posts/turkce-yazi       → çalışır
/en/posts/turkce-yazi    → 404

/en/posts/english-post   → çalışır
/posts/english-post      → 404
```

---

# 12. UI component değişiklikleri

Locale ve resolved config, üst seviyeden componentlere geçirilmeli.

## Header

Yeni prop:

```ts
interface HeaderProps {
  locale: Locale;
  config: ResolvedSiteConfig;
}
```

Görevler:

* Locale-aware link üretmek.
* Dil seçici göstermek.
* `siteData` doğrudan import’unu kaldırmak.
* Hard-coded İngilizce metinleri kaldırmak.
* `usePathname()` bağımlılığını mümkün olduğunca azaltmak.

## Footer

* Shared social/contact verileri kullanacak.
* Görünen metinleri resolved locale content’ten alacak.
* Locale-aware internal link oluşturacak.

## PostList

Yeni props:

```ts
interface PostListProps {
  locale: Locale;
  archive: ArchivePage;
  tags: Tag[];
  messages: PostMessages;
}
```

Görevler:

* Tarihi `intlLocale` ile formatlamak.
* Locale-aware post URL üretmek.

Mevcut carousel tarih formatı sabit `tr-TR`; bu değer locale config’ten gelmeli.

## DynamicSection

Yeni API:

```ts
interface DynamicSectionProps {
  locale: Locale;
  pageKey: "about";
  imagePosition?: "left" | "right" | "top";
}
```

Component artık doğrudan `pageMap` okumayacak. Locale-specific source config üzerinden post slug çözülecek.

---

# 13. Root layout ve `<html lang>`

Mevcut root layout `<html lang>` değerini tek bir `siteData.lang` alanından alıyor.

Yeni yapıda iki root layout olacak:

```text
src/app/(default)/layout.tsx
src/app/[locale]/layout.tsx
```

Default root layout:

```tsx
export default function DefaultRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteDocument locale={defaultLocale}>
      {children}
    </SiteDocument>
  );
}
```

Secondary locale root layout:

```tsx
export const dynamicParams = false;

export function generateStaticParams() {
  return getSecondaryLocales().map((locale) => ({
    locale,
  }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = requireSecondaryLocale(rawLocale);

  return (
    <SiteDocument locale={locale}>
      {children}
    </SiteDocument>
  );
}
```

Shared document:

```tsx
export function SiteDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const meta = getLocaleMeta(locale);

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.direction}
    >
      <body>{children}</body>
    </html>
  );
}
```

---

# 14. SEO planı

## 14.1 Locale-aware metadata

Root metadata artık sabit `en_US` kullanmamalı. Mevcut metadata içinde Open Graph locale sabit durumda.

Her route için locale-aware `generateMetadata()` kullanılmalı.

Default about:

```text
canonical:
https://example.com/about
```

English about:

```text
canonical:
https://example.com/en/about
```

Alternates:

```ts
alternates: {
  canonical: currentUrl,
  languages: {
    tr: "https://example.com/about",
    en: "https://example.com/en/about",
    "x-default": "https://example.com/about"
  }
}
```

Bir çeviri gerçekten mevcut değilse o locale için alternate üretilmemeli.

## 14.2 Post metadata

Substack alan önceliği:

```text
search_engine_title
→ social_title
→ title
```

Description önceliği:

```text
search_engine_description
→ description
→ subtitle
```

Open Graph:

* `type: article`
* Locale-specific `locale`
* Cover image
* Publication date
* Canonical URL
* Site name

## 14.3 Sitemap

`sitemap.ts` şu kaynaklardan URL üretmeli:

* Static pages
* Locale-specific posts
* Topic pages
* Gerçekten mevcut çeviri eşleşmeleri

Default locale URL’lerinde prefix bulunmamalı.

## 14.4 Structured data

Post sayfası:

* `Article` veya `BlogPosting`
* `BreadcrumbList`

Site genelinde:

* `Organization`

## 14.5 Search ve filter URL’leri

Önerilen index politikası:

```text
/posts?page=2             → index, follow
/posts?search=query       → noindex, follow
```

Kalıcı topic URL’leri tercih edilirse:

```text
/news
/en/news
```


---

# 15. Cache ve revalidation

Proxy olmadığı için public URL ile route cache anahtarı aynı olacak.

Önerilen cache süreleri:

```ts
const CACHE = {
  archive: 3600,
  post: 3600,
  staticContentPage: 3600,
  search: 3600,
} as const;
```

Archive:

```ts
fetch(url, {
  next: {
    revalidate: CACHE.archive,
    tags: [
      "substack",
      "substack:posts",
      `substack:locale:${locale}`,
      `substack:tag:${tagId}`
    ]
  }
});
```

Post:

```ts
fetch(url, {
  next: {
    revalidate: CACHE.post,
    tags: [
      "substack",
      "substack:posts",
      `substack:locale:${locale}`,
      `substack:post:${slug}`
    ]
  }
});
```

Revalidation endpoint:

```text
POST /api/revalidate
```

Güvenlik:

* Secret veya HMAC doğrulama
* Allowed event types
* Rate limit
* User-supplied arbitrary path kabul etmeme

Revalidation:

```ts
revalidateTag(`substack:post:${slug}`, "max");
revalidateTag(`substack:locale:${locale}`, "max");
```

Gerekirse route:

```ts
revalidatePath(localizedPath(locale, `/posts/${slug}`));
```

---

# 16. Hata yönetimi

Substack adapter artık her hatada boş array döndürmemeli. Mevcut yapı upstream hataları ile gerçek boş sonuçları birbirinden ayırmıyor.

Yeni hata tipleri:

```ts
type ContentErrorCode =
  | "NOT_FOUND"
  | "INVALID_CONFIGURATION"
  | "MISSING_LANGUAGE_TAG"
  | "UPSTREAM_UNAVAILABLE"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "INVALID_RESPONSE";
```

UI davranışı:

| Durum                       | Sonuç                                  |
| --------------------------- | -------------------------------------- |
| Bu dilde post yok           | Normal empty state                     |
| Language tag manifestte yok | Configuration error                    |
| Substack 404                | `notFound()`                           |
| Substack timeout            | Error boundary / retry                 |
| Geçersiz JSON               | Log + 503                              |
| Rate limit                  | Stale cache varsa göster               |
| Yanlış dil tag’i            | Sonuçtan çıkar veya post detail’de 404 |

---

# 17. Geliştirme aşamaları

## PR 1 — Config v2 ve validation

Yapılacaklar:

* Yeni `site.json` yapısı.
* Zod schema.
* Locale types.
* Deep fallback resolver.
* Locale source resolver.
* URL helper.
* Config validation script.
* Default ve English örnek verileri.

Acceptance criteria:

* `getResolvedSiteConfig("tr")` tam config döndürür.
* `getResolvedSiteConfig("en")` English override + Turkish fallback döndürür.
* Array’ler replace edilir, object’ler merge edilir.
* `null` explicit disable olarak çalışır.

## PR 2 — Proxy’siz locale routes

Yapılacaklar:

* Mevcut `app/layout.tsx` yapısını iki root layout’a ayırma.
* `(default)` route group.
* `[locale]` route group.
* `generateStaticParams`.
* `dynamicParams = false`.
* Ortak page feature componentleri.
* Locale-aware path helper entegrasyonu.

Acceptance criteria:

```text
/                  → 200, lang=tr
/about             → 200, lang=tr
/posts             → 200, lang=tr

/en                → 200, lang=en
/en/about          → 200, lang=en
/en/posts          → 200, lang=en

/tr/about          → static redirect
/foo/about         → 404
```

## PR 3 — Substack manifest ve adapter

Yapılacaklar:

* Tag sync script refactor.
* Generated manifest.
* Static manifest import.
* Runtime response schemas.
* Transport/repository ayrımı.
* Timeout ve error mapping.
* `getSections()` placeholder’ını kaldırma veya uygulama.

Acceptance criteria:

* Eksik tag CI’ı başarısız yapar.
* Runtime’da `fs.readFileSync` kullanılmaz.
* Invalid Substack response type assertion ile kabul edilmez.

## PR 4 — Locale-aware posts archive

Yapılacaklar:

* `getPostsByLocale`.
* Language tag ID çözümleme.
* Archive request’inde `post_tag_id`.
* Topic tag filtreleme.
* Locale-aware tarih formatı.
* Pagination refactor.
* PostList locale props.
* Empty/error state ayrımı.

Acceptance criteria:

* `/posts` yalnızca belirtilen dildeki postları gösterir.
* İlk 20 sonuç içinden doğru locale filtrelenir.
* Pagination ikinci sayfada içerik atlamaz.
* Language tag UI içinde görünmez.

## PR 5 — Post detail ve content pages

Yapılacaklar:

* Locale-aware post detail repository.
* Yanlış locale altında post gösterilmesini engelleme.
* DynamicSection locale refactor.
* Page source mapping.
* Missing translation policy.
* Locale-aware breadcrumb.

Acceptance criteria:

* Türkçe post English route altında 404 döner.
* İngilizce post default route altında 404 döner.
* `/about`, Türkçe Substack page slug’ını kullanır.
* `/en/about`, İngilizce slug’ı kullanır.
* İngilizce page mapping eksikse Türkçe içerik sessizce gösterilmez.

## PR 6 — SEO

Yapılacaklar:

* Locale-aware root metadata.
* Post metadata.
* Canonical.
* `hreflang`.
* Sitemap.
* Robots.
* JSON-LD.
* Open Graph locale.
* Translation availability kontrolü.

Acceptance criteria:

* `/about` canonical’ı `/about`.
* `/en/about` canonical’ı `/en/about`.
* Default URL’lerde `/tr` oluşmaz.
* İngilizce çeviri yoksa `hreflang=en` üretilmez.
* Post structured data doğru dili ve URL’yi kullanır.

## PR 7 — Cache, security ve resilience

Yapılacaklar:

* Merkezi cache constants.
* Locale-specific cache tags.
* Signed revalidation.
* HTML sanitization.
* Structured logging.
* Error boundaries.
* Stale cache stratejisi.

Acceptance criteria:

* Bir İngilizce post update’i yalnızca gerekli archive/post cache’lerini invalid eder.
* HTML içindeki script/event handler’lar render edilmez.
* Substack outage normal “no posts” mesajı olarak gösterilmez.
* Revalidation endpoint secret olmadan çalışmaz.

## PR 8 — Test, CI ve dokümantasyon

Yapılacaklar:

* README güncellemesi.
* “Yeni dil ekleme” rehberi.

Acceptance criteria:

```text
lint
typecheck
build
```

adımlarının tamamı CI’da başarılı olmalı.


# 18. Yeni dil ekleme süreci

Örneğin Almanca eklenmesi:

## Adım 1

`i18n.locales.de` eklenir:

```json
"de": {
  "enabled": true,
  "label": "Deutsch",
  "htmlLang": "de",
  "intlLocale": "de-DE",
  "openGraphLocale": "de_DE",
  "direction": "ltr"
}
```

## Adım 2

`sources.de` eklenir:

```json
"de": {
  "substack": {
    "pages": {
      "about": "uber-uns"
    }
  }
}
```

## Adım 4

Yalnızca çevrilmiş content override’ları eklenir:

```json
"content": {
  "de": {
    "navigation": {
      "items": {
        "posts": {
          "label": "Beiträge"
        }
      }
    }
  }
}
```

Eksik UI alanları default locale’den gelir.

Route kodu değiştirilmez:

```text
/de
/de/about
/de/posts
```

`generateStaticParams()` yeni locale’i config üzerinden otomatik üretir.

