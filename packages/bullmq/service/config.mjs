import dotenv from 'dotenv'
dotenv.config() // We use this to enable `.env` in workspaces

export const CONFIG = {
  redis: {
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
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
