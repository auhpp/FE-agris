import style from "./Card.module.css";
import classNames from "classnames/bind";
import {VND} from "../../utils/formatNumber";
const cn = classNames.bind(style);

export default function Card({ product }) {

   

    return (
        <>
            <a href="" className={cn("card")}>
                <div className={cn("card-img")}>
                    <img src={product.thumbnail} className={cn("card-img-top")} alt="" />
                </div>
                <div className={cn("card-body", "content")}>
                    <div className={cn("title")}>
                        <h3>{product.name}</h3>
                    </div>
                    <div className={cn("price-product")}>
                        <div className={cn("current-price")}>
                            <span>{VND.format(product.variants[0].price)}</span>
                            <sup>đ</sup>
                        </div>
                        {product.discount != null &&
                            (
                                <div className={cn("discount-price")}>
                                    <div className={cn("percent")}>
                                        {product.discount + product.discountUnit}
                                    </div>
                                    <div className={cn("original-price")}>
                                        {product.oldPrice}
                                        <sup>đ</sup>
                                    </div>
                                </div>
                            )
                        }
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