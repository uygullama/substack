import fs from "node:fs";
import path from "node:path";
import siteData from "@/data/site.json";

export interface PostSummary {
  id?: number;
  title: string;
  slug: string;
  type: string;
  post_date: string;
  canonical_url: string;
  description: string;
  cover_image: string | null;
  language: string;
  postTags?: { id: string; name: string; slug: string }[];
  wordcount: number;
  subtitle?: string;
}

export interface TagData {
  id: string;
  name: string;
  slug: string;
}

export interface Post extends PostSummary {
  body_html: string;
  social_title: string;
  search_engine_title: string;
  search_engine_description: string;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
}

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
  getTagBySlug(slug: string): TagData | null;
}

class SubstackAPI implements SubStack {
  private get baseUrl() {
    return siteData.shared.substack;
  }

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

      const url = `${this.baseUrl}/api/v1/archive?${params.toString()}`;
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
        posts: rawPosts,
        nextCursor,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { posts: [], nextCursor: null };
    }
  }

  async getPost(slug: string): Promise<Post | null> {
    try {
      const url = `${this.baseUrl}/api/v1/posts/${slug}`;
      const res = await fetch(url, {
        next: { tags: ["substack-posts", "substack"] },
      });

      if (!res.ok) {
        console.error(`Failed to fetch post ${slug}:`, res.statusText);
        return null;
      }

      const data = await res.json();
      return data as Post;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      return null;
    }
  }

  async getSections(): Promise<Section[]> {
    return [];
  }

  async search(query: string): Promise<PostSummary[]> {
    try {
      const params = new URLSearchParams({ search: query });
      const url = `${this.baseUrl}/api/v1/archive?${params.toString()}`;

      const res = await fetch(url, {
        next: { revalidate: 3600, tags: ["substack-search", "substack-posts"] },
      });

      if (!res.ok) {
        console.error(`Failed to search for ${query}:`, res.statusText);
        return [];
      }

      const data = (await res.json()) as
        | PostSummary[]
        | { posts?: PostSummary[] };
      return Array.isArray(data) ? data : (data.posts ?? []);
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      return [];
    }
  }

  getTags(): TagData[] {
    const tagsPath = path.join(process.cwd(), "src/data/substack-tags.json");
    let tags: TagData[] = [];
    try {
      if (fs.existsSync(tagsPath)) {
        const fileContent = fs.readFileSync(tagsPath, "utf-8");
        const parsed = JSON.parse(fileContent);
        if (parsed && Array.isArray(parsed.tags)) {
          tags = parsed.tags;
        }
      }
    } catch (error) {
      console.error("Error reading substack-tags.json:", error);
    }
    return tags;
  }

  getTagBySlug(slug: string): TagData | null {
    const tags = this.getTags();
    return tags.find((t) => t.slug === slug) || null;
  }
}

export const substack = new SubstackAPI();
