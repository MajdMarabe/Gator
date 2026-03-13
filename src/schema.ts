import { pgTable, timestamp, uuid, text, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});
export const feeds = pgTable("feeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
    last_fetched_at: timestamp("last_fetched_at"), 

  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});
export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),

    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

    feedId: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueFollow: uniqueIndex("unique_follow")
      .on(table.userId, table.feedId),
  })
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

title: text("title").notNull(),

 url: text("url").notNull().unique(),
description: text("description"),
publishedAt: timestamp("published_at"),
 feedId: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" }),
});
export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;