import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { jwtDecode } from "jwt-decode"

const AdminRoute = () => {
    const { token } = useContext(AuthContext);
    var role = jwtDecode(token).scope;
    console.log(role)
    return (
        token && role == "ADMIN" ?
            <Outlet />
            : <Navigate to={routes.home} />
    );
};

export default AdminRoute;