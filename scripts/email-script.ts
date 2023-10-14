import {CONFIG} from 'api/src/lib/constants'
import { Worker } from 'bullmq'

export default async () => {
  try{
    const worker = new Worker(
  'email',
  async (job) => {
    const { id, data } = job

    console.log(`Job ID: ${id} is being processed!`)
    await emailProcess()
  },
  {
    // removeOnComplete: {
    //   age: 1,
    //   count: 0,
    // },
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

    worker.close()
})

const emailProcess = async() => {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    // TODO, merge options.headers if exist
    headers: {
      accept: 'application/json',
      'api-key': CONFIG.brevo.apiKey,
    },
    method: 'POST',
    body: JSON.stringify({
      sender: {
        name: `"Atlas Admin" <${CONFIG.brevo.senderEmail}>`,
        email: CONFIG.brevo.tempSenderEmail,
      },
      to: [
        {
          email: 'jemuel.lupo@gmail.com',
          name: 'Dev Testing',
        },
      ],
      htmlContent: 'Hello this is testing',
      subject: 'Testing this part',
    }),
  })
}

  } catch(error){
    console.error(error)
  }
}
