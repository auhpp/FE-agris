import style from "./Card.module.css";
import classNames from "classnames/bind";
import { VND } from "../../utils/formatNumber";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
const cn = classNames.bind(style);

export default function Card({ product }) {
    const navigate = useNavigate();
    return (
        <>
            <div onClick={() => {
                navigate(routes.product + "/" + product.id)
            }} className={cn("card")}>
                {/* card image */}
                <div className={cn("card-img")}>
                    <img src={product.thumbnail} className={cn("card-img-top")} alt="" />
                </div>
                {/* card content */}
                <div className={cn("card-body", "content")}>
                    <div className={cn("title")}>
                        <h3>{product.name}</h3>
                    </div>
                    <div className={cn("price-product")}>
                        {/* current price */}
                        <div className={cn("current-price")}>
                            <span>{VND.format(product.variants[0].price)}</span>
                            <sup>đ</sup>
                        </div>
                        {/* price discount */}
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
                </div>
            </div>
        </>
    );
}