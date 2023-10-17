// server.js
import express from 'express'

import { emailQueue } from './api/bull.mjs'

const app = express()

// set up app stuff
// process the queue'd jobs
emailQueue.process(async (job, done) => {
  console.log(job.data)
  console.log('Job Running!')
  done()
})

export default app
