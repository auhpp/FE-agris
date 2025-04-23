import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ path }) => {
    const { token } = useContext(AuthContext);
    var role = "USER"
    if (token)
        role = jwtDecode(token).scope;
    var ok = true;
    if (token) {
        if (path == routes.profile || path == routes.password) {
            return (
                <Outlet />
            )
        }
    }
    return (
        token && role != "ADMIN" && (path != routes.profile || path != routes.password) ?
            <Outlet />
            : <Navigate to={routes.login} />
    );
};

export default ProtectedRoute;