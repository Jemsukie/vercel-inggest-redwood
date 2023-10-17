import Queue from 'bull'
import { Worker } from 'bullmq'

import { CONFIG } from './constants'

const emailQueue = new Queue('email', {
  redis: CONFIG.redis.jobQueueConnection,
  settings: {
    lockDuration: 3600000,
  },
})

// emailQueue.isReady().then(async (_res) => {
//   console.log('--EmailQueue is now Ready!')

//   emailQueue.process(async (job, done) => {
//     console.log(`Job ${job.id} is now in process!`)

//     done()
//   })

//   emailQueue.on('waiting', (jobId) => {
//     console.log(`Job ${jobId} is now in waiting list!`)
//   })

//   emailQueue.on('active', (job) => {
//     console.log(`Job ${job.id} is now in active!`)
//   })
// })

export const worker = new Worker(
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

const emailProcess = ({
  data: { tribeId, email, name, tempPassword, batch, origin, template },
}: any) => {
  const params = {
    tribeId,
    email,
    name,
    batch,
    tempPassword,
    loginLink: `${origin}/login?extraData=${btoa(JSON.stringify({ email }))}`,
    forgotPasswordLink: `${origin}/set-new-password?extraData=${btoa(
      JSON.stringify({
        email,
        password: tempPassword,
      })
    )}`,
  }

  return sendEmail({
    to: email,
    template,
    params,
  })
}

const sendEmail = async ({ to, template, params }: any) => {
  const data = JSON.parse(template)
  return await fetch('https://api.brevo.com/v3/smtp/email', {
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
          email: to,
          name: params.name,
        },
      ],
      ...compileTemplate({ data, params }),
    }),
  })
    .then((result) => {
      console.log('Email Sent!')
      return result
    })
    .catch((err) => console.error(err))
}

const compileTemplate = ({ data, params }: any) => {
  let HTML_CONTENT = data.htmlContent
  let SUBJECT = data.subject

  const paramArray = Object.entries(params).map(([key, value]) => {
    return {
      toReplace: `{{params.${key}}}`,
      toPut: value,
    }
  })

  // Iterate through the paramArray and replace placeholders in the HTML
  paramArray.forEach((param) => {
    const { toReplace, toPut } = param
    const regex = new RegExp(
      toReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    )
    HTML_CONTENT = HTML_CONTENT.replace(regex, toPut)
    SUBJECT = SUBJECT.replace(regex, toPut)
  })

  return {
    htmlContent: HTML_CONTENT,
    subject: SUBJECT,
  }
}

export default emailQueue
