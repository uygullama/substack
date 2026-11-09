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
