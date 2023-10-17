import { CONFIG } from 'api/src/lib/constants'
import { Worker } from 'bullmq'

export default async () => {
  try {
    const worker = new Worker(
      'email',
      async (job) => {
        const { id, data } = job

        console.log(`Job ID: ${id} is being processed!`)
        console.log('--this is data', data)
      },
      {
        removeOnComplete: {
          age: 1,
          count: 0,
        },
        lockDuration: 30000,
        connection: CONFIG.redis.jobQueueConnection,
      }
    )

    worker.on('completed', (job) => {
      console.log(`Job ID: ${job.id} is done!`)
    })
    worker.on('active', (job) => {
      console.log(`Job ID: ${job.id} is running!`)
    })
    worker.on('error', (err) => {
      console.error(err)
    })

    worker.on('failed', (job, err) => {
      console.error(`${job?.id} has failed with ${err.message}`)
    })
    worker.on('drained', () => {
      console.log(`No more jobs`)
    })
  } catch (error) {
    console.error(error)
  }
}
