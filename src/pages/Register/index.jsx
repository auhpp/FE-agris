import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import classNames from "classnames/bind";
import style from "./Register.module.css";
import { routes } from "./../../config/routes";
import { inputFocus, showPassword } from "./../../utils/input";
import { createUser } from "../../services/customerService";
import { checkPasswordStrength } from "./../../utils/validate";
const cn = classNames.bind(style);

export default function Register() {
    var [isShowPassword, setIsShowPassword] = useState("password");
    const location = useLocation()
    const goBack = location.state?.goBack;
    const navigate = useNavigate();

    const [input, setInput] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
    });


    //set is showpassword
    const handleToggle = () => {
        setIsShowPassword(showPassword(isShowPassword))
    }
    //input
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
                        stateObj[name] = 'Vui lòng nhập tên người dùng';
                    }
                    break;

                case 'password':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    } else if ((input.confirmPassword && value) !== input.confirmPassword) {
                        stateObj['confirmPassword'] =
                            'Mật khẩu không khớp.';
                    } else {
                        const [strength, tips] = checkPasswordStrength(value)
                        if (strength < 4) stateObj[name] = tips;
                        stateObj['confirmPassword'] = input.confirmPassword
                            ? '' : error.confirmPassword;
                    }
                    break;

                case 'confirmPassword':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    } else if (input.password && value !== input.password) {
                        stateObj[name] = 'Mật khẩu không khớp.';
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    };

    //Submit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const [strength, tips] = checkPasswordStrength(input.password)
        if (strength < 4) {
            inputFocus("input-password-register")
        }
        const userRequest = {
            userName: input.userName,
            password: input.password
        }
        if (error.confirmPassword == "" && error.password == "" && error.userName == "") {
            createUser(userRequest)
                .then(data => {
                    console.log("data", data)
                    if (data.code != 200) {
                        inputFocus("username-register-input")
                        setError((prev) => ({
                            ...prev,
                            ['userName']: "Tên người dùng này đã tồn tại"
                        }))

                    }
                    else {
                        !goBack && navigate(routes.login)
                    }
                })
        }
    }

    return (
        <>
            <div className={cn("inner-content")}>
                <form
                    onSubmit={handleFormSubmit}
                    className={cn("register-form", "col-lg-8", "offset-lg-2")}>
                    {/* head */}
                    <h3 className={cn("heading-1")}>Đăng ký tài khoản</h3>
                    {/* user name */}
                    <div className={cn("mb-5", "row")}>
                        <label for="username-register-input"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Tên người dùng
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                className={cn("form-control", "input-item")}
                                name="userName"
                                id="username-register-input"
                                required
                                onChange={onInputChange}
                                onBlur={validateInput}
                            />
                            {error.userName && (<span className={cn("text-danger")}>{error.userName}</span>)}

                        </div>
                    </div>
                    {/* password */}
                    <div className={cn("mb-5", "row")}>
                        <label for="input-password-register"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Mật khẩu
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type={isShowPassword}
                                className={cn("form-control", "input-item", "input-password")}
                                name="password"
                                id="input-password-register"
                                required
                                onChange={onInputChange}
                                onBlur={validateInput}
                            />
                            {error.password && (<span className={cn("text-danger")}>{error.password}</span>)}

                        </div>
                    </div>
                    {/* Confirm password */}
                    <div className={cn("mb-5", "row")}>
                        <label for="input-confirm-password-register"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Nhập lại mật khẩu
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type={isShowPassword}
                                className={cn("form-control", "input-item", "re-input-password")}
                                name="confirmPassword"
                                id="input-confirm-password-register"
                                required
                                onChange={onInputChange}
                                onBlur={validateInput}
                            />
                            {error.confirmPassword && (<span className={cn("text-danger")}>{error.confirmPassword}</span>)}
                        </div>
                    </div>
                    {/* Show password */}
                    <div className={cn("mb-2", "row")}>
                        <label className={cn("col-lg-3", "col-form-label")}></label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="checkbox"
                                className={cn("input-checkbox")}
                                id="isShowPassword"
                                name="isShowPassword"
                                onChange={handleToggle}
                            />
                            <label for="isShowPassword">Hiển thị mật khẩu</label>
                        </div>
                    </div>
                    {/* Redirect login page */}
                    <div className={cn("mb-2", "row")}>
                        <label className={cn("col-lg-3", "col-form-label")}></label>
                        <div className={cn("col-lg-9")}>
                            <p className={cn("remind-login")}>Bạn đã có tài khoản? <Link to={routes.login} className={cn("login")}>Đăng nhập</Link></p>
                        </div>
                    </div>
                    {/* button submit */}
                    <div className={cn("mb-5", "row")}>
                        <label for="quantity" className={cn("col-lg-3", "col-form-label")}></label>
                        <div className={cn("col-lg-9")}>
                            {goBack &&
                                <button onClick={() => navigate(-1)} type="button" className={cn("btn-2", "me-4")}>Quay lại</button>}
                            <button button type="submit" className={cn("btn-3")}>Tạo tài khoản</button>
                        </div>
                    </div>
                </form >
            </div>
        </>
    );
}
