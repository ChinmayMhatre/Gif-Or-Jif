import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const GifCard = () => {
    return (
        <Card className=" ">
            <CardMedia
                component="img"
                height="140"
                image="https://images.pexels.com/photos/462402/pexels-photo-462402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="green iguana"
            />
            <CardContent className="bg-gray-800 text-white">
                <Typography variant="h5" component="div">
                    Lizard
                </Typography>
                <div className=" flex gap-2 pt-4 items-center">
                    <Chip label="Basic" className="bg-gray-700 text-white" />
                    <Chip label="Basic" className="bg-gray-700 text-white" />
                    <Chip label="Basic" className="bg-gray-700 text-white" />
                </div>
            </CardContent>
        </Card>
    );
};

export default GifCard;
