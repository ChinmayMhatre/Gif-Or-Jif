import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GifCard from "../components/GifCard";


export default function Home() {
  const numberArray = Array.from(Array(100).keys());
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="A template for nextjs with tailwindcss"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="px-20">
                <h1 className="text-4xl font-bold text-center text-white my-10">
                    All the Gifs
                </h1>
                <div className="grid grid-cols-3 justify-center items-center gap-10">
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                </div>
            </main>
        </div>
    );
}
