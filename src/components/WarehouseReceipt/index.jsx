import classNames from "classnames/bind";
import style from "./WarehouseReceipt.module.css";
import { VND } from "../../utils/formatNumber";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

const cn = classNames.bind(style);


export default function WarehouseReceipt({ receiptInfo }) {
    return (
        <>

            <div className={cn("main-content")}>
                <div className={cn("content-top", "row")}>
                    <div className={cn("info-item", "col-6")}>
                        <div className={cn("row")}>
                            <div className={cn("col-3")}>
                                Mã phiếu nhập:
                            </div>
                            <div className={cn("col")}>
                                {receiptInfo?.id}
                            </div>
                        </div>
                    </div>
                    <div className={cn("info-item", "col-6")}>
                        <div className={cn("row")}>
                            <div className={cn("col-3")}>
                                Ngày tạo:
                            </div>
                            <div className={cn("col")}>
                                {formatDateTime(receiptInfo?.createdDate ?? new Date())}
                            </div>
                        </div>
                    </div>
                    <div className={cn("info-item", "col-6")}>
                        <div className={cn("row")}>
                            <div className={cn("col-3")}>
                                Nhà cung cấp:
                            </div>
                            <div className={cn("col")}>
                                {receiptInfo?.supplier.name}
                            </div>
                        </div>
                    </div>
                    <div className={cn("info-item", "col-6")}>
                        <div className={cn("row")}>
                            <div className={cn("col-3")}>
                                Nhân viên nhập hàng:
                            </div>
                            <div className={cn("col")}>
                                {receiptInfo?.staff.fullName}
                            </div>
                        </div>
                    </div>
                    <div className={cn("info-item", "col-6")}>
                        <div className={cn("row")}>
                            <div className={cn("col-3")}>
                                Trạng thái:
                            </div>
                            {
                                receiptInfo?.importStatus != "Đã nhập hàng" ?
                                    <div className={cn("col", "text-warning")}>
                                        {receiptInfo?.importStatus}
                                    </div>
                                    : <div className={cn("col", "text-success")}>
                                        {receiptInfo?.importStatus}
                                    </div>
                            }
                        </div>
                    </div>
                    {
                        receiptInfo?.importDate &&
                        <div className={cn("info-item", "col-6")}>
                            <div className={cn("row")}>
                                <div className={cn("col-3")}>
                                    Ngày nhập hàng:
                                </div>
                                <div className={cn("col")}>
                                    {formatDateTime(receiptInfo?.importDate)}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className={cn("content-bottom")}>
                    <div className={cn("receipt-detail")}>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Tên</th>
                                    <th scope="col">ĐVT</th>
                                    <th scope="col">Loại</th>
                                    <th scope="col">Số lô</th>
                                    <th scope="col">Hạn sử dụng</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    receiptInfo?.receiptDetails?.map(
                                        (item, index) => (
                                            item.shipments.map(
                                                (shipment, indexShipment) => (
                                                    <tr>
                                                        {/* {
                                                                        indexShipment == 0 &&
                                                                        <td rowSpan={item.shipments.length}>
                                                                            {item.productVariant?.name}
                                                                        </td>
                                                                    } */}

                                                        <td  >
                                                            {item.productVariant?.name}
                                                        </td>
                                                        <td  >
                                                            {item.productVariant?.calculationUnit.name}
                                                        </td>
                                                        <td> {item.productVariant?.variantValues[0].name != "DEFAULT" &&
                                                            item.productVariant?.variantValues.map(
                                                                it => it.value
                                                            ).join("-")}</td>
                                                        <td>{shipment.name}</td>
                                                        <td>{shipment.expiry ? formatDate(shipment.expiry) : ""}</td>
                                                        <td>{shipment.quantity}</td>
                                                        <td>{item.unitPrice}</td>
                                                        <td>{VND.format(shipment.quantity * item.unitPrice)}</td>
                                                    </tr>
                                                )
                                            )

                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className={cn("row")}>
                        <div className={cn("total", "col-10", "offset-7")}>
                            <div className={cn("row")}>
                                <div className={cn("col-3")}>
                                    Tổng số lượng hàng:
                                </div>
                                <div className={cn("col")}>
                                    {
                                        receiptInfo?.receiptDetails?.reduce(
                                            (sum, current) => {
                                                return sum + current.shipments.reduce((accumulator, currentValue) => {
                                                    return accumulator + currentValue.quantity
                                                }, 0)
                                            }, 0
                                        )

                                    }
                                </div>
                            </div>
                            <div className={cn("row")}>
                                <div className={cn("col-3")}>
                                    Tổng tiền:
                                </div>
                                <div className={cn("col")}>
                                    {
                                        VND.format(receiptInfo?.amount)
                                    }
                                </div>
                            </div>
                            <div className={cn("row")}>
                                <div className={cn("col-3")}>
                                    Thanh toán cho nhà cung cấp:
                                </div>
                                <div className={cn("col")}>
                                    {
                                        VND.format(receiptInfo?.paid)
                                    }
                                </div>
                            </div>
                            <div className={cn("row")}>
                                <div className={cn("col-3")}>
                                    Tổng công nợ:
                                </div>
                                <div className={cn("col")}>
                                    {
                                        VND.format(receiptInfo?.amount - receiptInfo?.paid)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}