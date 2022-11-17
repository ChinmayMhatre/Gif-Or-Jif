import { auth, db } from "../utils/firebase";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import GifCard from "../components/GifCard";
import Button from "@mui/material/Button";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
        if (user) {
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
            getUserData();
        }
    }, [user]);

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
                    <GifCard />
                    <GifCard />
                    <GifCard />
                    <GifCard />
                    <GifCard />
                    <GifCard />
                </div>
            </div>
        </div>
    );
}
