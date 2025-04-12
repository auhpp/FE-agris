import style from "./StaffConfirmPassword.module.css";
import classNames from "classnames/bind";
import { showPassword } from "./../../utils/input";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { changePassword } from "../../services/customerService";
import { Alert } from "@mui/material";
import { checkPasswordStrength } from "./../../utils/validate"
import logo from "./../../assets/images/logo.png"
import { createStaff } from "../../services/staffService";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
const cn = classNames.bind(style);



export default function StaffConfirmPassword() {
    var [isShowPassword, setIsShowPassword] = useState("password");
    const queryParameters = new URLSearchParams(window.location.search)
    var email = queryParameters.get("email");
    var staffId = queryParameters.get("staffId")
    const navigate = useNavigate()
    const [input, setInput] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [isShowSuccess, setIsShowSuccess] = useState(false);

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
                case 'newPassword':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mật khẩu.';
                    } else if ((input.confirmPassword && value) !== input.confirmPassword) {
                        stateObj['confirmPassword'] = 'Mật khẩu không khớp.';
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
                    } else if (input.newPassword && value !== input.newPassword) {
                        stateObj[name] = 'Mật khẩu không khớp.';
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    };


    // Handle submit
    const handleSubmit = () => {
        var staffRequest = {};
        var ok = true;
        if (error.confirmPassword?.length !== 0 || error.newPassword?.length !== 0) {
            ok = false;
        }
        if (input.confirmPassword.length == 0 || input.newPassword.length == 0) {
            ok = false;
        }
        if (ok) {
            staffRequest.userName = email;
            staffRequest.password = input.confirmPassword;
            staffRequest.id = staffId;
            createStaff(staffRequest).then(
                data => {
                    console.log(data)
                    if (data.code == 200) {
                        navigate(routes.searchProduct)
                    }
                }
            )
        }
    }
    return (
        <>
            <div className="container">
                <div className={cn("inner-content")}>
                    <div className={cn("password-page")}>
                        {/* Head */}
                        <div className={cn("head", "row")}>
                            <div className={cn("content", "col-6")}>
                                <h4>Nhập mật khẩu</h4>
                                <p className={cn("note")}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                            </div>
                            <div className={cn("logo", "col-4", "offset-2")}>
                                <img src={logo} alt="" />
                            </div>
                        </div>
                        {/* Content */}
                        <div className={cn("main-content")}>
                            {/* success alert */}
                            {
                                isShowSuccess && (
                                    <Alert
                                        className={cn("alert-success")}
                                        icon={<CheckIcon fontSize="inherit" />} severity="success">
                                        Cập nhật mật khẩu thành công.
                                    </Alert>
                                )
                            }

                            {/* New password */}
                            <div className={cn("mb-5", "row")}>
                                <label for="newPassword" className={cn("col-lg-3", "col-form-label", "input-title")}>Mật khẩu </label>
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
                            {/* confirm password */}
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
                            {/* show password */}
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
                            {/* submit button */}
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
                </div>
            </div>
        </>
    );
}