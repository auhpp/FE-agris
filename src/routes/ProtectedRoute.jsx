// ProtectedRoute.js
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { introspect } from '../services/authenticationService';

const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);
    return (
        token ?
            <Outlet />
            : <Navigate to={routes.login} />
    );
};

export default ProtectedRoute;