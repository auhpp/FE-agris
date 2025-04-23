import style from "./OrderDetailComponent.module.css";
import classNames from "classnames/bind";
import { VND } from "../../utils/formatNumber";
import { formatDateTime } from "../../utils/formatDate";
import OrderItem from "../OrderItem";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { confirmOrder, searchOrder } from "../../services/orderService";
import Modal from 'react-bootstrap/Modal';
import { cancelOrder } from "./../../services/orderService.js";
import { routes } from "../../config/routes.jsx";
import AlertError from "../AlertError/index.jsx";
import { createPayment, vnpayRefund } from "../../services/paymentService.js";

const cn = classNames.bind(style);

export default function OrderDetailComponent({ order, setOrder, isAdmin }) {
    const navigate = useNavigate()
    var [warehouseRequest, setWarehouseRequest] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false)

    const handleConfirmOrder = () => {
        warehouseRequest = warehouseRequest.filter(a => a.warehouseDetailId.length != 0)
        console.log("wr", warehouseRequest)
        if (warehouseRequest.length == order.orderDetails.length) {
            var orderConfirmRequest = {
                orderId: order.id,
                warehouseDetails: warehouseRequest
            }
            console.log("order confirm request", orderConfirmRequest)
            confirmOrder(orderConfirmRequest).then(
                data => {
                    console.log(data);
                    setIsUpdate(!isUpdate)
                    navigate(routes.orderManagement, { replace: true })
                }
            )
        }
        else {
            setShowAlterError(true)
            setOrderError("Chưa chọn kho và lô lấy hàng hoặc tồn kho không đủ")
        }
    }
    const [reasonForCancel, setReasonForCancel] = useState("");
    const [reasonForCancelError, setReasonForCancelError] = useState("");
    const [orderError, setOrderError] = useState("")
    const [showAlterError, setShowAlterError] = useState(false)

    const handleCancelOrder = () => {
        if (reasonForCancel == "") {
            setReasonForCancelError("Phải nhập lý do!")
        }
        else {
            var request = {
                reasonForCancellation: reasonForCancel,
                orderId: order.id
            }
            cancelOrder(request).then(
                data => {
                    if (data.code == 200) {
                        if (order.paymentStatus == "PAID") {
                            vnpayRefund(order).then(
                                data => {
                                    console.log(data)
                                }
                            )
                        }
                        navigate(routes.purchase)
                    }
                }
            )
            setShowCancelModal(false)
        }
    }
    const handlePayment = () => {
        createPayment(order).then(
            data => {
                if (data.code == 200) {
                    const paymentUrl = data.result
                    window.location.href = paymentUrl
                }
                else {
                    alert("Lỗi kết nối đến cổng thanh toán")
                }
            })
    }
    return (
        <>
            <div>
                <AlertError
                    message={orderError}
                    onClose={() => setShowAlterError(false)}
                    showAlert={showAlterError}
                />
            </div>
            <div className={cn("back-previous-page", "col")}>
                <div onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon />
                    <span>QUAY LẠI</span>
                </div>
            </div>
            <OrderItem
                warehouseRequest={warehouseRequest}
                setWarehouseRequest={setWarehouseRequest}
                isAdmin={isAdmin}
                order={order} />
            <div className={cn("created-at")}>
                <div>
                    Ngày tạo: {order?.createdAt && formatDateTime(order.createdAt)}
                </div>
                <div>
                    Ngày cập nhật:  {order?.updatedAt && formatDateTime(order.updatedAt)}
                </div>
                {
                    order?.canceller && (
                        <>

                            <div>
                                Người hủy:  {order?.canceller == "CUSTOMER" ? "Khách hàng" : "Cửa hàng"}
                            </div>
                            <div>
                                Lý do:  {order?.reasonForCancellation && (order.reasonForCancellation)}
                            </div>
                        </>
                    )
                }
            </div>
            <div className={cn("address")}>
                <h4 className={cn("head")}>
                    Địa chỉ nhận hàng
                </h4>
                <div className={cn("content")}>
                    <h5 className={cn("full-name")}>{order?.fullName}</h5>
                    <div className={cn("phone-number")}>{order?.phoneNumber}</div>
                    <div className={cn("main-address")}>
                        {`${order?.deliveryAddress}, ${order?.ward}, ${order?.district}, ${order?.province}`}

                    </div>
                </div>
            </div>
            < section className={cn("info-pay")} >
                <div className={cn("content")}>
                    <div className={cn("price", "row")}>
                        <span className={cn("col-6 text-end")}>Thành tiền: </span>
                        <span className={cn("col-6", "price-sum")}>
                            {VND.format(order?.amount)}đ
                        </span>
                    </div>
                    <div className={cn("sum-price", "row")}>
                        <span className={cn("col-6", "text-end")}>Tổng Số Tiền: </span>
                        <span className={cn("col-6", "all-price")}>
                            {VND.format(order?.amount)} đ
                        </span>
                    </div>
                </div>
            </section >
            {
                order?.orderStatus != "CANCELED" &&
                <div className={cn("btn-cancel")}>
                    {
                        isAdmin && order.orderStatus == "WAIT_FOR_CONFIRMATION" && (
                            <Button
                                onClick={handleConfirmOrder}
                                variant="contained" color="error" className="me-2">
                                Xác nhận đơn hàng
                            </Button>
                        )
                    }
                    {
                        order?.paymentMethod == "VNPAY"
                        && order?.paymentStatus == "NO_PAYMENT"
                        && order?.orderStatus == "WAIT_FOR_CONFIRMATION" && (
                            <Button
                                variant="contained"
                                color="error"
                                className="me-2"
                                onClick={handlePayment}>Thanh toán</Button>
                        )
                    }

                    <Button variant="outlined" color=""
                        onClick={() => setShowCancelModal(true)}
                    >
                        Hủy đơn hàng
                    </Button>
                </div>
            }

            <Modal
                show={showCancelModal} onHide={() => setShowCancelModal(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Hủy đơn hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <label className="col-2" htmlFor="">Lý do: </label>
                        <textarea className="col-10"
                            rows={2}
                            onChange={(e) => setReasonForCancel(e.target.value)}
                            name="" id="">
                        </textarea>
                        {reasonForCancelError && (<span className={cn("text-danger", "col-10", "offset-2")}>{reasonForCancelError}</span>)}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="contained"
                        color=""
                        className="me-2"
                        onClick={() => setShowCancelModal(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelOrder}>Xác nhận</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}