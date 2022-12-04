import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import GifCard from "../components/GifCard";
import { db, auth } from "../utils/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [isliked, setIsliked] = useState(false);
    const [user, loading] = useAuthState(auth);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const unsubscribe = await onSnapshot(
                    collection(db, "posts"),
                    (querySnapshot) => {
                        const posts = [];
                        querySnapshot.forEach((doc) => {
                            posts.push({ id: doc.id, ...doc.data() });
                        });
                        setPosts(posts);
                        posts.forEach((post) => {
                            const result = post.likes.find(
                                (id) => id === user?.uid
                            );
                            if (result) {
                                setIsliked(true);
                            } else {
                                setIsliked(false);
                            }
                        });
                    }
                );
            } catch (e) {
                console.log(e);
            }
        };
        getPosts();
    }, []);

    return (
        <div className="font-montserrat">
            <Head>
                <title>GiforJif - Home</title>
                <meta
                    name="description"
                    content="Download and share the best GIFs now. GiforJif is a platform where you can share your favorite gifs with the world. "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className=" px-10 md:px-20 lg:px-40 ">
                <div className="my-10">
                    <h1 className="text-4xl font-bold text-center text-white ">
                        All the Gifs
                    </h1>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-medium text-white mt-5">
                            Explore Moods
                        </h2>
                        {showMore ? (
                            <button
                                onClick={() => setShowMore(false)}
                                className="text-white  font-bold text-lg bg-black align-self-center rounded-md px-4 py-2 mt-4"
                            >
                                Show Less
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowMore(true)}
                                className="text-white  font-bold text-lg bg-black align-self-center rounded-md px-4 py-2 mt-4"
                            >
                                Show More
                            </button>
                        )}
                    </div>
                    <div className=" flex justify-center items-center flex-col">
                        <div className="grid grid-cols-5">
                            {showMore
                                ? posts.map((post) => (
                                      <GifCard
                                          key={post.id}
                                          post={post}
                                          isliked={isliked}
                                      />
                                  ))
                                : posts
                                      .slice(0, 5)
                                      .map((post) => (
                                          <GifCard
                                              key={post.id}
                                              post={post}
                                              isliked={isliked}
                                          />
                                      ))}
                        </div>
                        
                    </div>
                </div>
                <div className="lg:columns-4 md:columns-2 columns-1 gap-5 ">
                    {posts &&
                        posts.map((post) => (
                            <GifCard
                                key={post.id}
                                post={post}
                                isliked={isliked}
                            />
                        ))}
                </div>
            </main>
        </div>
    );
}
