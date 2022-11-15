import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="A template for nextjs with tailwindcss" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1 className="text-4xl font-bold text-center">
          Welcome to <a href="https://nextjs.org">Next.js</a>
        </h1>
      </main>

    </div>
  )
}
