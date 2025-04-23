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
        try {
            const data = await login(request);
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
                if (data.code == 1035) {
                    setError((prev) => ({
                        ...prev,
                        ['userName']: "Tài khoản không khả dụng"
                    }))
                }
                else
                    setError((prev) => ({
                        ...prev,
                        ['userName']: "Mật khẩu hoặc tên đăng nhập không đúng"
                    }))
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            // setLoading(false);
        }
    }

    const logoutAction = () => {
        logout({ token })
        setToken("")
        localStorage.removeItem("token")
        var role = jwtDecode(token).scope;
        role === "ADMIN" && navigate(routes.home)
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{ loginAction, logoutAction, token }}>
            {children}
        </AuthContext.Provider>
    );
};