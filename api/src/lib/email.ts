import { CONFIG } from "./constants";
import  Queue from "bull";

export const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
})

emailQueue.addListener('waiting', (job) => {
  console.log('--this is job', job)
})
