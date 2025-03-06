import "./Footer.css";
import { BsFacebook, BsInstagram, BsYoutube, BsTwitterX,
    BsEnvelopeFill, BsFillTelephoneFill, BsFillGeoAltFill   

} from "react-icons/bs";
import logo from "./../../../assets/images/logo.png";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="row inner-wrap-top">
                        <div className="col-lg-3 col-xl-4 col-sm-6">
                            <div className="info-footer">
                                <div className="logo">
                                    <img src={logo} className="logo-img" alt="" />
                                </div>
                                <p className="desc display-text-14">
                                    Agris – Đồng hành cùng nhà nông với giải pháp vật tư nông nghiệp chất lượng và tiện lợi. Cung cấp sản phẩm uy tín, dịch vụ tận tâm, giúp bạn gieo trồng hiệu quả và bội thu mùa vụ!
                                </p>
                                <div className="contact display-text-14">
                                    <div className="contact-item address">
                                        <BsFillGeoAltFill className="contact-icon"/>
                                        <span>Châu Thành - Hậu Giang</span>
                                    </div>
                                    <div className="contact-item email">
                                       <BsEnvelopeFill className="contact-icon"/>
                                        <span>cskhagris@gmail.com</span>
                                    </div>
                                    <div className="contact-item phone">
                                        <BsFillTelephoneFill className="contact-icon"/>
                                        <span>0935200411</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xl-2 col-sm-6">
                            <div className="info-footer">
                                <h3 className="title">Dịch vụ</h3>
                                <ul className="list-service">
                                    <li className="service-item ">
                                        <a href="#" className="display-text-14">Giới thiệu về công ty</a>
                                    </li>
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Chính sách bảo mật thông tin</a>
                                    </li>
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Điều khoản sử dụng</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xl-3 col-sm-6">
                            <div className="info-footer">
                                <h3 className="title">Tài khoản của tôi</h3>
                                <ul className="list-service">
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Đăng nhập/Tạo mới tài khoản
                                        </a>
                                    </li>
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Thay đổi địa chỉ khách hàng</a>
                                    </li>
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Chi tiết tài khoản</a>
                                    </li>
                                    <li className="service-item">
                                        <a href="#" className="display-text-14">Lịch sử đặt hàng</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-xl-3 col-sm-6">
                            <div className="info-footer">
                                <div className="send-email">
                                    <h3 className="title">Đăng ký nhận bản tin</h3>
                                    <form action="#" className="form-send-email" method="post" target="_blank">
                                        <input type="email" name="email-user" id="" className="input-email"
                                            placeholder="Nhập địa chỉ email của bạn" />
                                        <button className="btn-1 btn-subscribe">Đăng ký</button>
                                    </form>
                                </div>
                                <div className="social-links">
                                    <h3>Theo dõi chúng tôi trên</h3>
                                    <div className="socials">
                                        <a href="#" className="social">
                                            <BsFacebook className="social-icon"/>
                                        </a>
                                        <a href="#" className="social">
                                            <BsInstagram className="social-icon"/>
                                        </a>
                                        <a href="#" className="social">
                                            <BsYoutube className="social-icon"/>
                                        </a>
                                        <a href="#" className="social">
                                            <BsTwitterX className="social-icon"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row inner-wrap-bottom">
                        <div className="col-12">
                            <div className="pay-list">
                                <div className="pay-item momo">
                                    <img src="assets/img/momo.png" alt="" />
                                </div>
                                <div className="pay-item zalo-pay">
                                    <img src="assets/img/zalo-pay.png" alt="" />
                                </div>
                                <div className="pay-item ninjavan">
                                    <img src="assets/img/paypal.png" alt="" />
                                </div>
                                <div className="pay-item vnpay">
                                    <img src="assets/img/vnpay.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row copy-right">
                        <div className="col-12">
                            <p>© 2025 - Bản quyền thuộc về Công ty TNHH Agris</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}