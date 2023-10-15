import Queue from 'bull'

import { CONFIG } from './constants'

const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
  settings: {
    lockDuration: 3600000,
  },
})

emailQueue.isReady().then(async (_res) => {
  console.log('--EmailQueue is now Ready!')

  emailQueue.process(async (job, done) => {
    console.log(`Job ${job.id} is now in process!`)

    done()
  })

  emailQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is now in waiting list!`)
  })

  emailQueue.on('active', (job) => {
    console.log(`Job ${job.id} is now in active!`)
  })
})

export default emailQueue
