import style from "./Cart.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import imgProduct from "./../../assets/images/phan-bon.png";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";
const cn = classNames.bind(style);

export default function Cart() {
    var [quantity, setQuantity] = useState(1);
    var [showVariantModal, setShowVariantModal] = useState(false);
    // minus plus button
    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }
    const handlePlus = () => {
        setQuantity(quantity + 1)
    }
    // end minus plus button
    return (
        <>
            <div className={cn("inner-content")}>
                <div className={cn("head")}>
                    <div className={cn("title")}>
                        <span>
                            Giỏ hàng
                        </span>
                        <span>
                            (5 sản phẩm)
                        </span>
                    </div>
                </div>
                <div className={cn("content", "row")}>
                    <div className={cn("content-left", "col-9")}>
                        <div className={cn("header", "row")}>
                            <div className={cn("form-check", "col-4")}>
                                <input className={cn("form-check-input")} type="checkbox" value="" id="flexCheckDefault" />
                                <label className={cn("form-check-label")} for="flexCheckDefault">
                                    Chọn tất cả (5 sản phẩm)
                                </label>
                            </div>
                            <div className={cn("product-type", "col-3")}>

                            </div>
                            <div className={cn("product-type", "col-2")}>
                                <span>Số lượng</span>
                            </div>
                            <div className={cn("product-type", "col-2")}>
                                <span>Thành tiền</span>
                            </div>
                            <div className={cn("product-type", "col-1")}>

                            </div>
                        </div>
                        <div className={cn("cart-list", "row")}>
                            <div className={cn("cart-item", "row")}>
                                <div className={cn("form-check", "col-4")}>
                                    <input className={cn("form-check-input")} type="checkbox" value="" id="flexCheckDefault" />
                                    {/* card */}
                                    <div className={cn("card", "mb-3")}>
                                        <div className={cn("row g-0")}>
                                            <div className={cn("col-md-4")}>
                                                <img src={imgProduct} className={cn("img-fluid rounded-start")} alt="..." />
                                            </div>
                                            <div className={cn("col-md-8")}>
                                                <div className={cn("card-body")}>
                                                    <h5 className={cn("card-title", 'title')}>Phân bón</h5>
                                                    <div className={cn("price-product")}>
                                                        <div className={cn("current-price")}>
                                                            <span>420,000</span>
                                                            <sup>đ</sup>
                                                        </div>
                                                        <div className={cn("discount-price")}>
                                                            <div className={cn("original-price")}>
                                                                100.000
                                                                <sup>đ</sup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end card */}
                                </div>
                                <div className={cn("product-type", "col-3")}>
                                    <button onClick={() => { setShowVariantModal(!showVariantModal) }} className={cn("btn-product-type")}>
                                        <span>
                                            Phân loại hàng:
                                        </span>
                                        <ArrowDropDownIcon />
                                        <div className={cn("value")}>
                                            50kg
                                        </div>
                                    </button>
                                    {showVariantModal && (
                                        <div className={cn("variant-modal")}>
                                            <div className={cn("variant-name")}>
                                                Loại hàng:
                                            </div>
                                            <div className={cn("variant-list")}>
                                                <div className={cn("variant-item")}>
                                                    50kg
                                                </div>
                                                <div className={cn("variant-item")}>
                                                    30kg
                                                </div>
                                            </div>
                                            <div className={cn("btn-bottom")}>
                                                <div class="modal-footer">
                                                    <button type="button" class={cn("btn-8", "me-2")} data-bs-dismiss="modal">Hủy</button>
                                                    <button type="button" class={cn("btn-7")}>Thêm</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div className={cn("col-2")}>
                                    <div className={cn("quantity-product")}>
                                        <RemoveIcon onClick={handleMinus} />
                                        <input type="number" value={quantity} />
                                        <AddIcon onClick={handlePlus} />
                                    </div>
                                </div>
                                <div className={cn("unit-price", "col-2")}>
                                    <span>
                                        40000 đ
                                    </span>
                                </div>
                                <div className={cn("delete-icon", "col-1")}>
                                    <DeleteIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cn("col-3")}>
                        <div className={cn("content-right")}>
                            <div className={cn("money")}>
                                <span>Thành tiền</span>
                                <span>0đ</span>
                            </div>
                            <div className={cn("amount")}>
                                <span>Tổng số tiền (gồm VAT)</span>
                                <span className={cn("price")}>0đ</span>
                            </div>
                            <button className={cn("btn-3", "btn-payment")}>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}