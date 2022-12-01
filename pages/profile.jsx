import { auth, db } from "../utils/firebase";
import Head from "next/head";

import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import GifCard from "../components/GifCard";
import Button from "@mui/material/Button";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function Profile() {
    const [isliked, setIsliked] = useState(false);

    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [likedPosts,setLikedPosts] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
        if (user) {
            getUserData();
            getUserPosts();
        }
    }, [user]);

    const getUserData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUserData(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    };

    const getUserPosts = async () => {
        let tempPosts = [];
        try {
            const unsubscribe = await onSnapshot(
                collection(db, "posts"),
                (querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // if (doc.data().user === user.uid) {
                            tempPosts.push({ id: doc.id, ...doc.data() });
                        // }
                    });

                    // liked posts
                    const likedPosts = [];
                    tempPosts.forEach((post) => {
                        if (post.likes.includes(user.uid)) {
                            likedPosts.push(post);
                        }
                    });
                    setLikedPosts(likedPosts);
    
                    // user's post
                    const userPosts = tempPosts.filter((post) => post.user === user.uid);
    
                    setPosts(userPosts);
                    }
                );

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="px-10 md:px-20 lg:px-40">
        <Head>
                <title>GiforJif - {user?.displayName}</title>
                <meta
                    name="description"
                    content="
                        Check out this awesome gif on GiforJif. Share your gifs with the world.
                    "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="py-20 flex gap-10 items-center justify-center">
                <img src={user ? user.photoURL : ""} className="rounded-full" />

                <div className="text-white">
                    <h2 className="text-4xl font-semibold">{userData?.name}</h2>
                    <h2 className="text-md">{userData?.email}</h2>
                    <h2 className="text-md">{userData?.joined}</h2>
                </div>
            </div>
            <div className="">
                <div className="flex justify-between items-center py-10">
                    <h2 className="text-3xl text-white">Your posts</h2>
                    <Button
                        variant="contained"
                        className="bg-gray-800"
                        onClick={() => router.push("/post/new")}
                    >
                        Add New Gif
                    </Button>
                </div>
                <div className="mb-20 lg:columns-4 md:columns-2 columns-1 gap-5">
                    {posts &&
                        posts.map((post) => (
                            /* <Link href={`/post/${post.id}`} key={post.id}> */
                                <GifCard key={post.id} post={post} isliked = {isliked} />
                            /* </Link> */
                        ))}
                </div>
                <div className="text-3xl my-10 text-white">
                    The posts you like
                </div>
                <div className="mb-20 lg:columns-4 md:columns-2 columns-1 gap-5">
                    {likedPosts &&
                        likedPosts.map((post) => (
                            /* <Link href={`/post/${post.id}`} key={post.id}> */
                                <GifCard key={post.id} post={post} isliked = {isliked} />
                            /* </Link> */
                        ))}
                </div>
            </div>
        </div>
    );
}
