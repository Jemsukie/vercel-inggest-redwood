import { Worker } from 'bullmq'
import dotenv from 'dotenv'

dotenv.config()

const CONFIG = {
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

// const _emailProcess = ({
//   data: { tribeId, email, name, tempPassword, batch, origin, template },
// }) => {
//   const params = {
//     tribeId,
//     email,
//     name,
//     batch,
//     tempPassword,
//     loginLink: `${origin}/login?extraData=${btoa(JSON.stringify({ email }))}`,
//     forgotPasswordLink: `${origin}/set-new-password?extraData=${btoa(
//       JSON.stringify({
//         email,
//         password: tempPassword,
//       })
//     )}`,
//   }

//   return sendEmail({
//     to: email,
//     template,
//     params,
//   })
// }

// const sendEmail = async ({ to, template, params }) => {
//   const data = JSON.parse(template)
//   return await fetch('https://api.brevo.com/v3/smtp/email', {
//     // TODO, merge options.headers if exist
//     headers: {
//       accept: 'application/json',
//       'api-key': CONFIG.brevo.apiKey,
//     },
//     method: 'POST',
//     body: JSON.stringify({
//       sender: {
//         name: `"Atlas Admin" <${CONFIG.brevo.senderEmail}>`,
//         email: CONFIG.brevo.tempSenderEmail,
//       },
//       to: [
//         {
//           email: to,
//           name: params.name,
//         },
//       ],
//       ...compileTemplate({ data, params }),
//     }),
//   })
//     .then((result) => {
//       console.log('Email Sent!')
//       return result
//     })
//     .catch((err) => console.error(err))
// }

// const compileTemplate = ({ data, params }) => {
//   let HTML_CONTENT = data.htmlContent
//   let SUBJECT = data.subject

//   const paramArray = Object.entries(params).map(([key, value]) => {
//     return {
//       toReplace: `{{params.${key}}}`,
//       toPut: value,
//     }
//   })

//   // Iterate through the paramArray and replace placeholders in the HTML
//   paramArray.forEach((param) => {
//     const { toReplace, toPut } = param
//     const regex = new RegExp(
//       toReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
//       'g'
//     )
//     HTML_CONTENT = HTML_CONTENT.replace(regex, toPut)
//     SUBJECT = SUBJECT.replace(regex, toPut)
//   })

//   return {
//     htmlContent: HTML_CONTENT,
//     subject: SUBJECT,
//   }
// }

const worker = new Worker(
  'email',
  async (job) => {
    const { id, data } = job

    console.log(`${new Date()} - Job ID: ${id} is being processed!`)

    // await emailProcess({ data })
    console.log('--this is data', data)
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
// worker.on('drained', () => {
//   console.log(`${new Date()} - No more jobs`)
// })
