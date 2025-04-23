import { Link, useNavigate } from "react-router-dom";
import style from "./Account.module.css";
import classNames from "classnames/bind";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import DefaultLayout from "../../layouts/DefaultLayout/index,";
import { Avatar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { routes } from "../../config/routes";
import { getUserInfo } from "../../services/customerService";
import AssignmentIcon from '@mui/icons-material/Assignment';
import DefaultAdminLayout from "../../layouts/components/admin/DefaultAdminLayout";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getStaffInfo } from "../../services/staffService";
const cn = classNames.bind(style);

export default function Account({ children }) {

    const [showSubMenu, setShowSubMenu] = useState(true);

    const [user, setUser] = useState();
    const navigate = useNavigate()
    //Get user
    useEffect(
        () => {
            role == "ADMIN" ?
                getStaffInfo().then(
                    data => {
                        setUser(data.result)
                    }
                )
                :
                getUserInfo().then(
                    data => {
                        setUser(data.result);
                    }
                )
        }, []
    )
    console.log(user)
    const { token } = useContext(AuthContext);
    var role = jwtDecode(token).scope;
    var Layout = role === "ADMIN" ? DefaultAdminLayout : DefaultLayout;

    return (
        <>

            <Layout>
                <div className={cn("inner-content", "row")}>
                    {
                        role != "ADMIN" &&
                        <div className={cn("side-bar", "col-2")}>
                            {/* account */}
                            <div className={cn("head")}>
                                <div className={cn("account")}>
                                    <Avatar
                                        alt=""
                                        src={
                                            user?.avatar ?? ""
                                        }
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <div className={cn("user-name")}>{user?.userName}</div>
                                </div>
                            </div>
                            {/* navigation */}
                            <div className={cn("navigate")}>
                                <ul>
                                    <li>
                                        <button onClick={() => setShowSubMenu(!showSubMenu)} className={cn("dropdown-btn", "btn-account")}>
                                            <Person2OutlinedIcon />
                                            <span className={cn("title")}>Tài khoản của tôi</span>
                                        </button>
                                        {/* Menu */}
                                        {showSubMenu == true &&
                                            (
                                                <ul className={cn("sub-menu")}>
                                                    <li>
                                                        <Link
                                                            to={routes.profile}>
                                                            Hồ sơ
                                                        </Link>
                                                    </li>
                                                    {
                                                        role != "ADMIN" &&
                                                        <li>
                                                            <Link to={routes.address}>
                                                                Địa chỉ
                                                            </Link>
                                                        </li>
                                                    }
                                                    <li>
                                                        <Link to={routes.password}>
                                                            Đổi mật khẩu
                                                        </Link>
                                                    </li>

                                                </ul>
                                            )
                                        }
                                    </li>
                                    {
                                        role != "ADMIN" &&
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setShowSubMenu(false)
                                                    navigate(routes.purchase)
                                                }}
                                                className={cn("dropdown-btn", "btn-account")}>
                                                <AssignmentIcon />
                                                <span className={cn("title")}>Đơn hàng</span>
                                            </button>

                                        </li>
                                    }
                                </ul>
                            </div>
                        </div >
                    }

                    {/* Content */}
                    {
                        role != "ADMIN" ?
                            <div className={cn("main-content", "col-10")}>
                                {children}
                            </div> :
                            <div className={cn("main-content", "col")}>
                                {children}
                            </div>
                    }
                </div >
            </Layout>
        </>

    );
}
