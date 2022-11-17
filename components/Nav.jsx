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
                    className=" px-20 text-white sticky top-0 z-20"
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                            className="cursor-pointer"
                        >
                            <Link href="/">Gif Or Jif</Link>
                        </Typography>
                        {user && !loading && (
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
                                    <MenuItem onClick={() => handleProfile()}>
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => handleSignOut()}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        )}
                        {!user && !loading && (
                            <Button color="inherit">
                                <Link href="/auth/login">Login</Link>
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
