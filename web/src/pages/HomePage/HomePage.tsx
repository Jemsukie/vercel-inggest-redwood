import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>
      <button onClick={async() => {
        await fetch(`${process.env.WEB_API_URL || '/.redwood/functions'}/create-queue`,
          {
            mode: 'no-cors'
          }
        ).then(async(_result) => {

          await fetch(`${process.env.WEB_API_URL || '/.redwood/functions'}/process-queue`,
          {
            mode: 'no-cors'
          }
        )


        })

      }}>Call function</button>
    </>
  )
}

export default HomePage