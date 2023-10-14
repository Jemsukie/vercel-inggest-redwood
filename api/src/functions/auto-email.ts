// import { Worker } from "bullmq"
// import { CONFIG } from "src/lib/constants"
// import { logger } from "src/lib/logger"

import { emailQueue } from "src/lib/email";

// const axios = require('axios');

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

// worker.on('completed', (job) => {
//   CONFIG.vercel.environment === 'production'
//     ? console.log(`Job ID: ${job.id} is done!`)
//     : logger.info(`Job ID: ${job.id} is done!`)
// })
// worker.on('active', (job) => {
//   CONFIG.vercel.environment === 'production'
//     ? console.log(`Job ID: ${job.id} is running!`)
//     : logger.info(`Job ID: ${job.id} is running!`)
// })
// worker.on('error', (err) => {
//   CONFIG.vercel.environment === 'production'
//     ? console.error(err)
//     : logger.error(err)
// })

// worker.on('failed', (job, err) => {
//   CONFIG.vercel.environment === 'production'
//     ? console.error(`${job?.id} has failed with ${err.message}`)
//     : logger.error(`${job?.id} has failed with ${err.message}`)
// })
// worker.on('drained', () => {
//   CONFIG.vercel.environment === 'production'
//     ? console.log(`No more jobs`)
//     : logger.info(`No more jobs`)

//     worker.close()
// })

// export const emailProcess = async () => {
//   try {
//     const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
//       sender: {
//         name: `"Atlas Admin" <${CONFIG.brevo.senderEmail}>`,
//         email: CONFIG.brevo.tempSenderEmail,
//       },
//       to: [
//         {
//           email: 'jemuel.lupo@gmail.com',
//           name: 'Dev Testing',
//         },
//       ],
//       htmlContent: 'Hello, this is testing',
//       subject: 'Testing this part',
//     }, {
//       headers: {
//         'accept': 'application/json',
//         'api-key': CONFIG.brevo.apiKey,
//       },
//     });

//     // Handle the response here if needed
//     console.log('Email sent:', response.data);
//   } catch (error) {
//     // Handle errors here
//     console.error('Error sending email:', error);
//   }
// };


emailQueue.addListener('waiting', (job) => {
  console.log(`Job ${job.id} is waiting`)
})
