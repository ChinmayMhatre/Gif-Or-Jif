import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GifCard from "../components/GifCard";
import {db} from '../utils/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const unsubscribe = await onSnapshot(collection(db, "posts"), (querySnapshot) => {
                const posts = [];
                querySnapshot.forEach((doc) => {
                    posts.push({id: doc.id, ...doc.data()});
                });
                setPosts(posts);
            });
        };
        getPosts();
    }, []);


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
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-center items-center gap-10">
                 {
                    posts && posts.map((post) => (
                        <GifCard key={post.id} post={post} />
                    ))
                 }
                </div>
            </main>
        </div>
    );
}
