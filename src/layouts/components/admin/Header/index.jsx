import classNames from "classnames/bind";
import style from "./Header.module.css";
import logo from "./../../../../assets/images/logo.png";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Chip, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { getStaffInfo } from "../../../../services/staffService";
const cn = classNames.bind(style);

export default function Header() {
    const [user, setUser] = useState()
    useEffect(
        () => {
            getStaffInfo().then(
                data => {
                    console.log("us", data)
                    setUser(data.result)
                }
            )
        }, []
    )
    return (
        <>
            <header className={cn("sticky-top", "p-2", "mb-3", "border-bottom", "bg-white ", "header")}>
                <div className="dropdown d-flex justify-content-end">
                    <div
                        className={cn(" link-body-emphasis", "text-decoration-none")}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <Chip
                            avatar={<Avatar alt="Natacha"
                                src={user?.avatar} />}
                            label={user?.userName}
                            variant="outlined"
                            style={{ fontSize: "13px" }}
                        />
                    </div>
                    <ul className="dropdown-menu text-small">
                        <li>
                            <div className="dropdown-item">
                                <PersonIcon className="me-1" />
                                <span>
                                    Tài khoản
                                </span>
                            </div>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <div
                            // onClick={() => logout}
                            className="dropdown-item">
                                <LogoutIcon className="me-1" />
                                <span>
                                    Đăng xuất
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </header>

        </>
    )
}

