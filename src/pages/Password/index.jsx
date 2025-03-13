import style from "./Password.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import { inputFocus, showPassword } from "./../../utils/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { changePassword } from "../../services/userService";
import { Alert } from "@mui/material";
const cn = classNames.bind(style);

function checkPasswordStrength(password) {
    // Initialize variables
    var strength = 0;
    var tips = "";

    // Check password length
    if (password.length < 8) {
        tips += "Phải từ 8 ký tự. ";
    } else {
        strength += 1;
    }

    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
    } else {
        tips += "Phải có cả ký tự hoa và ký tự thường. ";
    }

    // Check for numbers
    if (password.match(/\d/)) {
        strength += 1;
    } else {
        tips += "Phải có ít nhất một chữ số. ";
    }

    // Check for special characters
    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
    } else {
        tips += "Phải có ít nhất một ký tự đặc biệt. ";
    }

    // Return results
    return [strength, tips];
}


export default function Password() {
    var [isShowPassword, setIsShowPassword] = useState("password");

    const [input, setInput] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const handleToggle = () => {
        setIsShowPassword(showPassword(isShowPassword))
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(name)
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        console.log(value)
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'oldPassword':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    }
                    break;
                case 'newPassword':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    } else if ((input.confirmPassword && value) !== input.confirmPassword) {
                        stateObj['confirmPassword'] =
                            'Mật khẩu không khớp.';
                    } else {
                        const [strength, tips] = checkPasswordStrength(value)
                        if (strength < 4) stateObj[name] = tips;
                        console.log(tips)
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

    const [isShowSuccess, setIsShowSuccess] = useState(false);

    // Handle submit
    const handleSubmit = () => {
        console.log(error)
        var userRequest = {};
        var ok = true;
        if (error.confirmPassword?.length !== 0 || error.oldPassword?.length !== 0 || error.newPassword?.length !== 0) {
            ok = false;
        }
        if (input.confirmPassword.length == 0 || input.oldPassword.length == 0 || input.newPassword.length == 0) {
            ok = false;
        }
        if (ok) {
            userRequest.oldPassword = input.oldPassword;
            userRequest.newPassword = input.confirmPassword;
            changePassword(userRequest).then(
                data => {
                    console.log(data)
                    if (data.code != 200) {
                        setError((prev) => ({
                            ...prev,
                            oldPassword: "Sai mật khẩu"
                        }))

                        console.log(input)
                    }
                    else {
                        setIsShowSuccess(true);
                    }
                    setInput({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    })
                }
            );
        }
    }
    return (
        <>
            <div className={cn("password-page")}>
                <div className={cn("head")}>
                    <h2>Đổi mật khẩu</h2>
                    <p className={cn("note")}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                </div>
                <div className={cn("main-content")}>
                    {
                        isShowSuccess && (
                            <Alert
                            className={cn("alert-success")}
                            icon={<CheckIcon fontSize="inherit" />} severity="success">
                                Cập nhật mật khẩu thành công.
                            </Alert>
                        )
                    }
                    <div className={cn("mb-5", "row")}>
                        <label for="old-password" className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Mật khẩu cũ</label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type={isShowPassword}
                                className={cn("form-control", "input-item", "input-password")}
                                name="oldPassword"
                                id="old-password"
                                required
                                value={input.oldPassword}
                                onChange={onInputChange}
                            />
                            {error.oldPassword && (<span className={cn("text-danger")}>{error.oldPassword}</span>)}

                        </div>
                    </div>
                    <div className={cn("mb-5", "row")}>
                        <label for="newPassword" className={cn("col-lg-3", "col-form-label", "input-title")}>Mật khẩu mới</label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type={isShowPassword}
                                className={cn("form-control", "input-item", "input-password")}
                                name="newPassword"
                                id="newPassword"
                                required
                                value={input.newPassword}
                                onChange={onInputChange}
                                onBlur={validateInput}
                            />
                            {error.newPassword && (<span className={cn("text-danger")}>{error.newPassword}</span>)}

                        </div>
                    </div>
                    <div className={cn("mb-5", "row")}>
                        <label for="confirmPassword" className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Xác nhận mật khẩu</label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type={isShowPassword}
                                className={cn("form-control", "input-item", "re-input-password")}
                                name="confirmPassword"
                                id="confirmPassword"
                                required
                                value={input.confirmPassword}
                                onChange={onInputChange}
                                onBlur={validateInput}
                            />
                            {error.confirmPassword && (<span className={cn("text-danger")}>{error.confirmPassword}</span>)}
                        </div>
                    </div>
                    <div className={cn("mb-2", "row")}>
                        <label className={cn("col-lg-3", "col-form-label")}></label>
                        <div className={cn("col-lg-9")}>
                            <div class="form-check">
                                <input type="checkbox"
                                    className={cn("input-checkbox", "form-check-input")}
                                    id="isShowPassword"
                                    name="isShowPassword"
                                    onChange={handleToggle} />
                                <label class="form-check-label" for="isShowPassword">
                                    Hiển thị mật khẩu
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={cn("mt-4", "row")}>
                        <label for="input-confirm-password-register" className={cn("col-lg-3", "col-form-label", "input-title")}>
                        </label>
                        <div className={cn("col-lg-9")}>
                            <button
                                onClick={handleSubmit}
                                className={cn("btn-3")}>
                                Xác nhận
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}