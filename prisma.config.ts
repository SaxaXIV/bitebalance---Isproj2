import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // Read from DATABASE_URL in the environment (loaded via dotenv above)
    url: env("DATABASE_URL"),
  },
});
