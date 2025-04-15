import classNames from "classnames/bind";
import style from "./Sidebar.module.css";
import logo from "./../../../../assets/images/AGRis__2_-removebg-preview.png";

import { use, useRef, useState } from "react";
import { routes } from "../../../../config/routes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Nav from 'react-bootstrap/Nav';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import CalculateIcon from '@mui/icons-material/Calculate';

const cn = classNames.bind(style);

export default function Sidebar() {
  const location = useLocation()
  const listNav = [
    {
      name: "Sản phẩm",
      link: routes.searchProduct,
      getIcon: (isActive) => (
        <AutoAwesomeMosaicIcon style={isActive ? { color: "white" } : {}} />
      ),
    },
    {
      name: "Danh mục sản phẩm",
      link: routes.categoryManagement,
      getIcon: (isActive) => (
        <CategoryIcon style={isActive ? { color: "white" } : {}} />
      )
    },
    {
      name: "Đơn vị tính",
      link: routes.calculationUnit,
      getIcon: (isActive) => (
        <CalculateIcon style={isActive ? { color: "white" } : {}} />
      )
    },
    {
      name: "Kho",
      link: routes.warehouse,
      getIcon: (isActive) => (
        <WarehouseIcon style={isActive ? { color: "white" } : {}} />
      ),
    },
    {
      name: "Nhập hàng",
      link: routes.importGoods,
      getIcon: (isActive) => (
        <PostAddIcon style={isActive ? { color: "white" } : {}} />
      )
    },
    {
      name: "Nhân viên",
      link: routes.staff,
      getIcon: (isActive) => (
        <PeopleAltIcon style={isActive ? { color: "white" } : {}} />
      )
    },
    {
      name: "Đơn hàng",
      link: routes.orderManagement,
      getIcon: (isActive) => (
        <AssignmentIcon style={isActive ? { color: "white" } : {}} />
      )
    }
  ].map((nav) => {
    const isActive = location.pathname === nav.link;
    return {
      ...nav,
      active: isActive,
      icon: nav.getIcon(isActive),
    };
  });

  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate()
  return (
    <>

      <div className="flex-shrink-0 sticky-top" style={{ width: "280px" }}>
        <a
          href="/"
          className="d-flex align-items-center mb-1 link-body-emphasis text-decoration-none"
        >
          <svg
            className="bi pe-none me-2"
            width="30"
            height="24"
            aria-hidden="true"
          >
          </svg>
          <div className={cn("fs-5 fw-semibold", "logo")}>
            <img src={logo} alt="" />
          </div>
        </a>
        <ul className={cn("nav", "nav-pills", "list-unstyled p-3", "side-bar-item")}>
          {
            listNav.map(
              (nav, item) => (
                <li className={cn("mb-1", "nav-link-item-content")}>
                  <Nav.Link
                    className={cn("nav-link-btn", "d-inline-flex", "align-items-center")}
                    data-bs-toggle="collapse"
                    data-bs-target="#home-collapse"
                    aria-expanded="true"
                    active={nav.active}
                    style={nav.active ? { backgroundColor: "var(--primary-color)" } : {}}
                    onClick={() => {
                      navigate(nav.link)
                      setIsEdit(!isEdit)

                    }}
                  >
                    {nav.icon}
                    <span style={nav.active ? { color: "white" } : {}}
                    >
                      {nav.name}
                    </span>
                  </Nav.Link>
                </li>
              )
            )
          }
        </ul >
      </div >
    </>
  )
}