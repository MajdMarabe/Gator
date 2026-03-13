import { handlerAddFeed, handlerAgg, handlerBrowse, handlerFeeds, handlerFollow, handlerFollowing, handlerLogin, handlerRegister, handlerReset, handlerUnfollow, handlerUsers } from "./handlers.js";
import {
  middlewareLoggedIn,
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands.js";

async  function main() {
  const registry: CommandsRegistry = {};
registerCommand(registry, "register", handlerRegister);
 registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
registerCommand(registry,"addfeed",middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand( registry, "unfollow",middlewareLoggedIn(handlerUnfollow));
 registerCommand(registry,"browse",middlewareLoggedIn(handlerBrowse));
registerCommand(
  registry,
  "follow",
  middlewareLoggedIn(handlerFollow)
);

registerCommand(
  registry,
  "following",
  middlewareLoggedIn(handlerFollowing)
);
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("not enough arguments");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
      process.exit(0); 
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}

main();