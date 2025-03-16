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
import { useContext, useEffect, useState } from "react";
import { searchProduct } from "../../services/productService";
import { Link } from "react-router-dom";
import { routes } from "../../config/routes";
import { AuthContext } from "../../context/AuthContext";
const cn = classNames.bind(style);

export default function Home() {
    //Get product phan bon
    const [productList1, setProductList1] = useState([]);
    const [productList2, setProductList2] = useState([]);
    const [productList3, setProductList3] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    useEffect(() => {
        searchProduct({
            categoryName: "Phân bón"
        }).then(
            data => {
                setProductList1(data.result.data)
            }
        )
        searchProduct({
            categoryName: "Hạt giống"
        }).then(
            data => {
                setProductList2(data.result.data)
            }
        )
        searchProduct({
            categoryName: "Dụng cụ làm vườn"
        }).then(
            data => {
                setProductList3(data.result.data)
            }
        )
    }, [])
    return (
        <>
            {/* <!-- slide --> */}
            <section className={cn("col")}>
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
                        {
                            productList1?.map(
                                (item, index) =>
                                (<div key={item.id} className={cn("col-xl-2", "mb-4", "col-md-3", "col-6")}>
                                    <Card product={item} />
                                </div>
                                )
                            )
                        }

                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <Link to={{ pathname: routes.products, search: "?categoryId=" + productList1[0]?.category.id }} className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </Link>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section >
            {/* <!-- end Phân bón --> */}

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
                        {
                            productList2?.map(
                                (item, index) =>
                                (<div key={item.id} className={cn("col-xl-2", "mb-4", "col-md-3", "col-6")}>
                                    <Card product={item} />
                                </div>
                                )
                            )
                        }



                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <Link to={{ pathname: routes.products, search: "?categoryId=" + productList2[0]?.category.id }} className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </Link>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section>
            {/* <!-- end Hạt giống --> */}
            {/* <!--  Dụng cụ làm vườn --> */}
            <section className={cn("fertilizer-list")}>
                <div className={cn("container")}>
                    {/* <!-- title --> */}
                    <div className={cn("head-inner-title")}>
                        <div className={cn("head-title")}>
                            <h2 className={cn("title")}>Dụng cụ làm vườn</h2>
                        </div>
                        <div className={cn("progress")} style={{ height: 4 }}>
                            <div className={cn("progress-bar")} style={{ width: "30%" }}>
                            </div>
                        </div>
                    </div>
                    {/* <!-- end title --> */}
                    {/* <!-- Hiển thị sản phẩm --> */}
                    <div className={cn("row", "products")}>
                        {
                            productList3?.map(
                                (item, index) =>
                                (<div key={item.id} className={cn("col-xl-2", "mb-4", "col-md-3", "col-6")}>
                                    <Card product={item} />
                                </div>
                                )
                            )
                        }



                        {/* <!-- Xem tất cả button --> */}
                        <div className={cn("footer-view-all")}>
                            <Link to={{ pathname: routes.products, search: "?categoryId=" + productList3[0]?.category.id }} className={cn("view-all", "btn-2")}>
                                <span>
                                    Xem tất cả
                                </span>
                                <ArrowForwardIosIcon />
                            </Link>
                        </div>
                        {/* <!-- End xem tất cả button --> */}
                    </div>
                    {/* <!-- End hiển thị sách --> */}
                </div>
            </section>
            {/* <!-- end Dụng cụ làm vườn --> */}



        </>
    );
}