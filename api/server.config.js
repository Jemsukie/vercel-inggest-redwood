/**
 * This file allows you to configure the Fastify Server settings
 * used by the RedwoodJS dev server.
 *
 * It also applies when running RedwoodJS with `yarn rw serve`.
 *
 * For the Fastify server options that you can set, see:
 * https://www.fastify.io/docs/latest/Reference/Server/#factory
 *
 * Examples include: logger settings, timeouts, maximum payload limits, and more.
 *
 * Note: This configuration does not apply in a serverless deploy.
 */

const { Worker } = require('bullmq')
const dotenv = require('dotenv')

/** @type {import('fastify').FastifyServerOptions} */
const config = {
  requestTimeout: 15_000,
  logger: {
    // Note: If running locally using `yarn rw serve` you may want to adust
    // the default non-development level to `info`
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  },
}

/**
 * You can also register Fastify plugins and additional routes for the API and Web sides
 * in the configureFastify function.
 *
 * This function has access to the Fastify instance and options, such as the side
 * (web, api, or proxy) that is being configured and other settings like the apiRootPath
 * of the functions endpoint.
 *
 * Note: This configuration does not apply in a serverless deploy.
 */

/** @type {import('@redwoodjs/api-server/dist/fastify').FastifySideConfigFn} */
const configureFastify = async (fastify, options) => {
  if (options.side === 'api') {
    fastify.log.info({ custom: { options } }, 'Configuring api side')
    dotenv.config()
    console.log('process.env.JOB_QUEUE_HOST')

    const worker = new Worker(
      'email',
      async (job) => {
        const { id, data } = job

        console.log(`${new Date()} - Job ID: ${id} is being processed!`)

        console.log('--this is data', data)
      },
      {
        removeOnComplete: {
          age: 1,
          count: 0,
        },
        lockDuration: 3600000,
        connection: {
          host: process.env.JOB_QUEUE_HOST || '127.0.0.1',
          port: parseInt(process.env.JOB_QUEUE_PORT || '6379'),
          username: process.env.JOB_QUEUE_USERNAME || '',
          password: process.env.JOB_QUEUE_PASSWORD || '',
        },
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
      console.error(`${new Date()} - ${job?.id} has failed with ${err}`)
    })
    worker.on('drained', async () => {
      console.log(`${new Date()} - No more jobs`)
    })
  }

  if (options.side === 'web') {
    fastify.log.info({ custom: { options } }, 'Configuring web side')
  }

  return fastify
}

module.exports = {
  config,
  configureFastify,
}
