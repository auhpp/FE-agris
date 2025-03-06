import classNames from "classnames/bind";
import style from "./Sidebar.module.css";
import logo from "./../../../../assets/images/AGRis__2_-removebg-preview.png";
import {
    BsPerson,
    BsClipboardPlus,
    BsCardList,
    BsInboxes
} from "react-icons/bs";
import { use, useRef, useState } from "react";
import { routes } from "../../../../config/routes";
import { Link } from "react-router-dom";
const cn = classNames.bind(style);

export default function Sidebar() {
    const sidebarRef = useRef(null);
    const toggleButtonRef = useRef(null);
    var [activeLink, setActiveLink] = useState(routes.searchProduct);

    function toggleSidebar() {
        if (!sidebarRef.current || !toggleButtonRef.current) return;

        sidebarRef.current.classList.toggle(cn("close"));
        toggleButtonRef.current.classList.toggle(cn("rotate"));

        // closeAllSubMenus();
    }

    // const toggleSubMenu = (e) => {
    //     const button = e.currentTarget;
    //     if (!button || !sidebarRef.current) return;

    //     if (!button.nextElementSibling.classList.contains(cn("show"))) {
    //         closeAllSubMenus();
    //     }

    //     button.nextElementSibling.classList.toggle(cn("show"));
    //     button.classList.toggle(cn("rotate"));

    //     if (sidebarRef.current.classList.contains(cn("close"))) {
    //         sidebarRef.current.classList.remove(cn("close"));
    //         toggleButtonRef.current.classList.toggle(cn("rotate"));
    //     }
    // }

    // function closeAllSubMenus() {
    //     if (!sidebarRef.current) return;

    //     Array.from(sidebarRef.current.getElementsByClassName(cn("show"))).forEach((ul) => {
    //         ul.classList.remove(cn("show"));
    //         ul.previousElementSibling.classList.remove(cn("rotate"));
    //     });
    // }

    const handleLinkClick = (e) => {
        setActiveLink(e.currentTarget.getAttribute('nameLink'));
    }

    return (
        <>
            <nav id={cn("sidebar")} ref={sidebarRef}>
                <ul>
                    <li>
                        <div className={cn("logo")}>
                            <img src={logo} alt="" />
                        </div>
                        <button onClick={toggleSidebar} id={cn("toggle-btn")} ref={toggleButtonRef}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z" />
                            </svg>
                        </button>
                    </li>
                    <li className={cn(activeLink == routes.searchProduct ? 'active' : '')}>
                        <Link
                            nameLink={routes.searchProduct}
                            onClick={handleLinkClick}
                            to={routes.searchProduct}>
                            <BsClipboardPlus className={cn("icon-sidebar-item")} />
                            <span>Quản lý sản phẩm</span>
                        </Link>
                    </li>
                    <li className={cn(activeLink == routes.searchAccount ? 'active' : '')}>
                        <Link
                            nameLink={routes.searchAccount}
                            onClick={handleLinkClick}
                            to={routes.searchAccount}>
                            <BsPerson className={cn("icon-sidebar-item")} />
                            <span>Quản lý tài khoản</span>
                        </Link>
                    </li>
                    <li className={cn(activeLink == routes.searchCategory ? 'active' : '')}>
                        <Link
                            nameLink={routes.searchCategory}
                            onClick={handleLinkClick}
                            to={routes.searchCategory}>
                            <BsCardList className={cn("icon-sidebar-item")} />
                            <span>Quản lý danh mục</span>
                        </Link>
                    </li>
                    <li className={cn(activeLink == routes.searchSupplier ? 'active' : '')}>
                        <Link
                            nameLink={routes.searchSupplier}
                            onClick={handleLinkClick}
                            to={routes.searchSupplier}>
                            <BsInboxes className={cn("icon-sidebar-item")} />
                            <span>Quản lý nhà cung cấp</span>
                        </Link>
                    </li>
                    {/* <li>
                        <button id={cn("btn-create")} onClick={toggleSubMenu} className={cn("dropdown-btn")}>
                            <span>Create</span>
                        </button>
                        <ul className={cn("sub-menu")}>
                            <div>
                                <li><a href="#">Folder</a></li>
                                <li><a href="#">Document</a></li>
                                <li><a href="#">Project</a></li>
                            </div>
                        </ul>
                    </li> */}


                </ul>
            </nav>
        </>
    )
}

