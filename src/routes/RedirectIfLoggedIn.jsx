import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { jwtDecode } from "jwt-decode"
import { introspect } from '../services/authenticationService';
import { CircularProgress } from '@mui/material';

const RedirectIfLoggedIn = ({ path }) => {
    const { token } = useContext(AuthContext);

    return (
        <Navigate to={routes.home} />
    )
};

export default RedirectIfLoggedIn;