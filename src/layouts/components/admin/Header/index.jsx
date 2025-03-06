import classNames from "classnames/bind";
import style from "./Header.module.css";
import logo from "./../../../../assets/images/logo.png";
import avatar from "./../../../../assets/images/messiprimergol.jpg";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Grid } from "@mui/material";
import { useState } from "react";
const cn = classNames.bind(style);

export default function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            {/* Main panel */}
            <div className={cn("main-header", "row")}>
                <nav className={cn("nav")}>
                    <div className={cn("container-fluid")}>
                        <ul className={cn("navbar-nav", "navbar-right", "row")}>
                            <li className={cn("nav-item", "account", "col-2", "offset-10")}>
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <div className={cn("inner-account")}>
                                            <img className={cn("avatar")} src={avatar} alt="" />
                                            <div className={cn("username")}>
                                                <span>Hi, </span>
                                                <span className={cn("name")}>Phi Au</span>
                                            </div>
                                        </div>
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                        className={cn("user-menu")}
                                    >
                                        <MenuItem
                                            sx={{ p: 2 }}
                                            onClick={handleClose} className={cn("menu-item")}>

                                            <Grid container spacing={1}>
                                                <Grid item xs={5}>
                                                    <Avatar
                                                     variant="rounded" src={avatar}
                                                     sx={{ width: 56, height: 56 }}
                                                     >
                                                    </Avatar>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <div className={cn("info")}>
                                                        <h5 className={cn("name")}>Phi Au</h5>
                                                        <Button size="small" variant="contained" color="success">
                                                            Xem tài khoản
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ p: 1 }}
                                            onClick={handleClose}
                                            className={cn("user-box-item")}
                                        >
                                            <span>
                                                Logout
                                            </span>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

        </>
    )
}

