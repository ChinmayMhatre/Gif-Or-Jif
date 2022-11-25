import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    query,
    where,
    collection,
    getDoc,
    setDoc,
    doc,
} from "firebase/firestore";
import Chip from "@mui/material/Chip";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AiOutlineLoading3Quarters from "@mui/icons-material/";
import { BeatLoader } from "react-spinners";

export async function getServerSideProps(context) {
    return {
        props: {},
    };
}

const Post = () => {
    const [user, loading] = useAuthState(auth);
    const [isliked, setIsliked] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);
    const handleLike = async () => {
        try {
            setLoadingLike(true);
            const postRef = doc(db, "posts", router.query.pid);
            const postDoc = await getDoc(postRef);
            const post = postDoc.data();
            const liked = post.likes.find((like) => like == user.uid);
            if (liked) {
                const newLikes = post.likes.filter((like) => like != user.uid);
                await setDoc(postRef, { likes: newLikes }, { merge: true });
                setIsliked(false);
            } else {
                await setDoc(
                    postRef,
                    { likes: [...post.likes, user.uid] },
                    { merge: true }
                );
                setIsliked(true);
            }
            setLoadingLike(false);
        } catch (error) {
            console.log(error);
            setLoadingLike(false);
        }
    };

    const router = useRouter();
    const { pid } = router.query;
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (pid) {
            getPost();
        }
    }, []);

    const getPost = async () => {
        const querySnapshot = await getDoc(doc(db, "posts", pid));
        setPost(querySnapshot.data());
        if (querySnapshot.data().likes.find((like) => like == user?.uid)) {
            setIsliked(true);
        }
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
                        <h3 className="text-gray-500">
                            created by : {post.userName}
                        </h3>
                        <div className=" flex gap-2 pt-4 items-center">
                            {post.tags.map((tag) => (
                                <Chip
                                    label={tag}
                                    className="bg-gray-700 text-white mb-10"
                                />
                            ))}
                        </div>

                        <div className=" flex gap-4 items-start">
                            {user && (
                                <button
                                    onClick={handleLike}
                                    className="bg-gray-700 px-6 py-4 rounded-lg fount-bold text-white mb-10 hover:bg-gray-800 transition-all duration-200"
                                >
                                    {loadingLike ? (
                                        <BeatLoader color="white" size={10} />
                                    ) : isliked ? (
                                        <>
                                            <FavoriteIcon className="text-red-500 mr-2" />
                                            Liked
                                        </>
                                    ) : (
                                        <>
                                            <FavoriteBorderIcon className="text-red-500 mr-2" />
                                            Like
                                        </>
                                    )}
                                </button>
                            )}
                            <a
                                href={post.url}
                                download="text.gif"
                                className=" px-6 py-4 bg-gray-700 rounded-lg text-white font-bold"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
            <div className=" px-20 py-10">
                <h2 className="text-4xl text-white font-semibold">
                    Related Gifs
                </h2>
            </div>
        </div>
    );
};

export default Post;
