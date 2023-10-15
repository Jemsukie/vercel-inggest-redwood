import cron from 'node-cron'

cron.schedule('* * * * *', async () => {
  // This will run minute
  try {
    // Get users whose expiry date has passed
    console.log('--Running every minute', new Date().getTime())
  } catch (error) {
    console.error('Error unenrolling expired members:', error)
  }
})
