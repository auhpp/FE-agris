import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { routes } from '../config/routes';
import { jwtDecode } from "jwt-decode"
import { introspect } from '../services/authenticationService';
import { CircularProgress } from '@mui/material';

const AdminRoute = () => {
    const { token } = useContext(AuthContext);
    var role = token ? jwtDecode(token).scope : null;
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    //call api 
    useEffect(() => {
        (async () => {
            try {
                const data = await introspect({ token: token });
                setAuth(data.result?.valid)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [token])

    if (loading) {
        return <CircularProgress color="success" size="3rem" />;
    }
    return (
        auth && role == "ADMIN" ?
            <Outlet />
            : <Navigate to={routes.home} />
    );
};

export default AdminRoute;