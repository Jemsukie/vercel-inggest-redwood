import worker from '../index.mjs'

worker.on('completed', (job) => {
  console.log(`Job ID: ${job.id} is done!`)
})
worker.on('active', (job) => {
  console.log(`Job ID: ${job.id} is running!`)
})
worker.on('error', (err) => {
  console.error(err)
})

worker.on('failed', (job, err) => {
  console.error(`${job?.id} has failed with ${err.message}`)
})
worker.on('drained', () => {
  console.log(`No more jobs`)
})
