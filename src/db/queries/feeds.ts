import { fetchFeed } from "src/rss";
import { db } from "..";
import { feeds, users } from "../../schema.js";
import { eq, sql } from "drizzle-orm";
import { createPost } from "./posts";

export async function createFeed(
  name: string,
  url: string,
  userId: string
) {
  const [feed] = await db
    .insert(feeds)
    .values({
      name,
      url,
      user_id: userId,
    })
    .returning();

  return feed;
}
export async function getFeeds() {
  const result = await db
    .select({
      name: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.user_id, users.id));

  return result;
}
export async function markFeedFetched(feedId: string) {
  const now = new Date();
  await db
    .update(feeds)
    .set({
      last_fetched_at: now,
      updated_at: now,
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`last_fetched_at NULLS FIRST`)
    .limit(1);

  return feed;
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }

  console.log(`Fetching feed: ${feed.name} (${feed.url})`);

  await markFeedFetched(feed.id);

  const rss = await fetchFeed(feed.url);

 
for (const item of rss.channel.item) {
  await createPost({
    title: item.title,
    url: item.link,
    description: item.description,
    publishedAt: new Date(item.pubDate),
    feedId: feed.id,
  });
}
}