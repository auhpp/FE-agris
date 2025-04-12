
import { createTheme, extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import style from "./DefaultAdminLayout.module.css";
import classNames from "classnames/bind";

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import logo from "../../../../assets/images/AGRis__2_-removebg-preview.png";
import { routes } from '../../../../config/routes';
import { useEffect, useMemo, useState } from 'react';
import { getUserInfo } from '../../../../services/customerService';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Sidebar from '../Sidebar';
import Header from '../Header';
const cn = classNames.bind(style);



export default function DefaultAdminLayout({ children }) {
    return (
        <>
            <div className="container-fluid">
                <div className={cn("row", "default-layout")}>
                    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                        <Sidebar />
                    </div>
                    <main className={cn("col-md-9", "ms-sm-auto", "col-lg-10", "main-content")}>
                        {/* <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="light"> */}
                        <Header />
                        {/* </header> */}

                        <div className={cn("container")}>
                            {children}
                        </div>

                    </main>
                </div>
            </div>
        </>
    );
}
