import { useLocation, useNavigate } from "react-router-dom";
import style from "./SupplierDetail.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { createSupplier, deleteSupplier, searchSupplier } from "../../../services/supplierService";
import { Box, Button, Chip, Pagination, Tab, Tabs } from "@mui/material";
import Table from 'react-bootstrap/Table';
import { SupplierStatus } from "../../../utils/status";
import { SubPurchasePage } from "../../Purchase";
import Empty from "../../../components/Empty";
import { searchWarehouseReceipt } from "../../../services/warehouseService";
import { formatDateTime } from "../../../utils/formatDate";
import { VND } from "../../../utils/formatNumber";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AlertError from "../../../components/AlertError";
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import CreateSupplierModal from "./../../../components/CreateSupplierModal";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { searchPaymentSlip } from "../../../services/paymentSlipService";
import StopIcon from '@mui/icons-material/Stop';
const cn = classNames.bind(style);
export default function SupplierDetail() {
    const location = useLocation();
    const supplierId = Number.parseInt(location.pathname.substring(location.pathname.lastIndexOf("/") + 1))
    console.log("id", supplierId)
    const [supplier, setSupplier] = useState();
    const [isUpdate, setIsUpdate] = useState(false)

    useEffect(
        () => {
            searchSupplier("", "", "", "", "", supplierId).then(
                data => {
                    setSupplier(data.result.data[0])
                }
            )
        }, [supplierId, isUpdate]
    )
    console.log(supplier)
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
        setWarehouseReceipts([]);
        setPaymentSlips([])
    };
    const [warehouseReceipts, setWarehouseReceipts] = useState([])
    const [paymentSlips, setPaymentSlips] = useState([])

    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }
    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [showDeleteError, setShowDeleteError] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [supplierEdit, setSupplierEdit] = useState({
        id: null, name: ""
    });
    const [showWaringInACtive, setShowWarningInActive] = useState(false)

    useEffect(
        () => {
            searchWarehouseReceipt(supplierId, currentPage, pageSize).then(
                data => {
                    console.log("data 0", data)
                    setWarehouseReceipts(data?.result?.data)
                    setTotalPage(data.result?.totalPage)
                    setCurrentPage(data.result?.currentPage)
                    setPageSize(data.result?.pageSize)
                }
            )
        }, [value == 0, currentPage]
    )
    useEffect(
        () => {
            searchPaymentSlip("", "", "", currentPage, pageSize, supplier?.id).then(
                data => {
                    console.log("data", data)
                    setPaymentSlips(data?.result?.data)
                    setTotalPage(data.result?.totalPage)
                    setCurrentPage(data.result?.currentPage)
                    setPageSize(data.result?.pageSize)
                }
            )
        }, [value == 1, currentPage]
    )
    const handleDelete = () => {
        deleteSupplier(supplierId).then(
            data => {
                if (data.code == 200) {
                    setIsUpdate(!isUpdate)
                }
                else {
                    setShowDeleteError(true)

                }
                setShowWarningDelete(false)
            }
        )
    }
    const handleUpdateStatus = () => {
        if (supplier.status == "ACTIVE")
            supplier.status = "INACTIVE"
        else
            supplier.status = "ACTIVE"
        createSupplier(supplier).then(
            data => {
                console.log(data)
                if (data.code == 200) {
                    setIsUpdate(!isUpdate)
                    setShowWarningInActive(false)
                }
            }
        )

    }
    return (
        <>
            <AlertError
                showAlert={showDeleteError}
                onClose={() => setShowDeleteError(false)}
                message={"Đã có nhập sản phẩm từ nhà cung cấp này"}
            />
            <div className="text-end d-flex align-items-center justify-content-between">
                <div
                    className="navigate-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIosIcon />
                    <span>QUAY LẠI</span>
                </div>
                <div className="btn-group">
                    <Button variant="contained"
                        color={supplier?.status == "ACTIVE" ? "error" : "info"}
                        size="sm"
                        className="me-1"
                        onClick={() => {
                            setShowWarningInActive(true)
                        }}
                    >
                        {
                            supplier?.status == "ACTIVE" ? (
                                <>
                                    <StopIcon
                                        className={cn("delete-icon")} />
                                    <span>Ngừng hoạt động</span>
                                </>) :
                                <>
                                    <PlayCircleOutlineIcon
                                        className={cn("delete-icon")} />
                                    <span>Bật hoạt động</span>
                                </>

                        }
                    </Button>
                    <Button variant="contained"
                        size="sm"
                        color="info"
                        className="me-1"
                        onClick={() => {
                            setShowCreateModal(true)
                            setSupplierEdit(supplier)
                        }}
                    >
                        <EditIcon
                            className={cn("edit-icon")} />
                    </Button>
                    <Button variant="contained"
                        color="error"
                        size="sm"
                        onClick={() => {
                            setShowWarningDelete(true)
                        }}
                    >
                        <DeleteIcon
                            className={cn("delete-icon")} />
                    </Button>
                </div>
            </div>
            <div className="row  ">
                <div className="col-8 align-self-stretch">
                    <div className={cn("main-content")}>
                        <div className="d-flex gap-2 align-items-center">
                            <h4 className={cn("name-supplier")}>
                                {supplier?.name}
                            </h4>
                            {
                                supplier?.status == "ACTIVE" ?
                                    <Chip
                                        style={{ "fontSize": "13px" }}
                                        label={SupplierStatus[supplier?.status]}
                                        color="primary" variant="outlined" />
                                    :
                                    <Chip
                                        style={{ "fontSize": "13px" }}
                                        label={SupplierStatus[supplier?.status]}
                                        color="error" variant="outlined" />
                            }
                        </div>
                        <div className="debt border-top mt-3">
                            <div className="mt-5 content d-flex gap-5 align-items-center justify-content-evenly ">
                                <div className="debt-need-pay">
                                    <div>
                                        Nợ phải trả
                                    </div>
                                    <div className="text-center bold">
                                        {
                                            VND.format(supplier?.debt)
                                        } đ
                                    </div>
                                </div>
                                <div className="sum-buy">
                                    <div>
                                        Tổng mua
                                    </div>
                                    <div className="text-center bold">
                                        {
                                            VND.format(supplier?.amount ?? 0)
                                        } đ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className={cn("main-content")}>
                        <div className={cn("contact-info")}>
                            <h5 className="mb-2">
                                Thông tin liên hệ
                            </h5>
                            <div className={cn("main-contact", "border-top", "mb-2")}>
                                <div>
                                    {supplier?.contactName}
                                </div>
                                <div>
                                    {supplier?.email}
                                </div>
                                <div>
                                    {supplier?.phoneNumber}
                                </div>
                            </div>
                        </div>
                        <div className={cn("contact-info", "mt-4")}>
                            <h5 className="mb-2">
                                Địa chỉ
                            </h5>
                            <div className={cn("main-contact", "border-top", "mb-2")}>
                                <div>
                                    {supplier?.address && supplier?.address.substring(0, supplier?.address.indexOf(","))}
                                </div>
                                <div>
                                    {supplier?.address && supplier?.address.substring(supplier?.address.indexOf(",") + 1)}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cn("main-content", "mt-4")}>
                <Box>
                    <div className={cn("header")}>
                        <Box
                            className={cn("content-header")}
                        >
                            <Tabs
                                value={value} onChange={handleChange} aria-label="basic tabs example"
                            >
                                <Tab
                                    style={{ "font-size": "12px" }}
                                    label="Lịch sử nhập hàng"
                                />
                                <Tab label="Nợ phải trả"
                                    style={{ "font-size": "12px" }}
                                />

                            </Tabs>
                        </Box>

                    </div>

                    <SubPurchasePage
                        value={value}
                        index={0}
                    >
                        {warehouseReceipts?.length != 0 &&
                            <div className={cn("result-table")}>
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Mã phiếu nhập</th>
                                            <th scope="col">Ngày tạo</th>
                                            <th scope="col">Tổng tiền</th>
                                            <th scope="col">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            warehouseReceipts?.map(
                                                (item, index) => (
                                                    <tr >
                                                        <td>{item.id}</td>
                                                        <td>{formatDateTime(item.createdDate)}</td>
                                                        <td>{VND.format(item.amount)}</td>
                                                        {
                                                            item.importStatus != "Đã nhập hàng" ?
                                                                <td><Chip variant="filled" color="error"
                                                                    label={item.importStatus}
                                                                />
                                                                </td> :
                                                                <td><Chip variant="filled" color="success"
                                                                    label={item.importStatus}
                                                                />
                                                                </td>
                                                        }
                                                    </tr>
                                                )
                                            )
                                        }
                                    </tbody>
                                </table>
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
                        }

                        {
                            warehouseReceipts?.length == 0 &&
                            <Empty message={"Chưa có nhập hàng"} />
                        }
                    </SubPurchasePage>
                    <SubPurchasePage
                        value={value}
                        index={1}
                    >
                        {
                            paymentSlips?.length != 0 &&
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th className="text-center">Mã phiếu </th>
                                        <th>Ngày lập</th>
                                        <th>Lý do</th>
                                        <th>Người nhận</th>
                                        <th>Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        paymentSlips?.map(
                                            ps => (
                                                <tr key={ps?.id}
                                                    className={cn("category")}>
                                                    <td className="text-center">{ps?.id}</td>
                                                    <td>{ps?.createdDate && formatDateTime(ps?.createdDate)}</td>
                                                    <td>{ps?.paymentReason}</td>
                                                    <td>
                                                        <div>
                                                            {ps?.payeeName}
                                                        </div>
                                                        <div
                                                            style={{
                                                                // color: "var(--grey-text)"
                                                                fontSize: "14px"
                                                            }}
                                                            className="text-primary"
                                                        >
                                                            {ps?.payeeType}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {VND.format(ps?.paid)}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </Table>
                        }

                        {
                            paymentSlips?.length == 0 &&
                            <Empty message={supplier?.debt == 0 ? "Không có công nợ" : "Chưa có thanh toán công nợ"} />
                        }
                    </SubPurchasePage>


                </Box>
            </div>
            <CreateSupplierModal
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
                setShow={setShowCreateModal}
                show={showCreateModal}
                setSupplier={setSupplierEdit}
                supplier={supplierEdit}
            />
            <ModalWarningDelete
                show={showWaringDelete}
                setShow={setShowWarningDelete}
                onCLickAgree={() => {
                    handleDelete()
                }}
            />
            <ModalWarningDelete
                message={supplier?.status == "ACTIVE" ? "Bạn có chắc chắn muốn ngừng hoạt động nhà cung cấp này" :
                    "Bạn có chắc chắn muốn bật hoạt động nhà cung cấp này"
                }
                show={showWaringInACtive}
                setShow={setShowWarningInActive}
                onCLickAgree={() => {
                    handleUpdateStatus()
                }}
            />
        </>
    )
}