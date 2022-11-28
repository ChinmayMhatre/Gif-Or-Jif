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
            try{
                const unsubscribe = await onSnapshot(
                    collection(db, "posts"),
                    (querySnapshot) => {
                        const posts = [];
                        querySnapshot.forEach((doc) => {
                            posts.push({ id: doc.id, ...doc.data() });
                        });
                        setPosts(posts);
                        posts.forEach((post) => {
                            const result = post.likes.find((id) => id === user?.uid);
                            if (result) {
                                setIsliked(true);
                            } else {
                                setIsliked(false);
                            }
                        });
                    }
                );
            } catch(e){
                console.log(e);
            }
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
                <div className="lg:columns-3 md:columns-2 columns-1 gap-10 ">
                    {posts &&
                        posts.map((post) => (
                                <GifCard key={post.id} post={post} isliked={isliked} />
                        ))}
                </div>
            </main>
        </div>
    );
}
