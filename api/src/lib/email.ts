import Queue from 'bull'

import { CONFIG } from './constants'

export const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
})
