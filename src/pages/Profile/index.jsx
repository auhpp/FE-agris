import { Avatar } from "@mui/material";
import style from "./Profile.module.css";
import classNames from "classnames/bind";
import { use, useEffect, useState } from "react";
import { getUserInfo, updateUser, uploadAvatar } from "../../services/userService";
const cn = classNames.bind(style);

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isPhoneNumber = (phoneNumber) =>
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phoneNumber);

const isFullNameValid = (fullName) =>
    /^[a-zA-Z0-9À-ỹ ]+$/.test(fullName)
const isValidImage = (img) => {
    var allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    var extension = img.name.split('.').pop().toLowerCase();
    if (allowedExtensions.indexOf(extension) !== -1 && img.size <= 1048576) {
        return true;
    }
    return false;
}
export default function Profile() {

    const [user, setUser] = useState();
    useEffect(
        () => {
            getUserInfo().then(
                data => {
                    setUser(data.result);
                }
            )
        }, []
    )
    console.log(user)
    const [userInput, setUserInput] = useState({
        id: "",
        fullName: "",
        userName: "",
        avatar: "",
        phoneNumber: "",
        email: "",
        gender: "",
        dateOfBirth: "",
        role: ""
    });
    var [previewAvatar, setPreviewAvatar] = useState("");

    useEffect(() => {
        if (user) {
            setUserInput({
                id: user.id || "",
                fullName: user.fullName || "",
                userName: user.userName || "",
                avatar: user.avatar || "",
                phoneNumber: user.phoneNumber || "",
                email: user.email || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth.substr(0, 10) || "",
                role: user.role || ""
            });
            setPreviewAvatar(user.avatar)
        }
    }, [user]);
    console.log(userInput)
    var [userError, setUserError] = useState({
        fullName: "",
        avatar: "",
        phoneNumber: "",
        email: "",
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setUserError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'fullName':
                    if (!isFullNameValid(value)) {
                        stateObj[name] = 'Vui lòng nhập tên không chứa ký tự đặc biệt';
                    }
                    break;

                case 'phoneNumber':
                    console.log(isPhoneNumber(value))
                    if (!isPhoneNumber(value)) {
                        stateObj[name] = 'Vui lòng đúng định dạng số điện thoại.';
                    }
                    break;
                case 'email':
                    if (!isEmail(value)) {
                        stateObj[name] = 'Vui lòng nhập đúng định dạng email.';
                    }
                    break;
                case 'avatar':
                    if (!isValidImage(e.target.files[0])) {
                        stateObj[name] = 'Vui lòng chọn ảnh đúng định dạng và kích thước';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    const handleChangeAvatar = (e) => {
        console.log(isValidImage(e.target.files[0]))
        if (isValidImage(e.target.files[0])) {
            setUserInput(
                (prev) => ({
                    ...prev,
                    avatar: e.target.files[0]
                })
            )
            setPreviewAvatar(
                URL.createObjectURL(e.target.files[0])
            )
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var userRequest = {};
        userRequest.id = user.id;
        userRequest.userName = user.userName;
        userRequest.password = user.password;
        var avatarRequest = "";
        var ok = true;
        if (userError.fullName.length != 0 || userError.phoneNumber != 0 || userError.email.length != 0) {
            ok = false;
        }
        else {
            userRequest.fullName = userInput.fullName === "" ? user.fullName : userInput.fullName;
            userRequest.phoneNumber = userInput.phoneNumber === "" ? user.phoneNumber : userInput.phoneNumber;
            userRequest.email = userInput.email === "" ? user.email : userInput.email;
            console.log("input", userInput)
            console.log(userRequest)

        }
        userRequest.gender = userInput.gender == "" ? user.gender : userInput.gender;
        userRequest.dateOfBirth = userInput.dateOfBirth == "" ? user.dateOfBirth : userInput.dateOfBirth;
        if (userInput.avatar) {
            avatarRequest = userInput.avatar;
        }
        else {
            userRequest.avatar = user.avatar;
        }
        if (ok) {
            //call api
            console.log(userRequest)
            updateUser(userRequest).then(
                data => {
                    console.log(data)
                    if (avatarRequest != "") {
                        uploadAvatar(avatarRequest, user.id).then(
                            data => console.log(data)
                        )
                    }
                    setUser(data.result)
                }
            )
        }


    }
    return (
        <>
            <div className={cn("profile")}>
                <div className={cn("head")}>
                    <h2>Hồ sơ của tôi</h2>
                    <p className={cn("des")}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <div className={cn("main-content")}>
                    <form onSubmit={handleSubmit} action="" className={cn("row")}>
                        <div className={cn("content", "col-8")}>
                            <div className={cn("mb-5 row")}>
                                <label
                                    for="username-input-login"
                                    className={cn("col-lg-3", "col-form-label", "input-title")}>
                                    Tên đăng nhập
                                </label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="text"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        disabled
                                        value={user?.userName}
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="fullName-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Tên</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="text"
                                        id="fullName-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="fullName"
                                        onChange={onInputChange}
                                        value={userInput.fullName}

                                    />

                                    {userError.fullName && (<span className={cn("text-danger")}>{userError.fullName}</span>)}

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label
                                    for="email-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Email</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="email"
                                        id="email-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="email"
                                        onChange={onInputChange}
                                        value={userInput.email}

                                    />
                                    {userError.email && (<span className={cn("text-danger")}>{userError.email}</span>)}

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="phoneNumber-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Số điện thoại</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="tel"
                                        id="phoneNumber-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="phoneNumber"
                                        onChange={onInputChange}
                                        value={userInput.phoneNumber}
                                    />
                                    {userError.phoneNumber && (<span className={cn("text-danger")}>{userError.phoneNumber}</span>)}


                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="" className={cn("col-lg-3", "col-form-label", "input-title")}>Giới tính</label>
                                <div className={cn("col-lg-9", "gender-list")}>
                                    <div class="form-check">

                                        <input checked={
                                            userInput.gender == "MALE" ? true : false
                                        } class="form-check-input"
                                            value={"MALE"}
                                            type="radio" name="gender" id="male"
                                            onChange={onInputChange}
                                        />
                                        <label class="form-check-label" for="male">
                                            Nam
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            checked={
                                                userInput.gender == "FEMALE" ? true : false
                                            }
                                            value={"FEMALE"}
                                            class="form-check-input" type="radio" name="gender" id="female"
                                            onChange={onInputChange}
                                        />
                                        <label class="form-check-label" for="female">
                                            Nữ
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input
                                            checked={
                                                userInput.gender == "OTHER" ? true : false
                                            }
                                            value={"OTHER"}
                                            class="form-check-input" type="radio" name="gender" id="other"
                                            onChange={onInputChange}
                                        />
                                        <label class="form-check-label" for="other">
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label
                                    for="dateOfBirth-input-login"
                                    className={cn("col-lg-3", "col-form-label", "input-title")}>
                                    Ngày sinh</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="date"
                                        id="dateOfBirth-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="dateOfBirth"
                                        onChange={onInputChange}
                                        value={userInput.dateOfBirth}
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}></label>
                                <div className={cn("col-lg-9")}>
                                    <button

                                        className={cn("btn-3")}>Lưu</button>
                                </div>
                            </div>
                        </div>
                        <div className={cn("avatar", "col-4")}>
                            <Avatar
                                alt="Remy Sharp"
                                src={previewAvatar}
                                sx={{ width: 100, height: 100 }}
                            />
                            {/* <img src={previewAvatar} className={cn("avatar-img")} alt="" /> */}
                            <button type="button" className={cn("choose-img-btn", "btn-3")}>
                                <label htmlFor="upload-avatar-img-input">
                                    Chọn ảnh
                                </label>
                            </button>
                            <input hidden type="file" name="avatar" id="upload-avatar-img-input"
                                onChange={(e) => {
                                    handleChangeAvatar(e)
                                    validateInput(e)
                                }}
                                accept="image/png, image/jpeg"
                            />
                            <div className={cn("note")}>
                                <p>Dụng lượng file tối đa 1 MB</p>
                                <p>Định dạng:.JPEG, .PNG</p>
                            </div>
                            {userError.avatar && (<span className={cn("text-danger")}>{userError.avatar}</span>)}

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}