import style from "./OrderList.module.css";
import classNames from "classnames/bind";

import { Breadcrumbs, Chip, Pagination, Typography } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import SearchIcon from '@mui/icons-material/Search';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { searchOrder } from "../../services/orderService";
import { routes } from "../../config/routes";
import { formatDateTime } from "../../utils/formatDate";
import { OrderStatus, PaymentStatus } from "../../utils/status";
import { VND } from "../../utils/formatNumber";

const cn = classNames.bind(style);

export default function OrderList({ customerId, setSizeOrders }) {
    const [orders, setOrders] = useState([])
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    var id = searchParams.get("id") ?? ""
    var paymentStatus = searchParams.get("paymentStatus") ?? ""
    var orderStatus = searchParams.get("orderStatus") ?? ""
    useEffect(
        () => {
            searchOrder(customerId, id, orderStatus, paymentStatus, currentPage, pageSize).then(
                data => {
                    console.log("data", data)
                    setOrders(data?.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                }
            )
        }, [currentPage, id, paymentStatus, orderStatus]
    )
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }

    return (
        <>
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Control placeholder="Mã đơn hàng ..."
                                onChange={(e) => {

                                    navigate(
                                        `?${new URLSearchParams({
                                            id: e.target.value,
                                            orderStatus: orderStatus,
                                            paymentStatus: paymentStatus
                                        })}`
                                    )
                                }}
                                value={id}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {

                                    navigate(
                                        `?${new URLSearchParams({
                                            id: id,
                                            orderStatus: e.target.value,
                                            paymentStatus: paymentStatus,
                                        })}`
                                    )
                                }}
                            >
                                <option value={""}>--Trạng thái đơn hàng--</option>
                                <option selected={orderStatus == "WAIT_FOR_CONFIRMATION"} value={"WAIT_FOR_CONFIRMATION"}>
                                    Chờ xác nhận</option>
                                <option selected={orderStatus == "WAITING_FOR_SHIPPING"} value={"WAITING_FOR_SHIPPING"}>
                                    Chờ vận chuyển</option>
                                <option selected={orderStatus == "CANCELED"} value={"CANCELED"}>
                                    Đã hủy
                                </option>

                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                            <Form.Select
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            id: id,
                                            orderStatus: orderStatus,
                                            paymentStatus: e.target.value
                                        })}`
                                    )
                                }}

                            >
                                <option value={""}>--Trạng thái thanh toán--</option>
                                <option selected={orderStatus == "PAID"} value={"PAID"}>
                                    Đã thanh toán</option>
                                <option selected={orderStatus == "NO_PAYMENT"} value={"NO_PAYMENT"}>
                                    Chưa thanh toán</option>
                            </Form.Select>
                        </Form.Group>

                    </Row>
                </div>
                <div className={cn("shipment-table")}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className="text-center">Mã ĐH</th>
                                <th>Ngày tạo</th>
                                <th>Khách hàng</th>
                                <th>TT đơn hàng</th>
                                <th>TT thanh toán</th>
                                <th>Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders?.map(
                                    od => (
                                        <tr
                                            onClick={() => navigate(
                                                routes.orderDetailManagement, { state: { order: od } })}
                                            className={cn("order")}>
                                            <td className="text-center">{od.id}</td>
                                            <td>{formatDateTime(od.createdAt)}</td>
                                            <td>{od.customer.fullName}</td>
                                            <td>
                                                <Chip label={OrderStatus[od.orderStatus].name}
                                                    style={{ "fontSize": "13px" }}
                                                    color={OrderStatus[od.orderStatus].color} variant="outlined" />

                                            </td>
                                            <td>
                                                <Chip
                                                    style={{ "fontSize": "13px" }}
                                                    label={PaymentStatus[od.paymentStatus].name}
                                                    color={PaymentStatus[od.paymentStatus].color}
                                                    variant="outlined" />
                                            </td>
                                            <td>{VND.format(od.amount)}</td>

                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            {
                orders.length != 0 &&
                <Pagination
                    count={totalPage}
                    size="large"
                    page={currentPage}
                    shape="rounded"
                    color="success"
                    onChange={handleChangePagination}
                    className={cn("pagination")}
                />
            }
        </>
    )
}