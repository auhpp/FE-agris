import style from "./Cart.module.css";
import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { addToCart, deleteCart, getAllCart } from "../../services/cartService";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import CartContext from "../../context/CartContext";
import { VND } from "../../utils/formatNumber";
import CartItem from "../../components/CartItem/indx";

const cn = classNames.bind(style);

export default function Cart() {
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    var [isUpdate, setIsUpdate] = useState(false);
    const cart = useContext(CartContext);
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    var [amount, setAmount] = useState(0);
    var [productPurchaseList, setProductPurchaseList] = useState([]);

    // Get cart
    useEffect(
        () => {
            getAllCart(currentPage, pageSize).then(
                data => {
                    setCarts(data.result?.data)
                    setTotalPage(data?.totalPage);
                    console.log("fetch")
                }
            )
        }, [isUpdate, currentPage]
    )

    //pagination
    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }

    // minus and plus button
    const handleMinus = (item) => {
        if (item.quantity > 1) {
            const cartRequest = {
                productVariantId: item.variant.id,
                quantity: item.quantity - 1
            }
            addToCart(cartRequest).then(
                data => {
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
        addToCart(cartRequest).then(
            data => {
                setIsUpdate(!isUpdate)
            }
        )
    }
    // end minus and plus button

    //Navigate product detail
    const handleNavigateToProduct = (id) => {
        navigate(routes.product + "/" + id)
    }

    //Delete cart
    const handleDeleteCart = (item) => {
        deleteCart(item.id)
        setCarts(
            carts.filter(a => a.id != item.id)
        )
        cart.setUpdateCart(!cart.updateCart)
    }

    useEffect(
        () => {
            var sum = productPurchaseList.reduce(
                (a, currentValue) => {
                    return a + currentValue.quantity * currentValue.variant.sellingPrice;
                }, 0
            );
            setAmount(
                sum
            )
        }, [productPurchaseList]
    )

    //Calculation amount
    const handleClickCart = (product, e) => {
        if (e.target.checked) {
            setProductPurchaseList(
                [
                    ...productPurchaseList,
                    product
                ]
            )
        }
        else {
            setProductPurchaseList(
                productPurchaseList.filter(
                    a => a.id != product.id
                )
            )
        }
    }

    const changeVariant = (request) => {
        console.log("re", request)
        // console.log("request", cartRequest)
        addToCart(request).then(
            data => {
                setIsUpdate(!isUpdate)
            }
        )
    }

    return (
        <>
            <div className={cn("inner-content")}>
                {/* head */}
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
                {/* main content */}
                <div className={cn("content", "row")}>
                    {/* content left */}
                    <div className={cn("content-left", "col-9")}>
                        {/* header */}
                        <div className={cn("header", "row")}>
                            <div className={cn("form-check", "col-4")}>
                                <span>
                                    Sản phẩm
                                </span>
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
                        {/* Cart list */}
                        <div className={cn("cart-list", "row")}>
                            {
                                carts?.map(
                                    item => (
                                        <CartItem
                                            cart={item}
                                            // handleClickVariant={(product, cart) => handleClickVariant(product, cart)}
                                            handleMinus={(cart) => handleMinus(cart)}
                                            handlePlus={(cart) => handlePlus(cart)}
                                            onDeleteCart={(cart) => handleDeleteCart(cart)}
                                            handleNavigateToProduct={(id) => handleNavigateToProduct(id)}
                                            handleClickCart={(cart, e) => handleClickCart(cart, e)}
                                            setUpdate={setIsUpdate}
                                            isUpdate={isUpdate}
                                            changeVariant={changeVariant}
                                        />

                                    )
                                )
                            }
                            {/* pagination */}
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
                    {/* end content left */}
                    {/* content right */}
                    <div className={cn("col-3")}>
                        <div className={cn("content-right")}>
                            <div className={cn("money")}>
                                <span>Thành tiền</span>
                                <span>{VND.format(amount)} đ</span>
                            </div>
                            <div className={cn("amount")}>
                                <span>Tổng số tiền</span>
                                <span className={cn("price")}>{VND.format(amount)} đ</span>
                            </div>
                            <button className={cn("btn-3", "btn-payment")}
                                onClick={() => {
                                    productPurchaseList.length != 0 && navigate(routes.order, { state: { productPurchaseList } })
                                }}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}