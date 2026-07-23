"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubstackPost, getArchivePosts } from "@/app/posts/actions";

export default function PostList({ initialPosts, postTagId }: { initialPosts: SubstackPost[], postTagId?: string }) {
  const [posts, setPosts] = useState<SubstackPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === 20);

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPosts = await getArchivePosts(posts.length, 20, postTagId);
      setPosts((prev) => [...prev, ...nextPosts]);
      
      // If we received less than 20, there are no more posts
      if (nextPosts.length < 20) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more posts", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item) => (
          <Link key={item.id} href={`/posts/${item.slug}`} className="block h-full group">
            <div className="border rounded-lg shadow-sm bg-background overflow-hidden h-full flex flex-col group-hover:border-primary/50 transition-colors">
              {item.cover_image ? (
                <div className="relative w-full h-48 bg-muted border-b">
                  <img
                    src={item.cover_image}
                    alt={item.title || "News image"}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center border-b">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <CardHeader className="p-4 pb-2">
                <div className="text-xs text-muted-foreground mb-2">
                  {item.post_date ? new Date(item.post_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.subtitle || item.description}
                </p>
              </CardContent>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
