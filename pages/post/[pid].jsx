import { useEffect, useState } from "react";
import Head from "next/head";
import {
    //deleteicon
    FaTrash,
} from "react-icons/fa";

import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    query,
    where,
    collection,
    getDoc,
    setDoc,
    getDocs,
    deleteDoc,
    doc,
} from "firebase/firestore";
import GifCard from "../../components/GifCard";
import { getStorage, ref, deleteObject } from "firebase/storage";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AiOutlineLoading3Quarters from "@mui/icons-material/";
import { BeatLoader } from "react-spinners";

const Post = () => {
    const [user, loading] = useAuthState(auth);
    const [isliked, setIsliked] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState([]);
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
        if (router.isReady) {
            getPost();
            getRelatedPosts();
        }
    }, [router.isReady]);

    const getPost = async () => {
        const querySnapshot = await getDoc(doc(db, "posts", pid));
        setPost(querySnapshot.data());
        if (querySnapshot.data().likes.find((like) => like == user?.uid)) {
            setIsliked(true);
        }
    };

    const getRelatedPosts = async () => {
        // get post with same tag

        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts = querySnapshot.docs.map((doc) => doc.data());

        const filteredPosts = posts.filter((post) => post.pid != pid);

        const relatedPosts = filteredPosts.filter((p) =>
            p.tags.includes(post?.tags[0])
        );

        setRelatedPosts(relatedPosts);
        console.log(relatedPosts);
    };

    const deletePost = async () => {
        //confirm if the user wants to delete the post
        const confirm = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (confirm) {
            console.log(user);
            if (user.uid == post.user) {
                //get the storage ref using the url
                const storage = getStorage();
                const httpRef = ref(storage, post.url);
                //delete the file
                await deleteObject(httpRef);
                //delete the post
                await deleteDoc(doc(db, "posts", pid));
                router.push("/");
            }
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
        <div className=" my-20 px-10 md:px-20 lg:px-60">
            <Head>
                <title>GiforJif - {post?.title}</title>
                <meta
                    name="description"
                    content="
                        Check out this awesome gif on GiforJif. Share your gifs with the world.
                    "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {post && (
                <div className="flex justify-center flex-col md:flex-row gap-20 ">
                    <div className="flex-1 justify-center ">
                        <a href={post.url} download="custom.gif" title="image">
                            <img
                                src={post.url}
                                className="w-full object-cover "
                                alt="post"
                            />
                        </a>
                    </div>
                    <div className="flex-1 relative">
                        <h1 className="text-6xl my-5 font-bold  text-white ">
                            {post.title}
                        </h1>
                        <button
                            onClick={deletePost}
                            className=" text-center px-6 py-4 absolute top-7 right-0 rounded-lg text-white font-bold"
                        >
                            <FaTrash className="text-2xl" />
                        </button>
                        <h3 className="text-gray-500">
                            created by : {post.userName}
                        </h3>
                        <div className=" flex gap-2 pt-4 items-center">
                            {post.tags.map((tag) => (
                                <div className="bg-gray-700 rounded-xl text-sm px-2 py-1 mb-5 text-white">
                                    {tag}
                                </div>
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
            <div className=" py-20">
                <h2 className="text-4xl text-white font-semibold">
                    Related Gifs
                </h2>
                {relatedPosts && (
                    <div className="lg:columns-3 md:columns-2 columns-1 mt-10 gap-5">
                        {relatedPosts.map((post) => (
                            <GifCard post={post} />
                        ))}
                    </div>
                )}
                {relatedPosts.length == 0 && (
                    <h3 className="text-white text-2xl font-semibold">
                        No related gifs found
                    </h3>
                )}
            </div>
        </div>
    );
};

export default Post;
