import { useContext, useEffect, useState } from "react";
import style from "./ProductDetail.module.css";
import classNames from "classnames/bind";
import { findById, searchProduct } from "../../services/productService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { VND } from "../../utils/formatNumber";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InboxIcon from '@mui/icons-material/Inbox';
import Button from '@mui/material/Button';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { LinearProgress, Pagination, Rating } from "@mui/material";
import Card from "../../components/Card";
import { addToCart } from "../../services/cartService";
import CartContext from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { routes } from "../../config/routes";
import { convertToVariantType, findUnavailableCombinations, getVariantIdSelected } from "../../utils/variant";
import Variant from "../../components/Variant";
const cn = classNames.bind(style);

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const cart = useContext(CartContext);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    var [quantity, setQuantity] = useState(1);
    const [currentProduct, setCurrentProduct] = useState();

    const [attribute, setAttribute] = useState([]);
    const [productRelated, setProductRelated] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedVariants, setSelectedVariants] = useState({})
    const [variantTypes, setVariantTypes] = useState({});
    const [unavailableComb, setUnavailableComb] = useState()
    // minus and plus button
    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }
    const handlePlus = () => {
        setQuantity(quantity + 1)
    }
    // end minus and plus button

    //Get product
    useEffect(
        () => {
            findById(id).then(
                data => {
                    console.log(data.result)
                    setProduct(data.result)
                    setVariantTypes(convertToVariantType(data.result?.variants))
                }
            )
        }, []
    )

    useEffect(
        () => {
            setUnavailableComb(
                findUnavailableCombinations(variantTypes, product?.variants)
            )
            var variantFirst = product?.variants[0];
            var selectVariant = {}
            variantFirst?.variantValues.forEach(
                a => {
                    selectVariant[a.name] = a.value
                }
            )
            setSelectedVariants(selectVariant)
        }, [variantTypes]
    )
    console.log("variant type", variantTypes)
    //Set current product variant 
    useEffect(
        () => {
            var selectedVariantId = getVariantIdSelected(product?.variants, selectedVariants);
            var currentVariantProduct = product?.variants.find(a => a.id == selectedVariantId)
            setCurrentProduct(currentVariantProduct)
        }, [selectedVariants, product]
    )


    //variant
    const handleClickVariant = (variant) => {
        if (product) {
            product?.variants.forEach(element => {
                if (element.id == variant.id) {
                    setCurrentProduct(element);
                }
            });
        }
    }

    //Get attribute list
    useEffect(() => {
        if (product) {
            var attrs = [];
            product?.attributes.forEach((it) => {
                let attribute = attrs.find(v => v.name === it.name);
                if (!attribute) {
                    attribute = { id: it.id, name: it.name, values: [] };
                    attrs.push(attribute);
                }

                attribute.values.push(it.value);
            })
            setAttribute(attrs);
        }
    }, [product]);

    //Product related list
    useEffect(
        () => {
            if (product) {
                const categoryId = product?.category.id;
                searchProduct({ categoryId, currentPage, pageSize }).then(
                    data => {
                        if (data.result.data) {
                            setProductRelated(data.result.data)
                            setTotalPage(data.result.totalPage)
                            setPageSize(data.result.pageSize)
                        }
                    }
                );
            }
        },
        [product, currentPage]
    )

    //pagination
    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }


    //Cart
    const handleAddToCart = () => {
        if (token) {
            var cartRequest = {
                id: null,
                productVariantId: currentProduct?.id,
                quantity: quantity
            }
            addToCart(cartRequest).then(
                data => {
                    cart.setUpdateCart(!cart.updateCart)
                }
            )
        }
        else {
            navigate(routes.login)
        }
    }

    return (
        <>
            <div>
                {/* Breadcrumb */}
                <div className={cn("container")}>
                    <div className={cn("row")}>
                        <section className={cn("breadcrumb-divider", "breadcrumb-divider-cus", "col-lg-6")}>
                            <div className={cn("container")}>
                                <nav aria-label="breadcrumb">
                                    <ol className={cn("breadcrumb", "breadcrumb-cus")}>
                                        <li className={cn("breadcrumb-item", "breadcrumb-item-cus")}><Link to={"/"}>Trang chủ</Link></li>
                                        <li className={cn("breadcrumb-item", "breadcrumb-item-cus", "active")} aria-current="page">
                                            <a>{product?.category.name}</a>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Product Detail */}
                <section className={cn("product-detail")}>
                    <div className={cn("container")}>
                        <div className={cn("row")}>
                            {/* Product Images */}
                            <div className={cn("col-lg-5")}>
                                <div className={cn("product-imgs")}>
                                    <Swiper
                                        style={{
                                            '--swiper-navigation-color': '#c5c5c5',
                                            '--swiper-pagination-color': '#c5c5c5',
                                        }}
                                        spaceBetween={10}
                                        navigation={true}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className={cn("mySwiper2", "swiper-cus")}
                                    >
                                        {
                                            product?.images.map(
                                                (item, index) => (
                                                    <SwiperSlide key={item.id} className={cn("swiper-slide-cus")}>
                                                        <img src={item.filePath} />
                                                    </SwiperSlide>
                                                )
                                            )
                                        }

                                    </Swiper>
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        slidesPerView={4}
                                        freeMode={true}
                                        watchSlidesProgress={true}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className={cn("mySwiper", "swiper-bottom")}
                                    >
                                        {
                                            product?.images.map(
                                                (item, index) => (
                                                    <SwiperSlide key={item.id}>
                                                        <img src={item.filePath} />
                                                    </SwiperSlide>
                                                )
                                            )
                                        }

                                    </Swiper>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className={cn("col-lg-7")}>
                                {/* info */}
                                <div className={cn("detail-content")}>
                                    <h3 className={cn("name-product")}>
                                        {product?.name}
                                    </h3>
                                    <div className={cn("product-view-rate")}>
                                        <div className={cn("rating")}>
                                            <span className={cn("rating-number")}>0</span>
                                            <div className={cn("star-icon text-center")}>
                                                <Rating name="read-only" value={0} readOnly size="large" />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        product?.variants.length != 1 &&
                                        Object.keys(variantTypes).map(
                                            (variant, index) => (
                                                <>
                                                    <div className={cn("variants", "row", "mb-2")}>
                                                        <div className={cn("variants-name", "col-2")}>
                                                            {variant}:
                                                        </div>
                                                        <div className={cn("variant-values", "col")}>
                                                            <Variant
                                                                variantName={variant}
                                                                variationTypes={variantTypes}
                                                                selectedVariants={selectedVariants}
                                                                unavailableComb={unavailableComb}
                                                                setSelectedVariants={setSelectedVariants}
                                                                variation={product?.variants}
                                                                indexVariantName={index}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        )
                                    }
                                    {/* price */}
                                    <div className={cn("price-product", "row")}>
                                        <div className={cn("current-price", "col-3")}>
                                            <span>
                                                {VND.format(currentProduct?.sellingPrice)}
                                            </span> <sup>đ</sup>
                                        </div>
                                        {/* {currentProduct?.discount != null &&
                                            (
                                                <div className={cn("discount-price", "col")}>
                                                    <div className={cn("percent")}>
                                                        {currentProduct.discount + currentProduct.discountUnit}
                                                    </div>
                                                    <div className={cn("original-price")}>
                                                        {currentProduct.oldPrice}
                                                        <sup>đ</sup>
                                                    </div>
                                                </div>
                                            )
                                        } */}
                                    </div>

                                    {/* Add to Cart Form */}
                                    <div className="row align-items-center">
                                        {/* quantity */}
                                        <div className={cn("quantity-product", "col-2")}>
                                            <RemoveIcon onClick={handleMinus} />
                                            <input type="number" value={quantity} />
                                            <AddIcon onClick={handlePlus} />
                                        </div>
                                        <span className={cn("col", "stock")}>
                                            {currentProduct?.stock} sản phẩm có sẵn
                                        </span>
                                    </div>
                                    {/* button add to cart and buy now*/}
                                    <div className={cn("btn-product", "row")}>
                                        {/* button add to cart */}
                                        <div className={cn("col-6")}>
                                            <button type="button"
                                                className={cn("btn-add-cart", "btn-2")}
                                                name="action"
                                                value="add-shopping-cart"
                                                onClick={handleAddToCart}
                                            >
                                                <AddShoppingCartIcon />
                                                <span>
                                                    Thêm vào giỏ hàng
                                                </span>
                                            </button>
                                        </div>
                                        {/* button buy now */}
                                        <div className={cn("col-6")}>
                                            <button type="button"
                                                className={cn("btn-buy", "btn-4")}
                                                name="action" value="buy-now">Mua ngay</button>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Địa chỉ user --> */}
                                <div className={cn("info-address")}>
                                    <h2 className={cn("title")}>Thông tin vận chuyển</h2>
                                    <p className={cn("address")}>
                                        <span>Giao hàng đến </span>
                                        <span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >

            {/* <!-- Nội dung chi tiết và mô tả --> */}
            <section className={cn("content-detail")}>
                <div className={cn("container")}>
                    <div className={cn("inner-wrap")}>
                        {/* <!-- head title--> */}
                        <div className={cn("head-title")}>
                            <span>Thông tin chi tiết</span>
                        </div>
                        {/* <!-- description --> */}
                        <div className={cn("description-content")}>
                            {/* Mo ta */}
                            <div className={cn("description", "content-item")}>
                                <div className={cn("name")}>Mô tả</div>
                                <div className={cn("content")}>{product?.description}</div>
                            </div>
                            {/* Attribute */}
                            {attribute.map(
                                (item) => (
                                    <div key={item.id} className={cn("description", "content-item")}>
                                        <div className={cn("name")}>{item.name}</div>
                                        <ul className={cn("content")}>
                                            {
                                                item.values.map(
                                                    (it) => (
                                                        <li key={it}>{it}</li>
                                                    )
                                                )
                                            }
                                        </ul>
                                    </div>
                                )
                            )}
                        </div>

                    </div>
                </div>
            </section>
            {/* <!-- end Nội dung chi tiết và mô tả --> */}


            {/* <!-- review --> */}
            <section className={cn("reviews")}>
                <div className={cn("container")}>
                    <div className={cn("reviews-content")}>
                        <div className={cn("head-review")}>
                            {/* <!-- Title --> */}
                            <div className={cn("head-title")}>
                                <h2 className={cn("title")}>Đánh giá sản phẩm</h2>
                            </div>
                            {/* <!-- end title --> */}
                            {/* <!-- Hiển thị điểm đánh giá và form đánh giá  --> */}
                            <div className={cn("row", "align-items-center", "head-review-inner")}>
                                {/* <!-- Hiển thị điểm đánh giá --> */}
                                <div className={cn("col-xl-6", "offset-xl-1", "col-lg-7", "col-12")}>
                                    <div className={cn("rating-tab", "row")}>
                                        <div className={cn("number", "col-lg-3", "col-sm-4")}>
                                            {/* <!-- Điểm rating trung bình --> */}
                                            <div className={cn("rating-on-5")}>
                                                <span>0</span>
                                            </div>
                                            {/* <!-- Sao của điểm rating trung bình --> */}
                                            <div className={cn("star-icon", "text-center")}>
                                                <Rating name="read-only" value={0} readOnly size="large" />
                                            </div>
                                            {/* <!-- Số lượng đánh giá --> */}
                                            <div className={cn("count-review")}>
                                                <span>(0 đánh giá)</span>
                                            </div>
                                        </div>
                                        {/* <!-- Hiển thị sao từ 1 -> 5 --> */}
                                        <div className={cn("all-star", "col-lg-9", "col-sm-8")}>
                                            <div className={cn("all-start-item", "row", "align-items-center")}>
                                                <Rating className={cn("col-1")} name="read-only" value={5} readOnly size="large" />
                                                <div className={cn("process", "col")}>
                                                    <LinearProgress variant="determinate" value={0} />
                                                </div>
                                                <div className={cn("count-number-review-star", "col")}>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className={cn("all-start-item", "row", "align-items-center")}>
                                                <Rating className={cn("col-1")} name="read-only" value={4} readOnly size="large" />
                                                <div className={cn("process", "col")}>
                                                    <LinearProgress variant="determinate" value={0} />
                                                </div>
                                                <div className={cn("count-number-review-star", "col")}>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className={cn("all-start-item", "row", "align-items-center")}>
                                                <Rating className={cn("col-1")} name="read-only" value={3} readOnly size="large" />
                                                <div className={cn("process", "col")}>
                                                    <LinearProgress variant="determinate" value={0} />
                                                </div>
                                                <div className={cn("count-number-review-star", "col")}>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className={cn("all-start-item", "row", "align-items-center")}>
                                                <Rating className={cn("col-1")} name="read-only" value={2} readOnly size="large" />
                                                <div className={cn("process", "col")}>
                                                    <LinearProgress variant="determinate" value={0} />
                                                </div>
                                                <div className={cn("count-number-review-star", "col")}>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                            <div className={cn("all-start-item", "row", "align-items-center")}>
                                                <Rating className={cn("col-1")} name="read-only" value={1} readOnly size="large" />
                                                <div className={cn("process", "col")}>
                                                    <LinearProgress variant="determinate" value={0} />
                                                </div>
                                                <div className={cn("count-number-review-star", "col")}>
                                                    <span>0</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End hiển thị sao từ 1 -> 5 --> */}
                                    </div>
                                </div>
                                {/* <!-- End hiển thị điểm đánh giá --> */}
                            </div>
                        </div>
                        {/* <!-- review --> */}
                        <div className={cn("review-list")}>
                            {/* <!-- Thông báo khi không có review --> */}
                            <div className={cn("notification-non-review")}>
                                <InboxIcon />
                                <span>Chưa có đánh giá nào</span>
                            </div>
                            {/* <!-- End thông báo khi không có review --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End hiển thị điểm đánh giá và form đánh giá  --> */}
            {/* <!-- end review --> */}

            {/* <!-- related product --> */}
            <section className={cn("related-product")}>
                <div className={cn("container")}>
                    <div className={cn("inner-wrap")}>
                        {/* <!-- Title --> */}
                        <div className={cn("head-title")}>
                            <h3 className={cn("title")}>Sản phẩm liên quan</h3>
                        </div>
                        {/* <!-- end title --> */}
                        <div className={cn("products-list")}>
                            {/* <!-- Hiển thị sách --> */}
                            <div className={cn("row products")}>
                                {
                                    productRelated.map(
                                        item => (
                                            <div key={item.id} className={cn("col-xl-2", "col-md-3", "col-6")}>
                                                <Card product={item} />
                                            </div>
                                        )
                                    )
                                }

                            </div>
                            {/* <!-- End hiển thị sách --> */}
                            {/* <!-- pagination --> */}
                            <Pagination
                                count={totalPage}
                                size="large"
                                page={currentPage}
                                shape="rounded"
                                color="success"
                                onChange={handleChangePagination}
                                className={cn("pagination")}
                            />
                            {/* <!-- end pagination --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- end related product --> */}

        </>
    );
}