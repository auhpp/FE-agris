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
import { useState } from "react";
import { VND } from "../../utils/formatNumber";

const cn = classNames.bind(style);

export default function CartItem({ cart, onDeleteCart,
    handlePlus, handleMinus,
    handleNavigateToProduct, handleClickCart,
    changeVariant

}) {
    //Change product variant
    const handleClickVariant = (product, cart, selectedVariants) => {
        var productVariantId = getVariantIdSelected(product.variants, selectedVariants);
        const cartRequest = {
            id: cart.id,
            productVariantId: productVariantId,
            quantity: cart.quantity
        }
        changeVariant(cartRequest)
    }

    var [selectedVariants, setSelectedVariants] = useState({})
    if (Object.keys(selectedVariants).length == 0 && cart.product.variants.length != 1) {
        setSelectedVariants(convertToSelectedVariant(cart.variant.variantValues))
    }

    return (
        <div
            key={cart.id}
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
                            onClick={() => handleNavigateToProduct(cart.product?.id)}
                            className={cn("col-md-4")}>
                            <img
                                src={cart.product.thumbnail}
                                className={cn("img-fluid", "rounded-start", "img-product")} alt="..." />
                        </div>
                        <div className={cn("col-md-8")}>
                            <div className={cn("card-body")}>
                                {/* name */}
                                <h5
                                    onClick={() => handleNavigateToProduct(cart.product?.id)}
                                    className={cn("card-title", 'title', "product-title")}>
                                    {cart.product.name}
                                </h5>
                                {/* price */}
                                <div className={cn("price-product")}>
                                    <div className={cn("current-price")}>
                                        <span>{cart.variant?.sellingPrice}</span>
                                        <sup>đ</sup>
                                    </div>
                                    {
                                        cart.variant?.discount != null && (
                                            <div className={cn("discount-price")}>
                                                <div className={cn("original-price")}>
                                                    {cart.variant.oldPrice}
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
                    cart.product.variants.length != 1 &&
                    <Dropdown>
                        <Dropdown.Toggle
                            className={cn("dropdown-btn")}
                            variant="light" id={cart.id}>
                            <div>
                                Phân loại hàng:
                            </div>
                            <span>
                                {convertToSelectedVariantString(
                                    cart.variant.variantValues
                                )}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            onBlur={() => setSelectedVariants({})}
                            className={cn("dropdown-menu-list")}>
                            {
                                Object.keys(
                                    convertToVariantType(cart.product.variants)
                                ).map(
                                    (variant, index) => (
                                        <>
                                            <div className={cn("variants", "row", "mb-2")}>
                                                <div className={cn("variants-name", "col-3")}>
                                                    {variant}:
                                                </div>
                                                <div className={cn("variant-values", "col")}>
                                                    <Variant
                                                        variantName={variant}
                                                        variationTypes={convertToVariantType(cart.product.variants)}
                                                        selectedVariants={selectedVariants}
                                                        unavailableComb={findUnavailableCombinations(
                                                            convertToVariantType(cart.product.variants)
                                                            , cart.product.variants
                                                        )}
                                                        setSelectedVariants={setSelectedVariants}
                                                        variation={cart.product.variants}
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
                                    onClick={() => setSelectedVariants({})
                                    }
                                    className={cn("dropdown-item-btn", "col", "offset-7", "p-0", "me-1")}>
                                    <Button variant="secondary"
                                        className="w-100"
                                    >
                                        Hủy
                                    </Button>
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleClickVariant(cart.product, cart, selectedVariants)}
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
                    <input type="number" value={cart.quantity} />
                    <AddIcon onClick={() => handlePlus(cart)} />
                </div>
            </div>
            {/* price */}
            <div className={cn("unit-price", "col-2")}>
                <span>
                    {VND.format(cart.quantity * cart.variant?.sellingPrice)}đ
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