import { Box, Pagination, Tab, Tabs } from "@mui/material";
import style from "./Purchase.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import OrderItem from "../../components/OrderItem";
import { searchOrder } from "../../services/orderService";
import { routes } from "../../config/routes";
import { useLocation, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
const cn = classNames.bind(style);


function SubPurchasePage(props) {
    const { children, value, index, } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export default function Purchase() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const value = searchParams.get("type") ? parseInt(searchParams.get("type")) : 0;
    const navigate = useNavigate()
    const handleChange = (event, newValue) => {
        navigate(
            `?${new URLSearchParams({
                type: newValue
            })}`
        )
        setCurrentPage(1)
        setTotalPage(1)
        setOrdersConfirm([]);
        setOrdersShipping([])
    };
    const [ordersConfirm, setOrdersConfirm] = useState([])
    const [ordersShipping, setOrdersShipping] = useState([])
    const [ordersCancel, setOrdersCancel] = useState([])

    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

    useEffect(
        () => {
            searchOrder("", "WAIT_FOR_CONFIRMATION", "", currentPage, pageSize).then(
                data => {
                    console.log("data 0", data)
                    setOrdersConfirm(data?.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                }
            )
        }, [value == 0, currentPage]
    )
    useEffect(
        () => {
            searchOrder("", "WAITING_FOR_SHIPPING", "", currentPage, pageSize).then(
                data => {
                    console.log("data 1", data)
                    setOrdersShipping(data?.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                }
            )
        }, [value == 1, currentPage]
    )
    useEffect(
        () => {
            searchOrder("", "CANCELED", "", currentPage, pageSize).then(
                data => {
                    console.log("data 1", data)
                    setOrdersCancel(data?.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                }
            )
        }, [value == 4, currentPage]
    )
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <div className={cn("header")}>
                    <Box
                        className={cn("content-header")}
                    >
                        <Tabs
                            value={value} onChange={handleChange} aria-label="basic tabs example"
                            className="row"
                        >
                            <Tab
                                className="col"
                                style={{ "font-size": "14px" }}
                                label="Chờ xác nhận"
                            />
                            <Tab label="Chờ vận chuyển"
                                className="col"
                                style={{ "font-size": "14px" }}

                            />
                            <Tab label="Chờ giao hàng"
                                className="col"
                                style={{ "font-size": "14px" }}
                            />
                            <Tab label="Hoàn thành"
                                className="col"
                                style={{ "font-size": "14px" }}
                            />
                            <Tab label="Đã hủy"
                                className="col"
                                style={{ "font-size": "14px" }}
                            />
                        </Tabs>
                    </Box>

                </div>

                <SubPurchasePage
                    value={value}
                    index={0}
                >
                    {
                        ordersConfirm.map(
                            order => (
                                <OrderItem
                                    onCLickOrderItem={() => {
                                        navigate(routes.orderDetail, { state: { order: order } })
                                    }}
                                    order={order} />
                            )
                        )
                    }
                    {
                        ordersConfirm.length != 0 &&
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

                    {
                        ordersConfirm.length == 0 &&
                        <Empty message={"Chưa có đơn hàng"} />
                    }
                </SubPurchasePage>
                <SubPurchasePage
                    value={value}
                    index={1}
                >
                    {
                        ordersShipping.map(
                            order => (
                                <OrderItem
                                    onCLickOrderItem={() => navigate(routes.orderDetail, { state: { order } })}
                                    order={order} />
                            )
                        )
                    }
                    {
                        ordersShipping.length != 0 &&
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
                    {
                        ordersShipping.length == 0 &&
                        <Empty message={"Chưa có đơn hàng"} />
                    }
                </SubPurchasePage>
                <SubPurchasePage
                    value={value}
                    index={2}
                >
                    {

                        <Empty message={"Chưa có đơn hàng"} />
                    }
                </SubPurchasePage>
                <SubPurchasePage
                    value={value}
                    index={3}
                >
                    {
                        <Empty message={"Chưa có đơn hàng"} />
                    }
                </SubPurchasePage>
                <SubPurchasePage
                    value={value}
                    index={4}
                >
                    {
                        ordersCancel.map(
                            order => (
                                <OrderItem
                                    onCLickOrderItem={() => navigate(routes.orderDetail, { state: { order } })}
                                    order={order} />
                            )
                        )
                    }
                    {
                        ordersCancel.length != 0 &&
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
                    {
                        ordersCancel.length == 0 &&
                        <Empty message={"Chưa có đơn hàng"} />
                    }
                </SubPurchasePage>

            </Box>
        </>
    )
}