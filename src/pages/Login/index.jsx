import classNames from "classnames/bind";
import style from "./Login.module.css";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { showPassword } from "../../utils/input";
import { login } from "../../services/authenticationService";
import { routes } from "./../../config/routes";
import { AuthContext } from "../../context/AuthContext";

const cn = classNames.bind(style);

export default function Login() {
    var [isShowPassword, setIsShowPassword] = useState("password");
    var navigate = useNavigate();
    const { loginAction } = useContext(AuthContext);
    const handleToggle = () => {
        setIsShowPassword(showPassword(isShowPassword))
    }

    var [input, setInput] = useState({
        userName: '',
        password: ''
    });

    var [error, setError] = useState({
        userName: '',
        password: ''
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        console.log(value)
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'userName':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên người dùng';
                    }
                    break;

                case 'password':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(input)
        const res = loginAction(input)
        if (!res) {
            setInput({
                'userName': '',
                'password': ''
            })
            setError((prev) => ({
                ...prev,
                ['userName']: "Mật khẩu hoặc tên người dùng không đúng"
            }))
        }
    };

    return (
        <>
            <form
                onSubmit={handleLogin}
                className={cn("login-form", "col-lg-8", "offset-lg-2")}>
                <h3 className={cn("heading-1")}>Đăng nhập</h3>
                <div className={cn("mb-5 row")}>
                    <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Tên người dùng</label>
                    <div className={cn("col-lg-9")}>
                        <input
                            type="text"
                            id="username-input-login"
                            className={cn("form-control", "input-item")}
                            name="userName"
                            required
                            onBlur={validateInput}
                            onChange={onInputChange}
                            value={input.userName}
                        />
                        {error.userName && (<span className={cn("text-danger")}>{error.userName}</span>)}

                    </div>
                </div>
                <div className={cn("mb-5", "row")}>
                    <label for="password-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Mật khẩu</label>
                    <div className={cn("col-lg-9")}>
                        <input
                            type={isShowPassword}
                            id="password-input-login"
                            className={cn("form-control", "input-item")}
                            name="password"
                            required
                            onBlur={validateInput}
                            onChange={onInputChange}
                            value={input.password}
                        />
                        {error.password && (<span className={cn("text-danger")}>{error.password}</span>)}

                    </div>
                </div>
                <div className={cn("mb-4", "row")}>
                    <label className={cn("col-lg-3", "col-form-label ")}></label>
                    <div className={cn("col-lg-9")}>
                        <input
                            type="checkbox"
                            id="display-password-login"
                            className={cn("input-checkbox")}
                            name="isShowPassword"
                            onChange={handleToggle}
                        />
                        <label for="display-password-login">Hiển thị mật khẩu</label>
                    </div>
                </div>
                <div className={cn("mb-4", "row")}>
                    <label className={cn("col-lg-3", "col-form-label ")}></label>
                    <div className={cn("col-lg-9")}>
                        <p className={cn("remind-register")}>Bạn mới biết đến Agris?
                            <Link to={"/register"} className={cn("register-link")}>Đăng ký</Link></p>
                    </div>
                </div>
                <div className={cn("mb-5", "row")}>
                    <label className={cn("col-lg-3", "col-form-label")}></label>
                    <div className={cn("col-lg-9")}>
                        <button type="submit" className={cn("btn-3")}>Đăng nhập</button>
                    </div>
                </div>
            </form>
        </>
    );
}
