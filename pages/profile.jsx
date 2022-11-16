import { auth } from "../utils/firebase";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import GifCard from "../components/GifCard";
import Button from '@mui/material/Button';

export default function Profile() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user]);

    return (
        <div className="px-20">
            <div className="py-20 flex gap-10 items-center justify-center">
                <Avatar sx={{ bgcolor: deepOrange[500] , width:"200px",height:"200px"}}>N</Avatar>
                <div className="text-white">
                    <h2 className="text-6xl font-semibold">user name</h2>
                    <h2 className="text-lg">Date of joining</h2>
                </div>
            </div>
            <div className="">

            <div className="flex justify-between items-center py-10">
                <h2 className="text-3xl text-white">My Posts</h2>
                <Button variant="contained" className="bg-gray-800" onClick={()=>router.push('/post/new')}>
                Add New Gif
                </Button>

            </div>
            <div className="grid grid-cols-3 justify-center items-center gap-10">
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                    <GifCard/>
                </div>
            </div>
        </div>
    );
}
