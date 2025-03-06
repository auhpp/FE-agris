import style from "./Card.module.css";
import fertilizerProductImg from "./../../assets/images/phan-bon.png";
import classNames from "classnames/bind";
const cn = classNames.bind(style);

export default function Card() {
    return (
        <>
            <a href="" className={cn("card")}>
                <div className={cn("card-img")}>
                    <img src={fertilizerProductImg} className={cn("card-img-top")} alt="" />
                </div>
                <div className={cn("card-body", "content")}>
                    <div className={cn("title")}>
                        <h3>Phân lân Lâm Thao - Supe</h3>
                    </div>
                    <div className={cn("price-product")}>
                        <div className={cn("current-price")}>
                            <span>420,000</span>
                            <sup>đ</sup>
                        </div>
                        <div className={cn("discount-price")}>
                            <div className={cn("percent")}>
                                -10%
                            </div>
                            <div className={cn("original-price")}>
                                100.000
                                <sup>đ</sup>
                            </div>
                        </div>
                    </div>
                    {/* <div className={cn("reviews")}>
                                                <div className={cn("star-icon", "text-center")}>
                                                    <i className="fa-regular fa-star"></i>
                                                    <i className="fa-regular fa-star"></i>
                                                    <i className="fa-regular fa-star"></i>
                                                    <i className="fa-regular fa-star"></i>
                                                    <i className="fa-regular fa-star"></i>
                                                    <div className={cn("full-state")}>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                        <i className="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                            </div> */}
                </div>
            </a>
        </>
    );
}