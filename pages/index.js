import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GifCard from "../components/GifCard";
import { db,auth } from "../utils/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {useAuthState} from 'react-firebase-hooks/auth'
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [isliked, setIsliked] = useState(false);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        const getPosts = async () => {
            const unsubscribe = await onSnapshot(
                collection(db, "posts"),
                (querySnapshot) => {
                    const posts = [];
                    querySnapshot.forEach((doc) => {
                        posts.push({ id: doc.id, ...doc.data() });
                    });
                    setPosts(posts);
                    // check if userid present in likes
                    // if yes then set isliked to true
                    // else set isliked to false
                    posts.forEach((post) => {
                        const result = post.likes.find((id) => id === user.uid);
                        if (result) {
                            setIsliked(true);
                        } else {
                            setIsliked(false);
                        }
                    });
                }
            );
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
                    {posts &&
                        posts.map((post) => (
                            <Link href={`/post/${post.pid}`}>
                                <GifCard key={post.id} post={post} isliked={isliked} />
                            </Link>
                        ))}
                </div>
            </main>
        </div>
    );
}
