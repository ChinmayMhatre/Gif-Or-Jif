import React, { useEffect } from "react";
import Head from "next/head";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
    console.log(new Date().toLocaleDateString("en-GB"));
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log(result.user);

            const exists = await getDoc(doc(db, "users", result.user.uid));
            if (!exists.exists()) {
                console.log("created");
                const user = {
                    name: result.user.displayName,
                    email: result.user.email,
                    photoUrl: result.user.photoURL,
                    uid: result.user.uid,
                    joined: new Date().toLocaleDateString("en-GB"),
                };
                await setDoc(doc(db, "users", result.user.uid), user);
            }
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    return (
        <div className="mt-40 mx-auto w-[30%] text-center text-white">
            <Head>
                <title>GiforJif - Login</title>
                <meta
                    name="description"
                    content=" Download and share the best GIFs now. GiforJif is a platform where you can share your favorite gifs with the world. "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h2 className="text-5xl font-medium">Join Today</h2>
            <div className="py-4">
                <h3 className="text-2xlmt-5">
                    Sign in with one of the providers
                </h3>
            </div>
            <div className="flex flex-col mt-5 gap-4">
                <button
                    onClick={signInWithGoogle}
                    className="flex justify-center items-middle gap-4 bg-gray-600 p-4 font-medium rounded-lg"
                >
                    <FcGoogle className="text-2xl" /> Sign in with Google
                </button>
                <button className="flex align-middle justify-center gap-4 bg-gray-600 p-4 font-medium rounded-lg">
                    <FaFacebook className="text-2xl" /> Sign in with Facebook
                </button>
            </div>
        </div>
    );
};

export default Login;
