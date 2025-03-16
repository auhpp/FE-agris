import React, { createContext, useState, useEffect, useRef } from 'react';
import { introspect, login, logout } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import { routes } from '../config/routes';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    const loginAction = async (request) => {
        try {
            var isSuccess = true;
            login(request).then(
                data => {
                    if (data.code == 200) {
                        localStorage.setItem("token", data.result?.token)
                        setToken(data.result?.token)
                        navigate(routes.home)
                        window.location.reload()
                    }

                    else {
                        isSuccess = false;
                    }
                }
            )
            return isSuccess;
        } catch (err) {
            console.error(err);
        }
    }

    const logoutAction = () => {
        logout({ token })
        setToken("")
        localStorage.removeItem("token")
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{ loginAction, logoutAction, token }}>
            {children}
        </AuthContext.Provider>
    );
};