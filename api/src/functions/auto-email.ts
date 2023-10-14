
import { logger } from 'src/lib/logger'

setInterval(() => {
  process.env.VERCEL_ENV === 'production'
    ? console.log('--running every 15 seconds')
    : logger.info('--running every 15 seconds')
}, 15000)
