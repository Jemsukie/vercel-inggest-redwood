import type { APIGatewayEvent, Context } from 'aws-lambda'
import { emailQueue } from 'src/lib/email'
import { logger } from 'src/lib/logger'
import { emailProcess } from '../auto-email'

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
  logger.info('Invoked hello function')

  console.log('HELLO WORLD')
  logger.info('HELLO WORLD')

  const jobs = await emailQueue.getJobs()

  console.log('--this is jobs', jobs)

  await Promise.all(
    jobs.map(_j => {
      emailProcess()
    })
  ).then(_p => console.log('All jobs done')).catch(e => console.error(e.message))


  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'hello function',
    }),
  }
}
