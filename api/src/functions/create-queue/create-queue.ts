import type { APIGatewayEvent, Context } from 'aws-lambda'

// import { Queue, Worker } from 'bullmq'

import { CONFIG } from 'src/lib/constants'
import emailQueue, { worker } from 'src/lib/email'
import { logger } from 'src/lib/logger'

const axios = require('axios')
/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  logger.info('Invoked createQueue function')
  console.log('Invoked createQueue function')

  const data = {
    name: 'email',
    data: {
      tribeId: '1',
      email: 'jemuel.lupo@gmail.com',
      name: 'Jemuel Lupo',
      tempPassword: 'Password123!',
      batch: 'Batch  1',
      origin: 'www.google.com',
    },
    opts: {
      removeOnComplete: true,
    },
  }

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
    console.error(`${new Date()} - ${job?.id} has failed with ${err}`)
  })
  worker.on('drained', async () => {
    console.log(`${new Date()} - No more jobs`)
  })

  await emailQueue.addBulk([data])

  // .then(async (_r) => {
  // await emailQueue.process('email', async (job, done) => {
  //   console.log(`Job ${job.id} is now processing!`)
  //   await emailProcess().then((_r) => {
  //     console.log(`Job ${job.id} is now finished!`)
  //     done()
  //   })
  // })

  // await emailQueue.on('waiting', (jobId) => {
  //   console.log(`Job ${jobId} is now in waiting list!`)
  // })

  // await emailQueue.on('active', (job) => {
  //   console.log(`Job ${job.id} is now in active!`)
  // })

  //   // await emailQueue
  //   //   .getJobs(['delayed', 'waiting', 'active'])
  //   //   .then(async (jobs) => {
  //   //     let i = 0

  //   //     while (i < jobs.length) {
  //   //       await emailProcess().then(async (_r) => {
  //   //         console.log(`Process ${jobs[i].id} Done!`)
  //   //         await jobs[i].takeLock()
  //   //         await jobs[i].moveToCompleted('Successfully completed!', true)
  //   //         await jobs[i].releaseLock()
  //   //         await jobs[i].remove()
  //   //       })
  //   //       await i++
  //   //     }
  //   //   })
  // })
  // .then(async(_queue) => {
  //   const worker = await new Worker(
  //     'email',
  //     async (job) => {
  //       const { id, data } = job

  //       CONFIG.vercel.environment === 'production'
  //         ? console.log(`Job ID: ${id} is being processed!`)
  //         : logger.info(`Job ID: ${id} is being processed!`)

  //       await emailProcess()
  //     },
  //     {
  //       lockDuration: 30000,
  //       connection: CONFIG.redis.jobQueueConnection,
  //     }
  //   )

  //   await worker.on('completed', (job) => {
  //     CONFIG.vercel.environment === 'production'
  //       ? console.log(`Job ID: ${job.id} is done!`)
  //       : logger.info(`Job ID: ${job.id} is done!`)
  //   })
  //   await worker.on('active', (job) => {
  //     CONFIG.vercel.environment === 'production'
  //       ? console.log(`Job ID: ${job.id} is running!`)
  //       : logger.info(`Job ID: ${job.id} is running!`)
  //   })
  //   await worker.on('error', (err) => {
  //     CONFIG.vercel.environment === 'production'
  //       ? console.error(err)
  //       : logger.error(err)
  //   })

  //   await worker.on('failed', (job, err) => {
  //     CONFIG.vercel.environment === 'production'
  //       ? console.error(`${job?.id} has failed with ${err.message}`)
  //       : logger.error(`${job?.id} has failed with ${err.message}`)
  //   })
  //   await worker.on('drained', async() => {
  //     CONFIG.vercel.environment === 'production'
  //       ? console.log(`No more jobs`)
  //       : logger.info(`No more jobs`)

  //       await worker.close()
  //   })
  // })

  // await processEmails()
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'createQueue function',
    }),
  }
}

const _processEmails = async () => {
  console.log(`Let's run processEmails queue`)

  await emailQueue.process('email', async (job, done) => {
    console.log(`Job ${job.id} is now processing!`)
    emailProcess().then((_r) => {
      console.log(`Job ${job.id} is now finished!`)
      done()
    })
  })

  await emailQueue.on('waiting', (jobId) => {
    console.log(`Job ${jobId} is now in waiting list!`)
  })

  await emailQueue.on('active', (job) => {
    console.log(`Job ${job.id} is now in active!`)
  })
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
