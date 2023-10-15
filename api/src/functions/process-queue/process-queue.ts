import type { APIGatewayEvent, Context } from 'aws-lambda'
// import { Worker } from 'bullmq'

import { CONFIG } from 'src/lib/constants'
import emailQueue from 'src/lib/email'
import { logger } from 'src/lib/logger'

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
  logger.info('Invoked processQueue function')

  await addQueue()

  // const worker = new Worker(
  //   'email',
  //   async (job) => {
  //     const { id } = job

  //     CONFIG.vercel.environment === 'production'
  //       ? console.log(`Job ID: ${id} is being processed!`)
  //       : logger.info(`Job ID: ${id} is being processed!`)

  //     await emailProcess()
  //   },
  //   {
  //     // removeOnComplete: {
  //     //   age: 1,
  //     //   count: 0,
  //     // },
  //     lockDuration: 30000,
  //     connection: CONFIG.redis.jobQueueConnection,
  //   }
  // )

  // await worker.on('completed', (job) => {
  //   CONFIG.vercel.environment === 'production'
  //     ? console.log(`Job ID: ${job.id} is done!`)
  //     : logger.info(`Job ID: ${job.id} is done!`)
  // })
  // await worker.on('active', (job) => {
  //   CONFIG.vercel.environment === 'production'
  //     ? console.log(`Job ID: ${job.id} is running!`)
  //     : logger.info(`Job ID: ${job.id} is running!`)
  // })
  // await worker.on('error', (err) => {
  //   CONFIG.vercel.environment === 'production'
  //     ? console.error(err)
  //     : logger.error(err)
  // })

  // await worker.on('failed', (job, err) => {
  //   CONFIG.vercel.environment === 'production'
  //     ? console.error(`${job?.id} has failed with ${err.message}`)
  //     : logger.error(`${job?.id} has failed with ${err.message}`)
  // })
  // await worker.on('drained', async () => {
  //   CONFIG.vercel.environment === 'production'
  //     ? console.log(`No more jobs`)
  //     : logger.info(`No more jobs`)

  //   await worker.close()
  // })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'processQueue function',
    }),
  }
}

const _emailProcess = async () => {
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

const addQueue = async () => {
  await emailQueue.addBulk([
    {
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
    },
    {
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
    },
    {
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
    },
  ])
}
