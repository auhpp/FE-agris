import style from "./CartItem.module.css";
import classNames from "classnames/bind";
import Variant from "../Variant";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    convertToSelectedVariant, convertToSelectedVariantString, convertToVariantType,
    findUnavailableCombinations, getVariantIdSelected
} from "../../utils/variant";
import { useEffect, useState } from "react";
import { VND } from "../../utils/formatNumber";
import { addToCart, findCartById } from "../../services/cartService";

const cn = classNames.bind(style);

export default function CartItem({ cartId, onDeleteCart,
    handleNavigateToProduct,
    setProductPurchaseList,
    setUpdate,
    productPurchaseList, setAmount

}) {
    const [selectedVariants, setSelectedVariants] = useState({})
    const [variantTypes, setVariantTypes] = useState({});
    const [unavailableComb, setUnavailableComb] = useState()
    const [currentProduct, setCurrentProduct] = useState();
    const [cart, setCart] = useState()
    const [isUpdate, setIsUpdate] = useState(false);
    const updateProductPurchaseItem = (newItem) => {
        setProductPurchaseList((prev) =>
            prev.map((p) => (p.id === newItem.id ? { ...p, ...newItem } : p))
        );
    };

    //Get product
    useEffect(() => {
        (async () => {
            try {
                const data = await findCartById(cartId);
                setCart(data?.result)
                setVariantTypes(convertToVariantType(data?.result.product.variants))
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                // setLoading(false);
            }
        })()
    }, [isUpdate])

    const changeVariant = (request) => {
        addToCart(request).then(
            data => {
                setIsUpdate(!isUpdate)
                setUpdate(Date.now())
                updateProductPurchaseItem(data.result)
            }
        )
    }

    //Calculation amount
    const handleClickCart = (product, e) => {
        if (e.target.checked) {
            setProductPurchaseList(prev =>
                [
                    ...prev,
                    product
                ]
            )
        }
        else {
            setProductPurchaseList(prev =>
                prev.filter(
                    a => a.id != product.id
                )
            )
        }
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
        }, [productPurchaseList, isUpdate]
    )

    useEffect(
        () => {
            if (Object.keys(selectedVariants).length === 0 && cart?.product?.variants.length > 0) {
                setUnavailableComb(
                    findUnavailableCombinations(variantTypes, cart?.product.variants)
                )

                const variantFirst = cart?.variant;
                const selectVariant = {};
                variantFirst?.variantValues.forEach((a) => {
                    selectVariant[a.name] = a.value;
                });
                setSelectedVariants(selectVariant);
            }
        }, [variantTypes, cart]
    )

    useEffect(
        () => {
            var selectedVariantId = getVariantIdSelected(cart?.product?.variants, selectedVariants);
            var currentVariantProduct = cart?.product?.variants.find(a => a.id == selectedVariantId)
            setCurrentProduct(currentVariantProduct)
        }, [selectedVariants, cart]
    )

    //Change product variant
    const handleClickVariant = () => {
        console.log("submit select", selectedVariants)
        var productVariantId = currentProduct.id;
        const cartRequest = {
            id: cart?.id,
            productVariantId: productVariantId,
            quantity: cart?.quantity
        }
        changeVariant(cartRequest)
    }


    const resetSelected = () => {
        const variantFirst = cart?.product?.variants[0];
        const selectVariant = {};
        variantFirst?.variantValues.forEach((a) => {
            selectVariant[a.name] = a.value;
        });
        setSelectedVariants(selectVariant);
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
                    setUpdate(Date.now())
                    updateProductPurchaseItem(data.result)

                }
            )
        }
    }
    const handlePlus = (item) => {
        if (item.quantity + 1 <= item.variant.stock) {
            const newQuantity = item.quantity + 1;
            const cartRequest = {
                productVariantId: item.variant.id,
                quantity: newQuantity
            }
            addToCart(cartRequest).then(
                data => {
                    setIsUpdate(!isUpdate)
                    setUpdate(Date.now())
                    updateProductPurchaseItem(data.result)

                }
            )
        }
    }
    // end minus and plus button
    return (
        <div
            key={cart?.id}
            className={cn("cart-item", "row")}>
            <div className={cn("form-check", "col-4")}>
                {/* Checkbox */}
                <input className={cn("form-check-input")}
                    type="checkbox" value="" id="flexCheckDefault"
                    onClick={(e) => handleClickCart(cart, e)}
                />
                {/* card */}
                <div className={cn("card", "mb-3")}>
                    <div className={cn("row g-0")}>
                        {/* image */}
                        <div
                            onClick={() => handleNavigateToProduct(cart?.product?.id)}
                            className={cn("col-md-4")}>
                            <img
                                src={cart?.product.thumbnail}
                                className={cn("img-fluid", "rounded-start", "img-product")} alt="..." />
                        </div>
                        <div className={cn("col-md-8")}>
                            <div className={cn("card-body")}>
                                {/* name */}
                                <h5
                                    onClick={() => handleNavigateToProduct(cart?.product?.id)}
                                    className={cn("card-title", 'title', "product-title")}>
                                    {cart?.product.name}
                                </h5>
                                {/* price */}
                                <div className={cn("price-product")}>
                                    <div className={cn("current-price")}>
                                        <span>{cart?.variant?.sellingPrice}</span>
                                        <sup>đ</sup>
                                    </div>
                                    {
                                        cart?.variant?.discount != null && (
                                            <div className={cn("discount-price")}>
                                                <div className={cn("original-price")}>
                                                    {cart?.variant.oldPrice}
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
            {/* variant */}
            <div className={cn("col-3")}>
                {
                    cart?.product.variants.length != 1 &&
                    <Dropdown>
                        <Dropdown.Toggle
                            className={cn("dropdown-btn")}
                            variant="light" id={cart?.id}>
                            <div>
                                Phân loại hàng:
                            </div>
                            <span>
                                {convertToSelectedVariantString(
                                    cart?.variant.variantValues
                                )}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            className={cn("dropdown-menu-list")}>

                            {
                                cart?.product?.variants.length != 1 &&
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
                                                        variation={cart?.product?.variants}
                                                        indexVariantName={index}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                )
                            }
                            <div className="row">
                                <Dropdown.Item
                                    onClick={() => resetSelected()
                                    }
                                    className={cn("dropdown-item-btn", "col", "offset-7", "p-0", "me-1")}>
                                    <Button variant="secondary"
                                        className="w-100"
                                    >
                                        Hủy
                                    </Button>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleClickVariant()}
                                    className={cn("dropdown-item-btn", "col", "p-0", "me-2")}>
                                    <Button variant="success">
                                        Xác nhận
                                    </Button>
                                </Dropdown.Item>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </div>
            {/* end variant */}
            {/* quantity */}
            <div className={cn("col-2")}>
                <div className={cn("quantity-product")}>
                    <RemoveIcon onClick={() => handleMinus(cart)} />
                    <input type="number" value={cart?.quantity} />
                    <AddIcon onClick={() => handlePlus(cart)} />
                </div>
                <span className={cn("col", "stock", "text-secondary")}
                    style={{ fontSize: "14px" }}
                >
                    {cart?.variant.stock} sản phẩm có sẵn
                </span>
            </div>
            {/* price */}
            <div className={cn("unit-price", "col-2")}>
                <span>
                    {VND.format(cart?.quantity * cart?.variant?.sellingPrice)}đ
                </span>
            </div>
            {/* delete button */}
            <div
                onClick={() => onDeleteCart(cart)}
                className={cn("delete-icon", "col-1")}>
                <DeleteIcon />
            </div>
        </div>
    )
}