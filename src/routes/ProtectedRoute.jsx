import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);
    var role = jwtDecode(token).scope;
    return (
        token && role != "ADMIN" ?
            <Outlet />
            : <Navigate to={routes.login} />
    );
};

export default ProtectedRoute;