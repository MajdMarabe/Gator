import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config.js"; //import { readConfig } from "./src/config";


const cfg = readConfig();

export default defineConfig({
  schema: "src/schema",          /////////  schema: "src/schema.ts",          /////////

  out: "src/db/migrations",     
  dialect: "postgresql",
  dbCredentials: {
    url: cfg.dbUrl,             
  },
});