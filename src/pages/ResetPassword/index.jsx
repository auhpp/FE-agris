import style from "./ResetPassword.module.css";
import classNames from "classnames/bind";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { routes } from "../../config/routes";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { checkPasswordStrength, isEmail, isEmailValid } from "../../utils/validate";
import validator from 'validator';
import { generateOTPForResetPassword, validateOTP } from "../../services/emailService";
import { inputFocus, showPassword } from "../../utils/input";
import { forgetPassword, updatePassword } from "../../services/accountService";
const cn = classNames.bind(style);

export default function ResetPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [display, setDisplay] = useState({
        email: true,
        otp: false,
        inputPassword: false
    })
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    var [isShowPassword, setIsShowPassword] = useState("password");
    const [input, setInput] = useState({
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
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
    const handleSubmitResetPassword = (e) => {
        const [strength, tips] = checkPasswordStrength(input.password)
        if (strength < 4) {
            inputFocus("input-password-register")
        }
        const request = {
            email: email,
            newPassword: input.confirmPassword
        }
        if (error.confirmPassword == "" && error.password == "") {
            forgetPassword(request)
                .then(data => {
                    console.log("data", data)
                    if (data.code == 200) {
                        navigate(routes.login, { replace: true })
                    }
                })
        }
    }
    const validateEmail = () => {
        if (!isEmail(email)) {
            setEmailError("Email không hợp lệ!")
        }
        else setEmailError("")
    }
    const handleSubmitSendEmail = () => {
        if (email == "") {
            setEmailError("Nhập email")
        }
        if (emailError == "" && email) {
            generateOTPForResetPassword(email).then(
                data => {
                    console.log(data)
                    if (data.code == 200) {
                        setDisplay(prev => ({
                            ...prev,
                            email: false,
                            otp: true
                        }))
                    }
                    else if (data.code == 1021) {
                        setEmailError("Email không tồn tại trong hệ thống!")
                    }
                    else if (data.code == 1031) {
                        setEmailError("Email không hợp lệ!")
                    }
                }
            )
        }
    }

    const handleSubmitValidateOtp = () => {

        validateOTP({ key: email, otp: otp }).then(
            data => {
                console.log(data)
                if (data.code == 200 && data.result == true) {
                    setDisplay(prev => ({
                        ...prev,
                        email: false,
                        otp: false,
                        inputPassword: true
                    }))
                }
                else {
                    setOtpError("Mã OTP không đúng!")
                }

            }
        )
    }
    return (
        <>
            <div className={cn("container", "d-flex", "card-notification")}>
                {
                    display.email &&
                    <Card sx={{ minWidth: 460 }} className="p-2" >
                        <CardContent>
                            <div className="d-flex align-items-center">
                                <div onClick={() => navigate(-1)} className={cn("back-previous-page")}>
                                    <ArrowBackIcon style={{ fontSize: "26px" }} />
                                </div>
                                <Typography className="text-center col me-4"
                                    style={{ fontSize: "22px" }}
                                >
                                    Đặt lại mật khẩu
                                </Typography>
                            </div>
                            <div className="input mt-4">
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        validateEmail()
                                    }}
                                />
                                {emailError && (<span className={cn("text-danger")}>{emailError}</span>)}

                            </div>
                        </CardContent>
                        <CardActions className="ms-2 me-2 d-flex justify-content-center">
                            <Button
                                disabled={email ? false : true}
                                onClick={() => handleSubmitSendEmail()}
                                className="col text-center"
                                variant="contained"
                                color="success" size="large">
                                Tiếp theo
                            </Button>
                        </CardActions>
                    </Card>
                }
                {
                    display.otp &&
                    <Card sx={{ minWidth: 460 }} className="p-2" >
                        <CardContent>
                            <div className="d-flex align-items-center">
                                <div onClick={() => navigate(-1)} className={cn("back-previous-page")}>
                                    <ArrowBackIcon style={{ fontSize: "26px" }} />
                                </div>
                                <Typography className="text-center col me-4"
                                    style={{ fontSize: "22px" }}
                                >
                                    Nhập mã OTP
                                </Typography>
                            </div>
                            <div className="input mt-4">
                                <Form.Control
                                    type="number"
                                    placeholder="OTP"
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                    }}
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    {otpError && (<span className={cn("text-danger")}>{otpError}</span>)}
                                    <div className="text-primary"
                                        onClick={() => handleSubmitSendEmail()}
                                    >Gửi lại mã OTP?</div>
                                </div>
                            </div>
                        </CardContent>
                        <CardActions className="ms-2 me-2 d-flex justify-content-center">
                            <Button

                                onClick={() => handleSubmitValidateOtp()}
                                className="col text-center"
                                variant="contained"
                                color="success" size="large">
                                Tiếp theo
                            </Button>
                        </CardActions>
                    </Card>
                }
                {
                    display.inputPassword &&
                    <Card sx={{ width: 460 }} className="p-2" >
                        <CardContent>
                            <div className="d-flex align-items-center">
                                <div onClick={() => navigate(-1)} className={cn("back-previous-page")}>
                                    <ArrowBackIcon style={{ fontSize: "26px" }} />
                                </div>
                                <Typography className="text-center col me-4"
                                    style={{ fontSize: "22px" }}
                                >
                                    Nhập mật khẩu mới
                                </Typography>
                            </div>
                            <div className="input mt-4">
                                {/* password */}
                                {/* <div className={cn("mb-5", "row")}> */}
                                <Form.Label for="input-password-register"
                                >
                                    Mật khẩu
                                </Form.Label>
                                <Form.Control
                                    type={isShowPassword}
                                    className={cn("form-control", "input-item", "input-password")}
                                    name="password"
                                    id="input-password-register"
                                    required
                                    onChange={onInputChange}
                                    onBlur={validateInput}
                                />
                                {error.password && (<div className={cn("text-danger")}>{error.password}</div>)}

                                {/* Confirm password */}
                                <Form.Label for="input-confirm-password-register" className="mt-3">
                                    Nhập lại mật khẩu
                                </Form.Label>
                                <Form.Control
                                    type={isShowPassword}
                                    className={cn("form-control", "input-item", "re-input-password")}
                                    name="confirmPassword"
                                    id="input-confirm-password-register"
                                    required
                                    onChange={onInputChange}
                                    onBlur={validateInput}
                                />
                                {error.confirmPassword && (<span className={cn("text-danger")}>{error.confirmPassword}</span>)}
                                {/* Show password */}
                                <div className={cn("mt-2", "row")}>
                                    <label className={cn("col-lg-3", "col-form-label")}></label>
                                    <div className={cn("col-lg-9", "d-flex", "gap-2")}>
                                        <Form.Check
                                            type="checkbox"
                                            className={cn("input-checkbox")}
                                            id="isShowPassword"
                                            name="isShowPassword"
                                            onChange={handleToggle}
                                        />
                                        <Form.Label for="isShowPassword">Hiển thị mật khẩu</Form.Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardActions className="ms-2 me-2 d-flex justify-content-center">
                            <Button

                                onClick={handleSubmitResetPassword}
                                className="col text-center"
                                variant="contained"
                                color="success" size="large">
                                Xác nhận
                            </Button>
                        </CardActions>
                    </Card>
                }
            </div>
        </>
    );
}