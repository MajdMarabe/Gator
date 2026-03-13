# Gator CLI

Gator is an (RSS feed aggregator Command-Line Interface (CLI))  
It is a CLI tool that allows users to:

-Add RSS feeds from across the internet to be collected
-Store the collected posts in a PostgreSQL database
-Follow and unfollow RSS feeds that other users have added
-View summaries of the aggregated posts in the terminal, with a link to the full post

## Requirements

To run Gator, you need:

- Node.js
- npm
- PostgreSQL
- TypeScript
- Drizzle ORM



### CLI Commands

1.Register a new user
npx tsx src/index.ts register username

2.Login
npx tsx src/index.ts login username

3.Add a new feed
npx tsx src/index.ts addfeed BootDev https://www.boot.dev/blog/index.xml

4.View all feeds
npx tsx src/index.ts feeds

5.Follow a feed
npx tsx src/index.ts follow https://www.boot.dev/blog/index.xml

6.Unfollow a feed
npx tsx src/index.ts unfollow https://www.boot.dev/blog/index.xml

7.View feeds you are following
npx tsx src/index.ts following

8.Run the aggregator
npx tsx src/index.ts agg 10s

9.View latest posts for the current user
npx tsx src/index.ts browse

10.You can optionally specify a limit:
npx tsx src/index.ts browse 5

11.Reset the database
npx tsx src/index.ts reset
