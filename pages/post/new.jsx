import React from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useState } from "react";

const New = () => {
    const [tags, setTags] = useState([]);
    const handleDelete = (tag) => {
        console.info("You clicked the delete icon.");
        const newTags = tags.filter((prevtag) => prevtag != tag);
        setTags(newTags);
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        const value = e.target.value;
        if (!value.trim()) return;
        setTags([...tags, value]);
        setCategory("");
    };

    const [category, setCategory] = useState("");

    return (
        <div className="px-20 my-10">
            <h2 className="text-white text-4xl text-center">Add a new Gif</h2>
            <div className="my-20 flex flex-col items-center justify-center">
                <input
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                />
                <label htmlFor="raised-button-file">
                    <Button
                        variant="raised"
                        className="text-white border border-white border-1"
                        component="span"
                    >
                        Upload
                    </Button>
                </label>

                <div className="input-container my-10 py-4 px-2 gap-2 flex flex-wrap border-white border-1 border w-[50%] ">
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
                        className="text-white bg-gray-900 outline-0"
                        placeholder="Type here"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    />
                </div>
                <Button
                    variant="filled"
                    className="text-white border border-white border-1"
                    component="span"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default New;
