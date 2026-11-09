# Substack API Breaking Changes & Migration Guide

This document details the recent breaking changes introduced by Substack to the `/api/v1/archive` endpoint and provides step - by - step instructions to update other projects using the same template/architecture.

---

## 1. What Changed on Substack's Side?

Substack made two breaking changes to the `/api/v1/archive` endpoint:

### A. `offset` Query Parameter Removed(Replaced by`cursor`)
Passing`offset`(even`offset=0`) to `/api/v1/archive` now fails with an ** HTTP 400 Bad Request **:
```json
{
  "errors": [
    {
      "location": "query",
      "param": "offset",
      "value": "0",
      "msg": "Invalid value"
    }
  ]
}
```
Pagination is now ** cursor - based ** via the optional `cursor` query parameter(e.g., `?sort=new&limit=20&cursor=<base64_cursor>`).

### B.Response Payload Structure Changed
Previously, `/api/v1/archive` returned a flat JSON array of posts(`PostSummary[]`).
It now returns an object containing `posts` and `nextCursor`:
```json
{
  "posts": [ ... ],
  "nextCursor": "eyJwb3N0X2RhdGUiOiIyMDI2LTEwLTEzVDE0OjQzOjE1LjU1Nzk1MVoifQ=="
}
```
    * (When there are no more pages to load, `nextCursor` is`null`.)*

> ** Note:** Single post fetching(`/api/v1/posts/${slug}`) has ** not ** changed and still returns a single `Post` object directly.

---

## 2. Files to Update

Below is the complete list of files that need to be updated in projects sharing this template.

### 2.1. `src/lib/substack.ts`
1. Add the `ArchiveResponse` interface.
2. Update `SubStack.getPosts` signature: remove`offset`, add`cursor`, and return `Promise<ArchiveResponse>`.
3. In`getPosts()`, remove`offset` from`URLSearchParams`, conditionally append`cursor`, and parse`{ posts, nextCursor }`(with fallback support if an array is ever returned).
4. In`search()`, unwrap`data.posts` instead of assuming `data` is an array.

```ts
export interface ArchiveResponse {
  posts: PostSummary[];
  nextCursor: string | null;
}

export interface SubStack {
  getPosts(
    limit?: number,
    postTagId?: string,
    cursor?: string,
  ): Promise<ArchiveResponse>;
  getPost(slug: string): Promise<Post | null>;
  getSections(): Promise<Section[]>;
  search(query: string): Promise<PostSummary[]>;
  getTagBySlug(slug: string, locale?: "en" | "tr"): TagData | null;
}
```

Updated `getPosts` implementation:
```ts
  async getPosts(
    limit = 20,
    postTagId?: string,
    cursor?: string,
  ): Promise<ArchiveResponse> {
    try {
      const params = new URLSearchParams({
        sort: "new",
        limit: String(limit),
      });

      if (cursor) {
        params.append("cursor", cursor);
      }

      if (postTagId) {
        params.append("post_tag_id", postTagId);
      }

      const url = `${ this.baseUrl } /api/v1 / archive ? ${ params.toString() } `;
      const res = await fetch(url, {
        next: { revalidate: 3600, tags: ["substack-posts"] },
      });

      if (!res.ok) {
        console.error("Failed to fetch posts:", res.statusText);
        return { posts: [], nextCursor: null };
      }

      const data = (await res.json()) as
        | PostSummary[]
        | { posts?: PostSummary[]; nextCursor?: string | null };
      const rawPosts = Array.isArray(data) ? data : (data.posts ?? []);
      const nextCursor = Array.isArray(data) ? null : (data.nextCursor ?? null);

      return {
        posts: rawPosts.map((post) => ({
          ...post,
          title: cleanTitle(post.title),
        })),
        nextCursor,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { posts: [], nextCursor: null };
    }
  }
```

Updated `search` implementation:
```ts
      const data = (await res.json()) as
        | PostSummary[]
        | { posts?: PostSummary[] };
      const rawPosts = Array.isArray(data) ? data : (data.posts ?? []);
      return rawPosts.map((post) => ({
        ...post,
        title: cleanTitle(post.title),
      }));
```

---

### 2.2. `src/app/posts/actions.ts`
Update the server action to accept `cursor` instead of `offset` and return `ArchiveResponse`:

```ts
"use server";

import {
  type ArchiveResponse,
  type PostSummary,
  substack,
} from "@/lib/substack";

export type SubstackPost = PostSummary;

export async function getArchivePosts(
  limit = 20,
  postTagId?: string,
  cursor?: string,
): Promise<ArchiveResponse> {
  return substack.getPosts(limit, postTagId, cursor);
}
```

---

### 2.3. `src/components/feature/post-list.tsx`
Replace`offset` - based`hasMore` logic with `cursor` state:

```tsx
export default function PostList({
  initialPosts,
  initialCursor = null,
  postTagId,
}: {
  initialPosts: SubstackPost[];
  initialCursor?: string | null;
  postTagId?: string;
}) {
  const [posts, setPosts] = useState<SubstackPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!cursor) return;
    setLoading(true);
    try {
      const { posts: nextPosts, nextCursor } = await getArchivePosts(
        20,
        postTagId,
        cursor,
      );
      setPosts((prev) => [...prev, ...nextPosts]);
      setCursor(nextCursor);
    } catch (err) {
      console.error("Error loading more posts", err);
    } finally {
      setLoading(false);
    }
  };
```
And update the "Load More" button condition from `{hasMore && (` to`{cursor && (`.

---

### 2.4. `src/components/feature/substack-section.tsx`(or Homepage Sections)
Update any homepage / section components calling `substack.getPosts`:

```tsx
// Before:
const news = newsTag ? await substack.getPosts(0, 10, newsTag.id) : [];

// After:
const { posts: news } = newsTag
  ? await substack.getPosts(10, newsTag.id)
  : { posts: [] };
```
    * (If your other site also fetches `announcements` or other tags in `substack-section.tsx`, destructure`{ posts: announcements }` and remove the leading `0` offset argument there as well.)*

        ---

### 2.5.Archive & Tag Pages
Update all pages that render `<PostList />` to destructure `{ posts: initialPosts, nextCursor }` and pass `initialCursor={nextCursor}`:

- ** `src/app/posts/page.tsx` ** (and ** `src/app/tr/haberler/page.tsx` ** if localized):
    ```tsx
  const { posts: initialPosts, nextCursor } = await getArchivePosts(20);
  // ...
  <PostList initialPosts={initialPosts} initialCursor={nextCursor} />
  ```

        - ** `src/app/[tag]/page.tsx` ** (and any localized tag route):
```tsx
  const { posts: initialPosts, nextCursor } = await substack.getPosts(
    20,
    tagData.id,
  );
  // ...
  <PostList
    initialPosts={initialPosts}
    initialCursor={nextCursor}
    postTagId={tagData.id}
  />
  ```

