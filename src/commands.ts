import { readConfig } from "./config.js";
import { getUserByName } from "./db/queries/users.js";
import type { CommandHandler } from "./handlers.js";
import { User } from "./schema.js";

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];

  if (!handler) {
 throw new Error("command not found");
  }

await handler(cmdName, ...args);
}

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export const middlewareLoggedIn =
  (handler: UserCommandHandler): CommandHandler =>
async (cmdName, ...args) => 
    {

       const config = readConfig();

  const user = await getUserByName(config.currentUserName || "");

    if (!user) {throw new Error("current user not found");}

    await handler(cmdName, user, ...args);
  };