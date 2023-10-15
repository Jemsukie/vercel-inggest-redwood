import axios from 'axios'
import { Worker } from 'bullmq'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const CONFIG = {
  redis: {
    jobQueueConnection: {
      host: process.env.JOB_QUEUE_HOST || '127.0.0.1',
      port: parseInt(process.env.JOB_QUEUE_PORT || '6379'),
      username: process.env.JOB_QUEUE_USERNAME || '',
      password: process.env.JOB_QUEUE_PASSWORD || '',
    },
  },
  vercel: {
    environment: process.env.VERCEL_ENV || '',
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
    senderEmail: process.env.SENDER_EMAIL || '',
    key: process.env.BREVO_KEY || '',
    tempSenderEmail: process.env.TEMP_SENDER_EMAIL || '',
  },
}

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

const worker = new Worker(
  'email',
  async (job) => {
    const { id } = job

    console.log(`Job ID: ${id} is being processed!`)

    await emailProcess()
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

express().get('/get-jobs', async (_req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Jobs in Queue: ${await worker.keys}`)
})

export default express()
