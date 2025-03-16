import style from "./Cart.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import imgProduct from "./../../assets/images/phan-bon.png";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { useContext, useEffect, useState } from "react";
import { addToCart, deleteCart, getAllCart } from "../../services/cartService";
import { Button, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import CartContext from "../../components/CartContext";
const cn = classNames.bind(style);

export default function Cart() {
    var [quantity, setQuantity] = useState(1);
    var [showVariantModal, setShowVariantModal] = useState(false);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    var [isUpdate, setIsUpdate] = useState(false);

    const cart = useContext(CartContext);

    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    useEffect(
        () => {
            getAllCart(currentPage, pageSize).then(
                data => {
                    setCarts(data.result.data)
                    setTotalPage(data.totalPage);
                }
            )
        }, [isUpdate, currentPage]
    )



    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }

    // minus plus button
    const handleMinus = (item) => {
        if (item.quantity > 1) {
            const cartRequest = {
                productVariantId: item.variant.id,
                quantity: item.quantity - 1
            }
            addToCart(cartRequest).then(
                data => {
                    console.log(data)
                    setIsUpdate(!isUpdate)
                }
            )
        }
    }
    const handlePlus = (item) => {
        const newQuantity = item.quantity + 1;
        const cartRequest = {
            productVariantId: item.variant.id,
            quantity: newQuantity
        }
        console.log("rq", cartRequest)
        addToCart(cartRequest).then(
            data => {
                console.log(data)
                setIsUpdate(!isUpdate)
            }
        )
    }
    // end minus plus button

    const handleNavigateToProduct = (id) => {
        navigate(routes.product + "/" + id)
    }

    const handleDeleteCart = (item) => {
        deleteCart(item.id)
        setCarts(
            carts.filter(a => a.id != item.id)
        )
        cart.setUpdateCart(!cart.updateCart)
    }

    const handleClickVariant = (variant, cart) => {
        const cartRequest = {
            id: cart.id,
            productVariantId: variant.id,
            quantity: cart.quantity
        }
        console.log("rq", cartRequest)
        addToCart(cartRequest).then(
            data => {
                console.log(data)
                setIsUpdate(!isUpdate)
            }
        )
    }
    console.log(carts)

    const handleShowVariantModal = (id) => {
        var modal = document.getElementById(id + "variantModal");
        console.log(modal.style.display == "none")
        if (modal.style.display === "none") {
            modal.style.display = "block";
        }
        else {
            modal.style.display = "none";

        }
        setIsUpdate(!isUpdate)
    }


    return (
        <>
            <div className={cn("inner-content")}>
                <div className={cn("head")}>
                    <div className={cn("title")}>
                        <span>
                            Giỏ hàng
                        </span>
                        <span>
                            ({cart.cartSize} sản phẩm)
                        </span>
                    </div>
                </div>
                <div className={cn("content", "row")}>
                    <div className={cn("content-left", "col-9")}>
                        <div className={cn("header", "row")}>
                            <div className={cn("form-check", "col-4")}>
                                <input className={cn("form-check-input")} type="checkbox" value="" id="flexCheckDefault" />
                                <label className={cn("form-check-label")} for="flexCheckDefault">
                                    Chọn tất cả ({cart.cartSize} sản phẩm)
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
                            {
                                carts.map(
                                    item => (
                                        <div
                                            key={item.id}
                                            className={cn("cart-item", "row")}>
                                            <div className={cn("form-check", "col-4")}>
                                                <input className={cn("form-check-input")}
                                                    type="checkbox" value="" id="flexCheckDefault" />
                                                {/* card */}
                                                <div className={cn("card", "mb-3")}>
                                                    <div className={cn("row g-0")}>
                                                        <div
                                                            onClick={() => handleNavigateToProduct(item.product?.id)}
                                                            className={cn("col-md-4")}>
                                                            <img
                                                                src={item.product.thumbnail}
                                                                className={cn("img-fluid", "rounded-start", "img-product")} alt="..." />
                                                        </div>
                                                        <div className={cn("col-md-8")}>
                                                            <div className={cn("card-body")}>
                                                                <h5
                                                                    onClick={() => handleNavigateToProduct(item.product?.id)}
                                                                    className={cn("card-title", 'title', "product-title")}>
                                                                    {item.product.name}
                                                                </h5>
                                                                <div className={cn("price-product")}>
                                                                    <div className={cn("current-price")}>
                                                                        <span>{item.variant?.price}</span>
                                                                        <sup>đ</sup>
                                                                    </div>
                                                                    {
                                                                        item.variant?.discount != null && (
                                                                            <div className={cn("discount-price")}>
                                                                                <div className={cn("original-price")}>
                                                                                    {item.variant.oldPrice}
                                                                                    <sup>đ</sup>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* end card */}
                                            </div>
                                            <div className={cn("product-type", "col-3")}>
                                                <button onClick={(e) => { handleShowVariantModal(item.id) }} className={cn("btn-product-type")}>
                                                    <span>
                                                        Phân loại hàng:
                                                    </span>
                                                    <ArrowDropDownIcon />
                                                    <div className={cn("value")}>
                                                        {item.variant?.variantValues[0].value}
                                                    </div>
                                                </button>
                                                <div className={cn("variant-modal")}
                                                    style={{ display: "none" }}
                                                    id={item.id + "variantModal"}>
                                                    <div className={cn("variant-name")}>
                                                        {item.product.variants[0].variantValues[0].name}
                                                    </div>
                                                    <div className={cn("variant-list")}>
                                                        {
                                                            item.product.variants.map(
                                                                variant => (
                                                                    <Button
                                                                        key={variant.id}
                                                                        className={cn("variant-item")}
                                                                        onClick={() => handleClickVariant(variant, item)}
                                                                        color="success"
                                                                        variant={
                                                                            variant.id == item.variant.id ?
                                                                                "contained" : "outlined"
                                                                        }>
                                                                        {variant.variantValues[0].value}
                                                                    </Button>

                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className={cn("btn-bottom")}>
                                                        <div class="modal-footer">
                                                            <button type="button"
                                                                style={{ fontSize: 14 }}
                                                                onClick={(e) => { handleShowVariantModal(item.id) }}
                                                                class={cn("btn-8", "me-2")}>Hủy</button>
                                                            {/* <button type="button" class={cn("btn-7")}>Thêm</button> */}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={cn("col-2")}>
                                                <div className={cn("quantity-product")}>
                                                    <RemoveIcon onClick={() => handleMinus(item)} />
                                                    <input type="number" value={item.quantity} />
                                                    <AddIcon onClick={() => handlePlus(item)} />
                                                </div>
                                            </div>
                                            <div className={cn("unit-price", "col-2")}>
                                                <span>
                                                    {item.quantity * item.variant?.price}đ
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => handleDeleteCart(item)}
                                                className={cn("delete-icon", "col-1")}>
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    )
                                )
                            }
                            <Pagination
                                count={totalPage}
                                size="large"
                                page={currentPage}
                                shape="rounded"
                                color="success"
                                onChange={handleChangePagination}
                                className={cn("pagination")}
                            />
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