import { Worker } from 'bullmq'
import express from 'express'

import { CONFIG } from './service/config.mjs'
import emailProcess from './utils/email.mjs'

const app = express()

const worker = new Worker(
  'email',
  async (job) => {
    const { id, data } = job

    console.log(`${new Date()} - Job ID: ${id} is being processed!`)

    await emailProcess({ data })
  },
  {
    removeOnComplete: {
      age: 1,
      count: 0,
    },
    lockDuration: 3600000,
    connection: CONFIG.redis.jobQueueConnection,
  }
)

worker.on('completed', (job) => {
  console.log(`${new Date()} - Job ID: ${job.id} is done!`)
})
worker.on('active', (job) => {
  console.log(`${new Date()} - Job ID: ${job.id} is running!`)
})
worker.on('error', (err) => {
  console.error(err)
})
worker.on('failed', (job, err) => {
  console.error(`${new Date()} - ${job.id} has failed with ${err}`)
})
worker.on('drained', () => {
  console.log(`${new Date()} - No more jobs`)
})

export default app
