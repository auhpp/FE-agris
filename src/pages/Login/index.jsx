import classNames from "classnames/bind";
import style from "./Login.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { showPassword } from "../../utils/input";
import { AuthContext } from "../../context/AuthContext";
import { routes } from "../../config/routes";

const cn = classNames.bind(style);

export default function Login() {
    var [isShowPassword, setIsShowPassword] = useState("password");
    const { loginAction } = useContext(AuthContext);
    var [input, setInput] = useState({
        userName: '',
        password: ''
    });

    var [error, setError] = useState({
        userName: '',
        password: ''
    });
    // Set is show password
    const handleToggle = () => {
        setIsShowPassword(showPassword(isShowPassword))
    }

    //Input
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
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'userName':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên đăng nhập';
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

    //Login
    const handleLogin = (e) => {
        e.preventDefault();
        loginAction(input, setError)
        setInput({
            'userName': '',
            'password': ''
        })
    }


    return (
        <>
            <form
                onSubmit={handleLogin}
                className={cn("login-form", "col-lg-8", "offset-lg-2")}>
                <div className={cn("inner-content")}>

                    {/* head */}
                    <h3 className={cn("heading-1")}>Đăng nhập</h3>
                    {/* User name */}
                    <div className={cn("mb-5 row")}>
                        <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Tên đăng nhập</label>
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
                    {/* Password */}
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
                    {/* show password */}
                    <div className={cn("mb-3", "row")}>
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

                    {/* login button submit */}
                    <div className={cn("mb-4", "row")}>
                        <label className={cn("col-lg-3", "col-form-label")}></label>
                        <div className={cn("col-lg-9")}>
                            <button type="submit" className={cn("btn-3")}>Đăng nhập</button>

                        </div>
                    </div>
                    {/* redirect register page */}
                    <div className={cn("mb-4", "row")}>
                        <label className={cn("col-lg-3", "col-form-label ")}></label>
                        <div className={cn("col-lg-9", "d-flex", "align-items-center", "gap-5")}>
                            <Link to={routes.resetPassword} className="text-primary">
                                Quên mật khẩu ?
                            </Link>
                            <p className={cn("remind-register")}>Bạn mới biết đến Agris?
                                <Link to={routes.register} className={cn("register-link")}>Đăng ký</Link></p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
