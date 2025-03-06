import { Avatar } from "@mui/material";
import style from "./Profile.module.css";
import classNames from "classnames/bind";
import avatar from "./../../assets/images/messiprimergol.jpg";
const cn = classNames.bind(style);

export default function Profile() {
    return (
        <>
            <div className={cn("profile")}>
                <div className={cn("head")}>
                    <h2>Hồ sơ của tôi</h2>
                    <p className={cn("des")}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <div className={cn("main-content")}>
                    <form action="" className={cn("row")}>
                        <div className={cn("content", "col-8")}>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Tên đăng nhập</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="text"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        required
                                        disabled
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Tên</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="text"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        required
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Email</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="email"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        required
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Số điện thoại</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="tel"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        required
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Giới tính</label>
                                <div className={cn("col-lg-9", "gender-list")}>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="gender" id="male" />
                                        <label class="form-check-label" for="male">
                                            Nam
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="gender" id="female" />
                                        <label class="form-check-label" for="female">
                                            Nữ
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="gender" id="other" />
                                        <label class="form-check-label" for="other">
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}>Ngày sinh</label>
                                <div className={cn("col-lg-9")}>
                                    <input
                                        type="date"
                                        id="username-input-login"
                                        className={cn("form-control", "input-item")}
                                        name="userName"
                                        required
                                    />

                                </div>
                            </div>
                            <div className={cn("mb-5 row")}>
                                <label for="username-input-login" className={cn("col-lg-3", "col-form-label", "input-title")}></label>
                                <div className={cn("col-lg-9")}>
                                    <button className={cn("btn-3")}>Lưu</button>
                                </div>
                            </div>
                        </div>
                        <div className={cn("avatar", "col-4")}>
                            <Avatar
                                alt="Remy Sharp"
                                src={avatar}
                                sx={{ width: 100, height: 100 }}
                            />
                            <img src={Avatar} className={cn("avatar-img")} alt="" />
                            <button type="button" className={cn("choose-img-btn", "btn-3")}>
                                <label htmlFor="upload-avatar-img-input">
                                    Chọn ảnh
                                </label>
                            </button>
                            <input hidden type="file" name="" id="upload-avatar-img-input" />
                            <div className={cn("note")}>
                                <p>Dụng lượng file tối đa 1 MB</p>
                                <p>Định dạng:.JPEG, .PNG</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}