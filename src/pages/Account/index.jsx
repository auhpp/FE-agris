import { Link } from "react-router-dom";
import style from "./Account.module.css";
import classNames from "classnames/bind";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import DefaultLayout from "./../../layouts/DefaultLayout/index,";
import avatar from "./../../assets/images/messiprimergol.jpg";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { routes } from "../../config/routes";
import { getUserInfo } from "../../services/userService";

const cn = classNames.bind(style);

export default function Account({ children }) {

    const [showSubMenu, SetShowSubMenu] = useState(true);

    const [user, setUser] = useState();
    useEffect(
        () => {
            getUserInfo().then(
                data => {
                    setUser(data.result);
                }
            )
        }, []
    )

    return (
        <>
            <DefaultLayout>
                <div className={cn("inner-content", "row")}>
                    <div className={cn("side-bar", "col-2")}>
                        <div className={cn("head")}>
                            <div className={cn("account")}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={
                                        user?.avatar ?? ""
                                    }
                                    sx={{ width: 56, height: 56 }}
                                />
                                <div className={cn("user-name")}>{user?.userName}</div>
                            </div>
                        </div>
                        <div className={cn("navigate")}>
                            <ul>
                                <li>
                                    <button onClick={() => SetShowSubMenu(!showSubMenu)} className={cn("dropdown-btn", "btn-account")}>
                                        <Person2OutlinedIcon />
                                        <span className={cn("title")}>Tài khoản của tôi</span>
                                    </button>
                                    {showSubMenu == true &&
                                        (
                                            <ul className={cn("sub-menu")}>
                                                <li>
                                                    <Link to={routes.profile}>
                                                        Hồ sơ
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={routes.address}>
                                                        Địa chỉ
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={routes.password}>
                                                        Đổi mật khẩu
                                                    </Link>
                                                </li>

                                            </ul>
                                        )
                                    }
                                </li>
                            </ul>
                        </div>
                    </div >
                    <div className={cn("main-content", "col-10")}>
                        {children}
                    </div>
                </div >
            </DefaultLayout>
        </>

    );
}
