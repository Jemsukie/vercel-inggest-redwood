import Queue, { Job } from 'bull'

import { CONFIG } from './constants'

const axios = require('axios')

export const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
})

const emailProcess = async () => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
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
        htmlContent: 'Hello, this is testing',
        subject: 'Testing this part',
      },
      {
        headers: {
          accept: 'application/json',
          'api-key': CONFIG.brevo.apiKey,
        },
      }
    )

    // Handle the response here if needed
    console.log('Email sent:', response.data)
  } catch (error) {
    // Handle errors here
    console.error('Error sending email:', error)
  }
}

export const emailWorker = async () =>
  await emailQueue.process('email', async (job, done) => {
    console.log(`Job ${job.id} is now processing!`)
    await emailProcess().then((_r) => {
      console.log(`Job ${job.id} is now finished!`)
      done()
    })
  })

emailWorker()

emailQueue.on('waiting', async (jobId) => {
  console.log(`Job ${jobId} is now in waiting list!`)

  await emailProcess().then(async (_r) => {
    console.log(`Process ${jobId} Done!`)
    const job = await emailQueue.getJob(jobId)
    await job?.takeLock()
    await job?.moveToCompleted('Successfully completed!', true)
    await job?.releaseLock()
    await job?.remove()
  })
})

emailQueue.on('active', (job) => {
  console.log(`Job ${job.id} is now in active!`)
})
