import { auth, db } from "../utils/firebase";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import GifCard from "../components/GifCard";
import Button from "@mui/material/Button";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

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
        const unsubscribe = await onSnapshot(
            collection(db, "posts"),
            (querySnapshot) => {
                const posts = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().user === user.uid) {
                        posts.push({ id: doc.id, ...doc.data() });
                    }
                });
                setPosts(posts);
            }
        );
    };

    return (
        <div className="px-20">
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
                    <h2 className="text-3xl text-white">My Posts</h2>
                    <Button
                        variant="contained"
                        className="bg-gray-800"
                        onClick={() => router.push("/post/new")}
                    >
                        Add New Gif
                    </Button>
                </div>
                <div className="grid grid-cols-3 justify-center items-center gap-10">
                    {posts &&
                        posts.map((post) => (
                            <GifCard key={post.id} post={post} />
                        ))}
                </div>
            </div>
        </div>
    );
}
