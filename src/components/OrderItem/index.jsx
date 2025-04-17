import style from "./OrderItem.module.css";
import classNames from "classnames/bind";
import { VND } from "../../utils/formatNumber";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import SelectWarehouseAndShipment from "../SelectWarehouseAndShipment";
import { OrderStatus } from "./../../utils/status.js";
import CloseIcon from '@mui/icons-material/Close';

const cn = classNames.bind(style);
export default function OrderItem({ order,
    onCLickOrderItem, isAdmin, setOrder,
    warehouseRequest, setWarehouseRequest
}) {
    var status = {
        WAIT_FOR_CONFIRMATION: "Chờ xác nhận"
    }
    console.log("order item", order)
    const navigate = useNavigate();

    return (
        <>
            <div
                className={cn("order-item")}>
                <div className={cn("head")}>
                    <div className={cn("time")}>
                        MÃ ĐƠN HÀNG:
                        {
                            " " + order?.id
                        }
                    </div>
                    <div className={cn("status-order")}>
                        {
                            OrderStatus[order?.orderStatus]?.name
                        }
                    </div>
                </div>
                <div
                    className={cn("products")}>
                    {
                        order?.orderDetails?.map(
                            od => (
                                <div

                                    onClick={
                                        () => {
                                            onCLickOrderItem &&
                                                onCLickOrderItem()
                                        }
                                    }

                                    className={cn("product", "row")}>
                                    <div className="col-8 row">
                                        <div className="col-2">
                                            <img src={od.productVariantValue.thumbnail} alt="" />
                                        </div>
                                        <div className={cn("col-10", "info")}>
                                            <div className={cn("name-product")}>
                                                {od.productVariantValue.name}
                                            </div>
                                            {
                                                od.productVariantValue.variantValues.length != 1 &&
                                                <div className={cn("variant")}>
                                                    Phân loại hàng: {
                                                        od.productVariantValue.variantValues.map(a => a.value).join(" - ")
                                                    }
                                                </div>
                                            }
                                            <div className={cn("quantity")}>
                                                x{od.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className={cn("price")}>
                                            {VND.format(od.unitPrice)} đ
                                        </div>
                                    </div>
                                    {
                                        isAdmin && (
                                            <SelectWarehouseAndShipment
                                                order={order}
                                                orderQuantity={od.quantity}
                                                warehouseRequest={warehouseRequest}
                                                setWarehouseRequest={setWarehouseRequest}
                                                productVariantId={od.productVariantValue.id}
                                            />

                                        )
                                    }
                                    {
                                        order.orderStatus != "WAIT_FOR_CONFIRMATION" && isAdmin &&
                                        <div className="col mt-2 bold">
                                            <span>Các kho và lô lấy hàng:</span>
                                            {
                                                od.orderWarehouses.map(
                                                    ow => (
                                                        <MenuItem>
                                                            <div className="me-3">{ow.warehouseName + " - " + ow.shipmentName}

                                                            </div>
                                                            <div className="me-3"> {ow.expiry && "HSD: " + formatDate(ow.expiry)}

                                                            </div>
                                                        </MenuItem>
                                                    )
                                                )

                                            }
                                        </div>
                                    }
                                </div>
                            )
                        )
                    }
                </div>
                <div className={cn("amount")}>
                    <span>
                        Thành tiền:
                    </span>
                    <span className={cn("price")}>
                        <span>
                            {VND.format(order?.amount)}
                        </span>
                        <sup>đ</sup>
                    </span>
                </div>
            </div>
        </>
    )
}