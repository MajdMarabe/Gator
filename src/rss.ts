import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {

  const res = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status}`);
  }

  const xml = await res.text();
const parser = new XMLParser();
  const data = parser.parse(xml);

  if (!data.rss || !data.rss.channel) {
    throw new Error("Invalid RSS feed");}

     const channel = data.rss.channel;

  
     const title = channel.title;
  const link = channel.link;
  const description = channel.description;

    if (!title || !link || !description) {
        throw new Error("Missing channel metadata"); }

  let items: any[] = [];

  if (channel.item) {
    if (Array.isArray(channel.item)) {
       
        items = channel.item;
    } else {
     
        items = [channel.item];
    }
  }

  const parsedItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    parsedItems.push({
    title: item.title,
     link: item.link,
  description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    channel: {
      title,
      link,
      description,
      item: parsedItems,
    },
  };
}