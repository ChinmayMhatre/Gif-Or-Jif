import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const GifCard = ({post}) => {
    return (
        <Card className=" ">
            <CardMedia
                component="img"
                height="140"
                image={post?.url}
                className=" max-h-60 object-cover "
                alt="green iguana"
            />
            <CardContent className="bg-gray-800 text-white max-h-36">
                <Typography variant="h5" component="div">
                    {post.title}
                </Typography>
                <h3 className="text-gray-500">
                    created by : username
                </h3>
                <div className=" flex gap-2 pt-4 items-center">
                    {post.tags.map((tag) => (
                        <Chip label={tag} className="bg-gray-700 text-white" />
                    ))}

                </div>
            </CardContent>
        </Card>
    );
};

export default GifCard;
