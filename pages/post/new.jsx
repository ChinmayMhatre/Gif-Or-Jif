import React from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from "../../utils/firebase";
import { doc, addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { ToastContainer, toast } from "react-toastify";
const { useRouter } = require("next/router");
import "react-toastify/dist/ReactToastify.css";

const New = () => {
    const [user, loading] = useAuthState(auth);

    const [imageUpload, setImageUpload] = useState(null);
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user]);

    const router = useRouter();
    const handleDelete = (tag) => {
        console.info("You clicked the delete icon.");
        const newTags = tags.filter((prevtag) => prevtag != tag);
        setTags(newTags);
    };

    const handleUpload = (e) => {
        if (imageUpload == null || title.trim() == "") {
            toast.error("Please fill all the fields", { theme: "dark" });
            return;
        }
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        setButtonDisabled(true);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref)
                .then((url) => {
                    console.log("uploaded image url", url);
                    const newPost = {
                        title,
                        tags,
                        url,
                        user: user.uid,
                        createdAt: new Date().toISOString(),
                        likes: [],
                        comments: [],
                    };
                    addDoc(collection(db, "posts"), newPost)
                        .then((docRef) => {
                            console.log(
                                "Document written with ID: ",
                                docRef.id
                            );
                            toast.success("Post Created", { theme: "dark" });
                            setTimeout(() => {
                                setButtonDisabled(false);
                                router.push("/profile");
                            }, 1000);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                            toast.error("Error adding document", {
                                theme: "dark",
                            });
                        });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Something went wrong", { theme: "dark" });
                });
        });
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        const value = e.target.value;
        if (!value.trim()) return;
        setTags([...tags, value]);
        setCategory("");
    };

    const [category, setCategory] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    return (
        <div className="px-20 my-10">
            <h2 className="text-white text-4xl text-center">Add a new Gif</h2>
            <div className="my-20 flex flex-col items-start w-[60%] mx-auto">
                <h2 className="text-white text-2xl">Add a Title</h2>

                <input
                    type="text"
                    className="w-full bg-gray-800 text-white rounded-md px-5 py-2 my-5"
                    placeholder="Enter a title"
                    value={title}
                    disabled={buttonDisabled}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <h2 className="text-white text-2xl">Upload your Gif</h2>
                <input
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    accept="image/gif"
                    disabled={buttonDisabled}
                    onChange={(e) => setImageUpload(e.target.files[0])}
                />
                <label htmlFor="raised-button-file">
                    <Button
                        variant="raised"
                        className="text-white bg-gray-800 rounded-md px-5 py-2 my-5"
                        component="span"
                    >
                        Upload
                    </Button>
                </label>

                <h2 className="text-white text-2xl">Add a Tags</h2>

                <div className="input-container my-5 py-4 px-2 gap-2 flex flex-wrap bg-gray-800 rounded-md w-full">
                    {tags.map((tag) => (
                        <Chip
                            label={tag}
                            onDelete={() => handleDelete(tag)}
                            className="bg-gray-700 text-white"
                        />
                    ))}
                    <input
                        type="text"
                        onKeyDown={handleKeyDown}
                        className="text-white bg-gray-800 outline-0 w-full"
                        placeholder="Type here"
                        disabled={buttonDisabled}
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    />
                </div>
                <Button
                    variant="filled"
                    className="text-white border border-white border-1 mt-4 w-[40%] bg-green-600 hover:bg-green-700 transition-all duration-200 self-center"
                    component="span"
                    onClick={handleUpload}
                    disabled={buttonDisabled}
                >
                    Submit
                </Button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default New;
