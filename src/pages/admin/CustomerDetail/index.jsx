import { useLocation, useNavigate } from "react-router-dom";
import style from "./CustomerDetail.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { deleteSupplier, searchSupplier } from "../../../services/supplierService";
import { Avatar, Box, Button, Chip, Pagination, Tab, Tabs } from "@mui/material";
import { CustomerStatus, SupplierStatus } from "../../../utils/status";
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
import { searchCustomer, updateUser } from "../../../services/customerService";
import { searchOrder } from "../../../services/orderService";
import { GENDER } from "../../../utils/enum";
import OrderList from "../../../components/OrderList";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StopIcon from '@mui/icons-material/Stop';
const cn = classNames.bind(style);
export default function CustomerDetail() {
    const location = useLocation();
    const customerId = Number.parseInt(location.pathname.substring(location.pathname.lastIndexOf("/") + 1))
    console.log("id", customerId)
    const [customer, setCustomer] = useState();
    const [isUpdate, setIsUpdate] = useState(false)
    const [sizeOrders, setSizeOrders] = useState(false)

    const navigate = useNavigate()
    useEffect(
        () => {
            searchCustomer(customerId, "", "", "", "", "", "").then(
                data => {
                    setCustomer(data.result.data[0])
                }
            )
        }, [customerId, isUpdate]
    )

    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [showDeleteError, setShowDeleteError] = useState(false)

    const handleDelete = () => {
        if (customer.status == "ACTIVE")
            customer.status = "INACTIVE"
        else
            customer.status = "ACTIVE"
        updateUser(customer).then(
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
    return (
        <>
            <AlertError
                showAlert={showDeleteError}
                onClose={() => setShowDeleteError(false)}
                message={"Đã có lỗi! Vui lòng thử lại!"}
            />
            <div className="text-end d-flex align-items-center justify-content-between">
                <div
                    className="navigate-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIosIcon />
                    <span>QUAY LẠI</span>
                </div>
                <Button variant="contained"
                    color={customer?.status == "ACTIVE" ? "error" : "info"}
                    size="sm"
                    onClick={() => {
                        setShowWarningDelete(true)
                    }}
                >
                    {
                        customer?.status == "ACTIVE" ? (
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
            </div>
            <div className="align-self-stretch">
                <div className={cn("main-content")}>
                    <div className="d-flex gap-2 align-items-center">
                        <Avatar
                            alt="Remy Sharp"
                            src={customer?.avatar}
                            sx={{ width: 50, height: 50 }}
                        />
                        <h4 className={cn("name-supplier")}>
                            {customer?.fullName}
                        </h4>
                        {
                            <Chip
                                style={{ "fontSize": "13px" }}
                                label={CustomerStatus[customer?.status]?.name}
                                color={CustomerStatus[customer?.status]?.color} variant="outlined" />
                        }
                    </div>
                    <div className="debt border-top mt-3">
                        <div className="mt-1 content">
                            <ul>
                                <li className="row">
                                    <div className="col-2">
                                        Tên đăng nhập:
                                    </div>
                                    <div className="col">
                                        {customer?.userName}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Email:
                                    </div>
                                    <div className="col">
                                        {customer?.email}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Số điện thoại:
                                    </div>
                                    <div className="col">
                                        {customer?.phoneNumber}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Giới tính:
                                    </div>
                                    <div className="col">
                                        {GENDER[customer?.gender]}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <div className="col-4">
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
                </div> */}
            </div>
            <div className={cn("main-content", "mt-4")}>
                <Box>
                    <div className={cn("header")}>
                        <Box
                            className={cn("content-header")}
                        >
                            <Tabs
                                aria-label="basic tabs example"
                                value={0}
                            >
                                <Tab
                                    style={{ "font-size": "12px" }}
                                    label="Danh sách đơn hàng"
                                />

                            </Tabs>
                        </Box>

                    </div>

                    <SubPurchasePage
                        value={0}
                        index={0}
                    >
                        <OrderList customerId={customerId} />
                    </SubPurchasePage>


                </Box>
            </div>

            <ModalWarningDelete
                message={customer?.status == "ACTIVE" ? "Bạn có chắc chắn muốn ngừng hoạt động tài khoản này" :
                    "Bạn có chắc chắn muốn bật hoạt động tài khoản này"
                }
                show={showWaringDelete}
                setShow={setShowWarningDelete}
                onCLickAgree={() => {
                    handleDelete()
                }}
            />
        </>
    )
}