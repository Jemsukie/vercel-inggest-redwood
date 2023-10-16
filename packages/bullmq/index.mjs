import { Worker } from 'bullmq'
import express from 'express'

import { CONFIG } from './service/config.mjs'
import emailProcess from './utils/email.mjs'

const app = express()

app.get('/', () => {
  console.log('Root path')
})

app.listen(async () => {
  console.log('Express listening...')
  const worker = await new Worker(
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

  await worker.on('completed', (job) => {
    console.log(`${new Date()} - Job ID: ${job.id} is done!`)
  })
  await worker.on('active', (job) => {
    console.log(`${new Date()} - Job ID: ${job.id} is running!`)
  })
  await worker.on('error', (err) => {
    console.error(err)
  })
  await worker.on('failed', (job, err) => {
    console.error(`${new Date()} - ${job.id} has failed with ${err}`)
  })
  await worker.on('drained', () => {
    console.log(`${new Date()} - No more jobs`)
  })
})

export default app
