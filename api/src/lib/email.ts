import Queue from 'bull'

import { CONFIG } from './constants'

const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
  settings: {
    lockDuration: 3600000,
  },
})

emailQueue.isReady().then((_res) => {
  console.log('--EmailQueue is now Ready!')
})

export default emailQueue
