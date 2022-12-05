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
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isliked, setIsliked] = useState(false);
    const [user, loading] = useAuthState(auth);
    const [showMore, setShowMore] = useState(false);
    const [tags, setTags] = useState({});
    const [selectedTag, setSelectedTag] = useState("All");

    const filterByTag = (tag) => {
        if (tag === "All") {
            setSelectedTag(tag);
            setFilteredPosts(posts);
            return;
        }
        const filteredPosts = posts.filter((post) => post.tags.includes(tag));
        setSelectedTag(tag);
        setFilteredPosts(filteredPosts);
    };

    const getTags = () => {
        const tags = {};
        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                if (tags[tag]) {
                    tags[tag] += 1;
                } else {
                    tags[tag] = 1;
                }
            });
        });
        tags["All"] = posts.length;
        const sortable = Object.fromEntries(
            Object.entries(tags).sort(([, a], [, b]) => b - a)
        );
        setSelectedTag("All");

        setTags(sortable);
    };

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

    useEffect(() => {
        setFilteredPosts(posts);
        getTags();
    }, [posts]);

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
                    <div className="flex justify-between items-center my-7">
                        <h2 className="md:text-2xl text-xl font-medium text-white ">
                            Explore Tags
                        </h2>
                        {showMore ? (
                            <button
                                onClick={() => setShowMore(false)}
                                className=" font-medium text-lg text-gray-300  align-self-center rounded-md"
                            >
                                Show Less -
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowMore(true)}
                                className="text-white text-lg align-self-center rounded-md  "
                            >
                                Show More +
                            </button>
                        )}
                    </div>
                    <div className=" flex justify-center items-center flex-col">
                        <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 gap-5 ">
                            {showMore
                                ? Object.keys(tags).map((tag) => (
                                      <button
                                          onClick={() => filterByTag(tag)}
                                          className={`${
                                              selectedTag == tag
                                                  ? "text-black bg-white"
                                                  : "text-white"
                                          }  font-bold text-md border-2 border-white align-self-center transition-all duration-150 rounded-full px-4 py-2 mt-2`}
                                      >
                                          {tag}
                                      </button>
                                  ))
                                : Object.keys(tags)
                                      .slice(0, 5)
                                      .map((tag) => (
                                          <button
                                              onClick={() => filterByTag(tag)}
                                              className={`${
                                                  selectedTag == tag
                                                      ? "text-black bg-white"
                                                      : "text-white"
                                              }  font-bold text-md border-2 border-white transition-all duration-150 align-self-center rounded-lg px-4 py-2 mt-2`}
                                          >
                                              {tag}
                                              <div className="text-gray-600">
                                                  {tags[tag]} Posts
                                              </div>
                                          </button>
                                      ))}
                        </div>
                    </div>
                </div>
                <div className="lg:columns-4 md:columns-2 columns-1 gap-5 ">
                    {filteredPosts &&
                        filteredPosts.map((post) => (
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
