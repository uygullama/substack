"use client";

import { useState } from "react";
import { getArchivePosts, type SubstackPost } from "@/app/actions";
import type { Locale } from "@/lib/config/site.types";
import PostCard from "./post-card";

export default function PostList({
  initialPosts,
  initialCursor = null,
  postTagId,
  locale,
  dict,
}: {
  initialPosts: SubstackPost[];
  initialCursor?: string | null;
  postTagId?: string;
  locale: Locale;
  dict: Record<string, string>;
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

  return (
    <div className="flex flex-col">
      {posts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          {dict.noPosts || "No posts found yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((item) => (
            <PostCard key={item.id} item={item} locale={locale} dict={dict} />
          ))}
        </div>
      )}

      {cursor && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? dict.loading : dict.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
