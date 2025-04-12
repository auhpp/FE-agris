import React, { createContext, useState, useEffect, useRef } from 'react';
import { introspect, login, logout } from '../services/authenticationService';
import { useNavigate } from 'react-router-dom';
import { routes } from '../config/routes';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const navigate = useNavigate();

    const loginAction = async (request, setError) => {
        login(request).then(
            data => {
                if (data.code == 200) {
                    localStorage.setItem("token", data.result?.token)
                    setToken(data.result?.token)
                    var role = jwtDecode(data.result?.token).scope;
                    if (role == "ADMIN") {
                        navigate(routes.searchProduct)
                    }
                    else {
                        navigate(routes.home)
                    }
                    window.location.reload()
                }
                else {
                    setError((prev) => ({
                        ...prev,
                        ['userName']: "Mật khẩu hoặc tên người dùng không đúng"
                    }))
                }
            }
        )
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