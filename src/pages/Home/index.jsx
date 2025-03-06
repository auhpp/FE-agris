import style from "./Home.module.css";
import classNames from "classnames/bind";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import slide1 from "./../../assets/images/banner-1.png";
import slide2 from "./../../assets/images/banner-2.png";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from "../../components/Card";
const cn = classNames.bind(style);

export default function Home() {
    return (
        <>
            {/* <!-- slide --> */}
            <section className={cn("col-9", "offset-3")}>
                <Swiper
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        dynamicBullets: true,
                    }}
                    loop={true}
                    modules={[Pagination, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <img src={slide1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={slide2} alt="" />
                    </SwiperSlide>

                </Swiper>
            </section>
            {/* <!-- end slide --> */}

            {/* <!-- tag --> */}
            <section className={cn("tags")}>
                <div className={cn("container")}>
                    <div className={cn("row", "tag-list")}>
                        <div className={cn("col-xl-3", "col-md-6")}>
                            <div className={cn("tag")}>
                                <div className={cn("icon")}>
                                    <LocalShippingIcon />
                                </div>
                                <div className={cn("content")}>
                                    <h4>Miễn phí vận chuyển</h4>
                                    <span>Đơn hàng trên 1 triệu</span>
                                </div>
                            </div>
                        </div>
                        <div className={cn("col-xl-3", "col-md-6")}>
                            <div className={cn("tag")}>
                                <div className={cn("icon")}>
                                    <RefreshIcon />
                                </div>
                                <div className={cn("content")}>
                                    <h4>Đảm bảo hoàn tiền</h4>
                                    <span>Hoàn tiền 100%</span>
                                </div>
                            </div>
                        </div>
                        <div className={cn("col-xl-3", "col-md-6")}>
                            <div className={cn("tag")}>
                                <div className={cn("icon")}>
                                    <InventoryIcon />
                                </div>
                                <div className={cn("content")}>
                                    <h4>Dễ dàng đổi trả</h4>
                                    <span>Trong vòng 10 ngày</span>
                                </div>
                            </div>
                        </div>
                        <div className={cn("col-xl-3", "col-md-6")}>
                            <div className={cn("tag")}>
                                <div className={cn("icon")}>
                                    <EventAvailableIcon />
                                </div>
                                <div className={cn("content")}>
                                    <h4>Ưu đãi hàng ngày</h4>
                                    <span>Khi bạn đăng nhập</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- end tag --> */}

            {/* <!--  Phân bón --> */}
            <section className={cn("fertilizer-list")}>
                <div className={cn("container")}>
                    {/* <!-- title --> */}
                    <div className={cn("head-inner-title")}>
                        <div className={cn("head-title")}>
                            <h2 className={cn("title")}>Phân bón</h2>
                        </div>
                        <div className={cn("progress")} style={{ height: 4 }}>
                            <div className={cn("progress-bar")} style={{ width: "30%" }}>
                            </div>
                        </div>
                    </div>
                    {/* <!-- end title --> */}
                    {/* <!-- Hiển thị sản phẩm --> */}
                    <div className={cn("row", "products")}>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>


                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <a href="" className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </a>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section>
            {/* <!-- end Phân bón --> */}

            {/* <!--  Thuốc bảo vệ thực vật --> */}
            <section className={cn("fertilizer-list")}>
                <div className={cn("container")}>
                    {/* <!-- title --> */}
                    <div className={cn("head-inner-title")}>
                        <div className={cn("head-title")}>
                            <h2 className={cn("title")}>Thuốc bảo vệ thực vật</h2>
                        </div>
                        <div className={cn("progress")} style={{ height: 4 }}>
                            <div className={cn("progress-bar")} style={{ width: "30%" }}>
                            </div>
                        </div>
                    </div>
                    {/* <!-- end title --> */}
                    {/* <!-- Hiển thị sản phẩm --> */}
                    <div className={cn("row", "products")}>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>


                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <a href="" className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </a>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section>
            {/* <!-- end Thuốc bảo vệ thực vậ --> */}
            {/* <!--  Hạt giống --> */}
            <section className={cn("fertilizer-list")}>
                <div className={cn("container")}>
                    {/* <!-- title --> */}
                    <div className={cn("head-inner-title")}>
                        <div className={cn("head-title")}>
                            <h2 className={cn("title")}>Hạt giống</h2>
                        </div>
                        <div className={cn("progress")} style={{ height: 4 }}>
                            <div className={cn("progress-bar")} style={{ width: "30%" }}>
                            </div>
                        </div>
                    </div>
                    {/* <!-- end title --> */}
                    {/* <!-- Hiển thị sản phẩm --> */}
                    <div className={cn("row", "products")}>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>
                        <div className={cn("col-xl-2", "col-md-3", "col-6")}>
                            <Card />
                        </div>


                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <a href="" className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </a>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section>
            {/* <!-- end Hạt giống --> */}



        </>
    );
}