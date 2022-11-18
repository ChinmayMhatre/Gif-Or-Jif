import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, where, collection, getDocs } from "firebase/firestore";
import Chip from "@mui/material/Chip";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axios from "axios";

const Post = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { pid } = router.query;
    const [post, setPost] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);

    useEffect(() => {
        console.log(pid);
        if (pid) {
            getPost();
            // downloadImage();
        }
    }, []);

    const getPost = async () => {
        const q = query(collection(db, "posts"), where("pid", "==", pid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setPost(doc.data());
        });
    };

    // const downloadImage = async () => {
    //     const storage = getStorage();
    //     const httpsReference = ref(storage, post.url);
    //     const imageUrl = await getDownloadURL(httpsReference);

    // // use axios to download the image

    // try {
    //     const result = await axios(
    //         {
    //             url: imageUrl,
    //             method: "GET",
    //             responseType: "blob",
    //         }
    //     )
    //     console.log(result);
    //     setDownloadUrl(result.data);
    // } catch (error) {
    //     console.log(error);
    // }

    // }

    return (
        <div className=" my-20">
            {post && (
                <div className="flex justify-center gap-20 px-20  ">
                    <div className="flex-1 justify-center ">
                        <a href={post.url} download="custom.gif" title="image">
                            <img
                                src={post.url}
                                className="w-full object-cover "
                                alt="post"
                            />
                        </a>
                    </div>
                    <div className="flex-1 ">
                        <h1 className="text-6xl my-5 font-bold  text-white ">
                            {post.title}
                        </h1>
                        <h3 className="text-gray-500">created by : username</h3>
                        <div className=" flex gap-2 pt-4 items-center">
                            {post.tags.map((tag) => (
                                <Chip
                                    label={tag}
                                    className="bg-gray-700 text-white mb-10"
                                />
                            ))}
                        </div>
                            <a
                                href={post.url}
                                download="text.gif"
                                className=" px-6 py-4 bg-gray-700 rounded-lg text-white font-bold"
                            >
                                Download
                            </a>
                    </div>
                </div>
            )}

            <h2>Related Gifs</h2>
        </div>
    );
};

export default Post;
