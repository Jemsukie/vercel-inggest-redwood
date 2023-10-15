const { exec } = require('child_process')

exec('node your-function-file.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing cron job: ${error.message}`)
    return
  }

  if (stderr) {
    console.error(`Cron job encountered an error: ${stderr}`)
    return
  }

  console.log(`Cron job executed successfully: ${stdout}`)
})
