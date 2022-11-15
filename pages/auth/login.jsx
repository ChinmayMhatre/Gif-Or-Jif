import React,{useEffect} from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {auth} from "../../utils/firebase"; 
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
const Login = () => {
    const [user,loading] = useAuthState(auth)
    const router = useRouter();
    const googleProvider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log(result);
            router.push("/");            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user){
            console.log(user);
            router.push("/");
        }
    }, [user])


    return (
        <div className="mt-40 mx-auto w-[30%] text-center text-white">
            <h2 className="text-5xl font-medium">Join Today</h2>
            <div className="py-4">
                <h3
                    className="text-2xlmt-5" >
                    Sign in with one of the providers
                </h3>
            </div>
            <div className="flex flex-col mt-5 gap-4">
                <button onClick={signInWithGoogle} className="flex justify-center items-middle gap-4 bg-gray-600 p-4 font-medium rounded-lg">
                    <FcGoogle className="text-2xl" /> Sign in with Google
                </button>
                <button className="flex align-middle justify-center gap-4 bg-gray-600 p-4 font-medium rounded-lg">
                    <FaFacebook className="text-2xl"/> Sign in with Facebook
                </button>
            </div>
        </div>
    );
};

export default Login;