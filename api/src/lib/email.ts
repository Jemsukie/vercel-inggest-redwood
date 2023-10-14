import { Queue } from "bullmq";
import { CONFIG } from "./constants";

export const emailQueue = new Queue('email', {
  connection: CONFIG.redis.jobQueueConnection,
})
