import { UserCommandHandler } from "./commands";
import { readConfig,setUser } from "./config";
import { createFeedFollow, deleteFeedFollowByUrl, getFeedByURL, getFeedFollowsForUser } from "./db/queries/feed_follows";
import { createFeed, getFeeds, scrapeFeeds } from "./db/queries/feeds";
import { getPostsForUser } from "./db/queries/posts";
import { createUser, getUserByName, getUsers, resetUsers } from "./db/queries/users";
import { fetchFeed } from "./rss";
import { Feed, User } from "./schema";
import { parseDuration } from "./utils";
export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("username is required");
  }
 
  const username = args[0];
 const user = await getUserByName(username);
  if (!user) {
    console.error(`User "${username}" does not exist!`);
       process.exit(1); }
  setUser(username);

  console.log(`User set to ${username}`);
}
export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("username is required");
  }

  const username = args[0];
const user = await createUser(username);
  setUser(username);

  console.log(`User set to ${username}`);
    console.log("User data:", user);

}

export const handlerReset: CommandHandler = async (cmdName, ...args) => {
  const success = await resetUsers();
  if (success) {
      console.log("Database reset successfully!");
    process.exit(0); } else {
    console.error("Database reset failed!");
      process.exit(1); 
  
  }
};

export const handlerUsers: CommandHandler = async (cmdName, ...args) => {
       const allUsers = await getUsers();

  if (allUsers.length === 0) {
                 console.log("No users found.");
    return;
  }

  allUsers.forEach((user) => {
      const config = readConfig();
    
      const isCurrent = config.currentUserName === user.name ? " (current)" : "";
    console.log(`* ${user.name}${isCurrent}`);
  });

  process.exit(0);
};


export const handlerAddFeed: UserCommandHandler = async (
  _,
  user,
  ...args
) => {

  if (args.length < 2) {
    throw new Error("name and url are required");
  }

  const name = args[0];
  const url = args[1];

  const feed = await createFeed(name, url, user.id);

  await createFeedFollow(user.id, feed.id);

  printFeed(feed, user);
};
export function printFeed(feed: Feed, user: User) {
  console.log("Feed added:");
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User: ${user.name}`);
}

export const handlerFeeds: CommandHandler = async () => {
  const feeds = await getFeeds();

  for (const feed of feeds) {
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`User: ${feed.userName}`);
    console.log("-----");
  }
};

export const handlerFollow: UserCommandHandler = async (
  _,
  user,
  ...args
) => {
  if (args.length === 0) {
    throw new Error("URL is required");
  }

  const url = args[0];

const feed = await getFeedByURL(url);
  if (!feed) throw new Error("Feed not found");

  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${user.name} is now following ${follow.feedName}`);
};
export const handlerFollowing = async () => {

  const config = readConfig();

  const user = await getUserByName(config.currentUserName || "");
const follows = await getFeedFollowsForUser(user.id);

  for (const follow of follows) {
    console.log(follow.feedName); }
};

export const handlerUnfollow: UserCommandHandler = async (_,user,...args) => {
  if (args.length === 0) {
    throw new Error("Feed URL is required");
      }

  const url = args[0];
  await deleteFeedFollowByUrl(user.id, url);
       console.log(`${user.name} has unfollowed feed: ${url}`);
};

export const handlerAgg: CommandHandler = async (_, ...args) => {
  if (args.length === 0) {
    throw new Error("time_between_reqs argument is required");
  }

  const durationStr = args[0];
  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${durationStr}`);

    scrapeFeeds().catch(console.error);

    const interval = setInterval(() => {
    scrapeFeeds().catch(console.error);
  }, timeBetweenRequests);

     await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator.");
       clearInterval(interval);
      resolve();
    });
  });
};

export const handlerBrowse: UserCommandHandler = async (
  _,
  user,
  ...args
) => {
  const limit = args.length > 0 ? parseInt(args[0]) : 2;

  const posts = await getPostsForUser(user.id, limit);

  for (const post of posts) {
    console.log(post.title);
    console.log(post.url);
    console.log("-----");
  }
};