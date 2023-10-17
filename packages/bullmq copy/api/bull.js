import Queue from 'bull'
import dotenv from 'dotenv'
dotenv.config() // We use this to enable `.env` in workspaces

export const emailQueue = new Queue('email', {
  redis: {
    host: process.env.JOB_QUEUE_HOST || '127.0.0.1',
    port: parseInt(process.env.JOB_QUEUE_PORT || '6379'),
    username: process.env.JOB_QUEUE_USERNAME || '',
    password: process.env.JOB_QUEUE_PASSWORD || '',
  },
  settings: {
    lockDuration: 3600000,
  },
})
