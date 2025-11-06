import style from "./Header.module.css";
import logo from "./../../../assets/images/logo.png";
import {
    BsPersonFill, BsCartFill, BsChevronDown, BsList,
    BsSearch
} from "react-icons/bs";
import classNames from "classnames/bind";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { getAllCategory } from "../../../services/categoryService";
import { introspect } from "../../../services/authenticationService";
import { AuthContext } from "../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import CartContext from "../../../context/CartContext";
const cn = classNames.bind(style);

export default function Header() {
    const [showCategory, setShowCategory] = useState(false);
    const navigate = useNavigate();
    const { logoutAction, token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    var role = "";
    var [query, setQuery] = useState("");
    var cart = useContext(CartContext);
    const [showAccount, setShowAccount] = useState(false);
    const [isAuth, setIsAuth] = useState();

    //Get role
    if (token) {
        role = jwtDecode(token).scope;
    }
    //Get all category
    useEffect(() => {
        getAllCategory().then(
            data => {
                setCategories(data.result)
            }
        )
    }, [])

    //submit search
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query != "")
            navigate({ pathname: routes.search, search: "?name=" + query })
    }

    //Logout
    const handleLogout = () => {
        logoutAction()
    }

    //Set is auth
    useEffect(
        () => {
            introspect({ token: token }).then(
                data => {
                    setIsAuth(data.result?.valid)
                }
            )
        }, []
    )
    return (
        <>
            {/* <!-- header --> */}
            <header className={cn("header")}>
                <div className={cn("container")}>
                    <div className={cn("inner-wrap")}>
                        <div className={cn("row", "header-top")}>
                            {/* <!-- logo --> */}
                            <div className={cn("col-xl-2", "col-lg-9", "col-sm-8", "col-7")}>
                                <a href={"/"} className={cn("logo")}>
                                    <img src={logo} alt="logo" className={cn("logo-img")} />
                                </a>
                            </div>
                            {/* <!-- end logo --> */}

                            {/* <!-- Input search san pham --> */}
                            <div className={cn("col-xl-6", "col-12", "myOrder-lg-1")}>
                                <form onSubmit={handleSubmit} className={cn("search-bar")}>
                                    <input type="text" name="name" placeholder="Tìm kiếm ở đây..."
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <button type="submit" className={cn("btn-1", "btn-search")}>
                                        <BsSearch className={cn("search-icon")} />
                                    </button>
                                </form>
                            </div>
                            {/* <!-- end Input search san pham --> */}
                            <div className={cn("col-xl-4", "col-lg-2", "col-sm-2", "col-3")}>
                                <div className={cn("content-right")}>
                                    {/* So dien thoai */}
                                    <div className={cn("phone-number", "row")}>
                                        <div className={cn("phone-icon", "col")}>
                                            <PhoneInTalkIcon />
                                        </div>
                                        <div className={cn("phone-number-text", "col")}>
                                            <p className={cn("text-nowrap")}>Gọi mua hàng</p>
                                            <p>0896455184</p>
                                        </div>
                                    </div>
                                    {/* <!-- Tai khoan nguoi dung --> */}
                                    <div className={cn("full-account")}>
                                        <button onClick={() => {
                                            setShowAccount(!showAccount)
                                        }}
                                            className={cn("account")}>
                                            <BsPersonFill className={cn("person-icon")} />
                                            <span className={cn("name-content-right")}>Tài khoản</span>
                                        </button>
                                        {/* <!-- Xem tai khoan --> */}
                                        {
                                            showAccount == true && (
                                                <ul onBlur={() => setShowAccount(false)} className={cn("info-account")}>
                                                    {
                                                        isAuth == true ? (
                                                            <>
                                                                {
                                                                    role == "ADMIN" && (
                                                                        <li className={cn("info-item")}>
                                                                            <Link to={routes.searchProduct}>Dashboard</Link>
                                                                        </li>
                                                                    )
                                                                }
                                                                <li className={cn("info-item")}>
                                                                    <Link to={routes.profile}>Tài khoản của tôi</Link>
                                                                </li>
                                                                <li className={cn("info-item")}>
                                                                    <a href="/"
                                                                        onClick={handleLogout}
                                                                    >Đăng xuất</a>
                                                                </li>
                                                            </>
                                                        ) :
                                                            (
                                                                <>
                                                                    <li className={cn("info-item")}>
                                                                        <Link to={routes.login}>Đăng nhập</Link>
                                                                    </li>
                                                                    <li className={cn("info-item")}>
                                                                        <Link to={routes.register}>Đăng ký</Link>
                                                                    </li>
                                                                </>
                                                            )
                                                    }
                                                </ul>
                                            )
                                        }
                                    </div>
                                    {/* Gio hang */}
                                    <a onClick={() => {
                                        navigate(routes.cart)
                                    }} className={cn("shopping-cart")}>
                                        <BsCartFill className={cn("cart-icon")} />
                                        <span className={cn("name-content-right")}>Giỏ hàng</span>
                                        <div className={cn("count-number")}>
                                            <span className={cn("number")}>{cart.cartSize}</span>
                                        </div>
                                    </a>
                                    {/* <!--end Gio hang --> */}
                                </div>
                            </div>
                            {/* <div className={cn("col-lg-1", "col-sm-2", "col-2")}>
                                <i className={cn("fa-solid", "fa-bars", "bars")}></i>
                            </div> */}
                        </div>
                        <div className={cn("row", "header-bottom")}>
                            <div className={cn("col-3")}>
                                {/* <!-- Danh muc san pham --> */}
                                <div className={cn("categories")}>
                                    <button onClick={() => setShowCategory(!showCategory)} className={cn("btn-1", "btn-categories")}>
                                        <BsList className={cn("list-icon")} />
                                        <span>Danh mục sản phẩm</span>
                                        <BsChevronDown className={cn("chevron-down-icon")} />
                                    </button>
                                    {showCategory == true && (
                                        <ul className={cn("category-list")}>
                                            {
                                                categories?.map(
                                                    (item, index) => (
                                                        <li key={item.id} className={cn("category-item")}>
                                                            <a href="#">{item.name}</a>
                                                        </li>
                                                    )
                                                )
                                            }

                                            <li className={cn("category-item", "load-all")}>
                                                <Link to={routes.products}>Xem tất cả</Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {/* <!-- navigation --> */}
                            <div className={cn("offset-4", "col-5")}>
                                <nav className={cn("nav-list")}>
                                    {/* <!-- navigation o man hinh lon --> */}
                                    <ul>
                                        <li className={cn("nav-item", "nav-item-hide")}>
                                            <a href="/">Trang chủ</a>
                                        </li>
                                        <li className={cn("nav-item", "nav-item-hide")}>
                                            <a href={routes.products}>Sản phẩm</a>
                                        </li>
                                        {/* <li className={cn("nav-item", "nav-item-hide")}>
                                            <a href="/contact">Liên hệ</a>
                                        </li> */}
                                    </ul>
                                    {/* <!-- end navigation o man hinh lon --> */}
                                    {/* <!-- navigation o man hinh nho --> */}
                                    {/* <ul className={cn("side-bar")}>
                                        <li>
                                            <i className={cn("fa-solid", "fa-x", "hide-side-bar")}></i>
                                        </li>
                                        <li className={cn("nav-item")}>
                                            <a href="/">Trang chủ</a>
                                        </li>
                                        <li className={cn("nav-item")}>
                                            <a href="/products">Sản phẩm</a>
                                        </li>
                                        <li className={cn("nav-item")}>
                                            <a href="/contact">Liên hệ</a>
                                        </li>
                                    </ul> */}
                                    {/* <!-- end navigation o man hinh nho --> */}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* <!-- End header --> */}

        </>
    );
}