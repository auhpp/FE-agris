import style from "./Cart.module.css";
import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { addToCart, deleteCart, getAllCart } from "../../services/cartService";
import { CircularProgress, Pagination } from "@mui/material";
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
    var [isUpdate, setIsUpdate] = useState(Date.now());
    const cart = useContext(CartContext);
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    var [amount, setAmount] = useState(0);
    var [productPurchaseList, setProductPurchaseList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllCart(currentPage, pageSize);
                setCarts(data.result?.data)
                setTotalPage(data?.totalPage);
                console.log(data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [isUpdate, currentPage])

    //pagination
    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }



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
                        {
                            loading ? (
                                <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                                    <CircularProgress color="success" size="3rem" />
                                </div>
                            ) : (
                                <>
                                    {/* Cart list */}
                                    <div className={cn("cart-list", "row")}>
                                        {
                                            carts?.map(
                                                item => (
                                                    <CartItem
                                                        key={item.id}
                                                        cartId={item?.id}
                                                        onDeleteCart={(cart) => handleDeleteCart(cart)}
                                                        handleNavigateToProduct={(id) => handleNavigateToProduct(id)}
                                                        setProductPurchaseList={setProductPurchaseList}
                                                        productPurchaseList={productPurchaseList}
                                                        setUpdate={setIsUpdate}
                                                        isUpdate={isUpdate}
                                                        setAmount={setAmount}
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
                                </>
                            )
                        }
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
            </div >
        </>
    );
}