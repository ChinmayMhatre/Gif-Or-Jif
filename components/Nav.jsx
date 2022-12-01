import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "../utils/firebase";

const Nav = ({ children }) => {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "rgb(31 41 55 )",
            },
        },
    });

    const router = useRouter();

    const [user, loading] = useAuthState(auth);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose();
        router.push("/profile");
    };

    const handleSignOut = () => {
        auth.signOut();
        handleClose();
        router.push("/");
    };

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <AppBar
                    position="static"
                    color="primary"
                    enableColorOnDark
                    className=" px-10 md:px-20 lg:px-40 text-white sticky top-0 z-50"
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                            className="cursor-pointer"
                        >
                            <Link href="/" className="text-white">
                                Gif Or Jif
                            </Link>
                        </Typography>
                        {user && !loading && (
                            <>
                                <div className="bg-gray-600 mr-2 my-4 cursor-pointer text-lg rounded-lg font-semibold py-2 px-4 ">
                                    <Link
                                        href="/post/new"
                                        className="text-white"
                                    >
                                        Upload
                                    </Link>
                                </div>
                                <div>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={handleMenu}
                                    >
                                        <img
                                            src={user.photoURL}
                                            alt="avatar"
                                            className="rounded-full h-10 w-10"
                                            reffererpolicy="no-referrer"
                                        />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem
                                            onClick={() => handleProfile()}
                                        >
                                            Profile
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleSignOut()}
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </>
                        )}
                        {!user && !loading && (
                            <Button>
                                <Link href="/auth/login" className="bg-gray-600 mr-2 my-1 cursor-pointer rounded-lg font-semibold py-2 px-4 text-white">Login</Link>
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
            {children}
        </>
    );
};

export default Nav;
