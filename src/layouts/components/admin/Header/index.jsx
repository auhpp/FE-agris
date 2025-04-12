import classNames from "classnames/bind";
import style from "./Header.module.css";
import logo from "./../../../../assets/images/logo.png";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Grid } from "@mui/material";
import { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
const cn = classNames.bind(style);

export default function Header() {

    return (
        <>
            <header className={cn("sticky-top", "p-2", "mb-3", "border-bottom", "bg-white ", "header")}>
                <div className="dropdown text-end offset-10">
                    <div
                        className={cn(" link-body-emphasis", "text-decoration-none", "btn-profile")}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >

                        <Avatar
                            alt="Remy Sharp"
                            src="https://github.com/mdo.png"
                            sx={{ width: 40, height: 40 }}
                        />
                        <button
                            className="btn-5"
                        >Hồ Phan Phi Âu</button>
                    </div>
                    <ul className="dropdown-menu text-small">
                        <li>
                            <a className="dropdown-item" href="#">
                                <PersonIcon className="me-1" />
                                <span>
                                    Tài khoản
                                </span>
                            </a>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <LogoutIcon className="me-1" />
                                <span>
                                    Đăng xuất
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </header>

        </>
    )
}

