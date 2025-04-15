import classNames from "classnames/bind";
import style from "./StockDetail.module.css";
import { Breadcrumbs, Pagination, Typography } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import SearchIcon from '@mui/icons-material/Search';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { getAllWarehouse } from "../../services/warehouseService";
import { searchShipment } from "../../services/shipmentService";
import { routes } from "../../config/routes";

const cn = classNames.bind(style);

export default function StockDetail() {
    const navigate = useNavigate()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    var productVariantId = location.state?.id || searchParams.get("productVariantId")
    var productVariant = location.state?.item || JSON.parse(localStorage.getItem("productVariantStockDetail"))
    var product = location.state?.product || JSON.parse(localStorage.getItem("productStockDetail"))
    var name = searchParams.get("name") || ""
    var status = searchParams.get("status") || ""
    var warehouseId = searchParams.get("warehouseId") || ""

    const [warehouses, setWarehouses] = useState([])
    const [shipments, setShipments] = useState([])
    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }

    console.log("rq", productVariant)
    useEffect(
        () => {
            getAllWarehouse().then(
                data => {
                    setWarehouses(data.result)
                }
            )
        }, []
    )
    useEffect(
        () => {
            searchShipment(name, status, warehouseId, productVariantId, currentPage, pageSize).then(
                data => {
                    console.log(data)
                    setShipments(data.result?.data)
                }
            )
        }, [currentPage, name, status, warehouseId]
    )
    const toProductPage = () => {
        navigate(routes.createProduct, { state: { item: product, isView: true } })
    }
    return (
        <>
            <div className={cn("container", "mt-2")}>
                <Breadcrumbs aria-label="breadcrumb">
                    <div
                        style={{ cursor: "pointer" }}
                        underline="hover" onClick={() => {
                            navigate(routes.searchProduct)
                        }}>
                        Danh sách sản phẩm
                    </div>
                    <div
                        style={{ cursor: "pointer" }}
                        underline="hover"
                        onClick={toProductPage}
                    >
                        {product?.name}
                    </div>
                    <Typography sx={{ color: 'var(--primary-color)' }}>{
                        productVariant?.variantCombination?.length != 1 ?
                            productVariant?.variantCombination?.map(
                                vr => vr.value
                            ).join(" - ") : "DEFAULT"
                    }</Typography>
                </Breadcrumbs>
                <div onClick={() => navigate(-1)}
                    style={{ cursor: "pointer" }}
                    className={cn("back-previous-page", "mt-3")}>
                    <ArrowBackIosIcon />
                    <span>Chi tiết tồn kho</span>
                </div>
                <div className={cn("main-content")}>
                    <div className={cn("filter-form")}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Control placeholder="Lô ..."
                                    onChange={(e) => {
                                        localStorage.setItem("productVariantStockDetail", JSON.stringify(productVariant))
                                        localStorage.setItem("productStockDetail", JSON.stringify(product))
                                        navigate(
                                            `?${new URLSearchParams({
                                                name: e.target.value,
                                                status: status,
                                                warehouseId: warehouseId,
                                                productVariantId: productVariantId
                                            })}`
                                        )
                                    }}
                                    value={name}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Select
                                    onChange={(e) => {
                                        localStorage.setItem("productVariantStockDetail", JSON.stringify(productVariant))
                                        localStorage.setItem("productStockDetail", JSON.stringify(product))
                                        navigate(
                                            `?${new URLSearchParams({
                                                name: name,
                                                status: e.target.value,
                                                warehouseId: warehouseId,
                                                productVariantId: productVariantId
                                            })}`
                                        )
                                    }}
                                >
                                    <option value={""}>--Chọn trạng thái--</option>
                                    <option selected={status == "ACTIVE"} value={"ACTIVE"}>Còn hạn sử dụng</option>
                                    <option selected={status == "INACTIVE"} value={"INACTIVE"}>Hết hạn sử dụng</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Select
                                    onChange={(e) => {
                                        localStorage.setItem("productVariantStockDetail", JSON.stringify(productVariant))
                                        localStorage.setItem("productStockDetail", JSON.stringify(product))
                                        navigate(
                                            `?${new URLSearchParams({
                                                name: name,
                                                status: status,
                                                warehouseId: e.target.value,
                                                productVariantId: productVariantId
                                            })}`
                                        )
                                    }}

                                >
                                    <option value={""}>--Chọn kho--</option>
                                    {
                                        warehouses.map(
                                            wh => (
                                                <option
                                                    selected={
                                                        wh.id == warehouseId
                                                    }
                                                    value={wh.id}>
                                                    {wh.name}
                                                </option>
                                            )
                                        )
                                    }
                                </Form.Select>
                            </Form.Group>

                        </Row>
                    </div>
                    <div className="shipment-table">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Lô</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Trạng thái</th>
                                    <th>Tồn kho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    shipments?.map(
                                        sm => (
                                            <tr>
                                                <td>{sm.name}</td>
                                                <td>{sm.expiry}</td>
                                                <td>{sm.status}</td>
                                                <td>{sm.quantity}</td>
                                            </tr>
                                        )
                                    )
                                }
                            </tbody>
                        </Table>
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
            </div>
        </>
    )
}