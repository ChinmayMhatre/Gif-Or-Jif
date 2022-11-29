import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Link from "next/link";
import {useRouter}  from "next/router";

const GifCard = ({ post, isliked }) => {
    const router = useRouter();
    return (
        <div className=" relative group rounded-lg overflow-hidden mt-5" onClick={() => router.push(`/post/${post.id}`)}
        >
            {/* <Link href={`/post/${post.pid}`}> */}
                <div className="absolute bg-black z-10 group-hover:opacity-50 rounded-lg h-full w-full opacity-0 transition-all duration-100"></div>
                <div className="absolute top-0 left-0 right-0 z-20 group-hover:opacity-100  transition-all duration-100 opacity-0 p-4">
                    <div className="flex items-center">
                        {isliked ? (
                            <FavoriteIcon className="text-red-500" />
                        ) : (
                            <FavoriteBorderIcon className="text-white" />
                        )}
                        <p className="text-white pl-1">{post.likes.length}</p>
                    </div>
                </div>
                <img
                    src={post?.url}
                    className="rounded-lg group-hover:scale-110 transition-all duration-100 ease-in-out  w-full object-cover"
                    alt="card image"
                />
                <div className="bg-none z-20 absolute opacity-0 group-hover:opacity-100 transition-all duration-100 bottom-0 text-white p-4 ">
                    <h5 className="text-white text-2xl">{post.title}</h5>
                    <h3 className="text-gray-300">
                        created by : {post.userName}
                    </h3>
                    <div className=" flex gap-2 pt-2 items-center">
                        {post.tags.map((tag) => (
                            <div
                                className="bg-gray-700 rounded-xl text-sm px-2 py-1 text-white"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            {/* </Link> */}
        </div>
    );
};

export default GifCard;
