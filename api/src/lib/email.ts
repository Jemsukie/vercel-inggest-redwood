import { CONFIG } from "./constants";
import  Queue from "bull";

export const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
  settings: {
    lockDuration: 60000
  }
})
