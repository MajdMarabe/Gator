import { feedFollows, feeds, posts } from "src/schema";
import { db } from "..";
import { desc, eq } from "drizzle-orm";

export async function createPost(post: {
  title: string;
  url: string;
  description?: string;
  publishedAt?: Date;
  feedId: string;
}) {
  const [newPost] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      description: post.description,
      publishedAt: post.publishedAt,
      feedId: post.feedId,
    })
    .onConflictDoNothing()
    .returning();

  return newPost;
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      title: posts.title,
      url: posts.url,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return result;
}