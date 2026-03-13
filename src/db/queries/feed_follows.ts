import { db } from "..";

import { feedFollows, feeds, users } from "../../schema.js";
import { and, eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {

  const [newFollow] = await db
    .insert(feedFollows)
    .values({
      userId,
      feedId,
    })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, newFollow.id));

  return result;

}

export async function getFeedByURL(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return feed;
}


export async function getFeedFollowsForUser(userId: string) {

  const result = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function deleteFeedFollowByUrl(userId: string, feedUrl: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  if (!feed) {
throw new Error(`Feed with URL "${feedUrl}" not found`);}

      await db
    .delete(feedFollows)
    .where(
          and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id))

    );
}