import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { Queue } from 'bullmq'
import { CONFIG } from 'src/lib/constants'
import { emailQueue } from 'src/lib/email'
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
export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked createQueue function')
  console.log('Invoked createQueue function')

  await emailQueue.add(
    'email',
    {
      tribeId: '1',
      email: 'jemuel.lupo@gmail.com',
      name: 'Jemuel Lupo',
      tempPassword: 'Password123!',
      batch: 'Batch  1',
      origin: 'www.google.com',
    },
    {
      attempts: 5,
      // removeOnComplete: true,
      priority: 1,
    }
  )

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
