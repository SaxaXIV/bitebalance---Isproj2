import "dotenv/config";

export default {
  db: {
    adapter: "postgresql",
    url: process.env.DATABASE_URL,
  },
};