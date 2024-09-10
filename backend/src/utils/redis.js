import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
  url: process.env.REDIS_URI,
});

redis.on("error", function (err) {
  throw err;
});
await redis.connect();
