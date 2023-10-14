export const CONFIG = {
  redis: {
    jobQueueConnection: {
      host: process.env.JOB_QUEUE_HOST || '127.0.0.1',
      port: parseInt(process.env.JOB_QUEUE_PORT  || '6379'),
      username: process.env.JOB_QUEUE_USERNAME || '',
      password: process.env.JOB_QUEUE_PASSWORD || ''
    }
  },
  vercel: {
    environment: process.env.VERCEL_ENV || ''
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY || '',
    senderEmail: process.env.SENDER_EMAIL || '',
    key: process.env.BREVO_KEY || '',
    tempSenderEmail: process.env.TEMP_SENDER_EMAIL || '',
  },
}


