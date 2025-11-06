import { useLocation, useNavigate } from "react-router-dom";
import style from "./StaffDetail.module.css";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { deleteSupplier, searchSupplier } from "../../../services/supplierService";
import { Avatar, Box, Button, Chip, Pagination, Tab, Tabs } from "@mui/material";
import { CustomerStatus, StaffStatus, SupplierStatus } from "../../../utils/status";
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
import { recallStaff, searchStaff, updateStaff } from "../../../services/staffService";
import StopIcon from '@mui/icons-material/Stop';
import { routes } from "../../../config/routes";
const cn = classNames.bind(style);
export default function StaffDetail() {
    const location = useLocation();
    const staffId = Number.parseInt(location.pathname.substring(location.pathname.lastIndexOf("/") + 1))
    console.log("id", staffId)
    const [staff, setStaff] = useState();
    const [isUpdate, setIsUpdate] = useState(false)
    const [sizeOrders, setSizeOrders] = useState(false)

    const navigate = useNavigate()
    useEffect(
        () => {
            searchStaff({
                id: staffId, fullName: "", email: "", phoneNumber: "",
                status: ""
            }, 1, 10).then(
                data => {
                    console.log(data)
                    setStaff(data.result.data[0])
                }
            )
        }, [staffId, isUpdate]
    )

    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [showWaringRecall, setShowWarningRecall] = useState(false)
    const [showDeleteError, setShowDeleteError] = useState(false)

    const handleDelete = () => {
        if (staff.status == "ACTIVE")
            staff.status = "INACTIVE"
        else
            staff.status = "ACTIVE"
        updateStaff(staff).then(
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
    const handleRecall = () => {
        recallStaff(staff.id).then(
            (data) => {
                if (data.code == 200) {
                    navigate(routes.staff, { replace: true })
                }
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
                {
                    staff?.status == "WAITING" ? (
                        <>
                            <Button variant="contained"
                                color={"error" }
                                size="sm"
                                onClick={() => {
                                    setShowWarningRecall(true)
                                }}
                            >
                                <DeleteIcon
                                    className={cn("delete-icon")} />
                                <span>Thu hồi</span>
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained"
                            color={staff?.status == "ACTIVE" ? "error" : "info"}
                            size="sm"
                            onClick={() => {
                                setShowWarningDelete(true)
                            }}
                        >

                            {
                                staff?.status == "ACTIVE" ? (
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
                    )

                }
            </div >
            <div className="align-self-stretch">
                <div className={cn("main-content")}>
                    <div className="d-flex gap-2 align-items-center">
                        <Avatar
                            alt="Remy Sharp"
                            src={staff?.avatar}
                            sx={{ width: 50, height: 50 }}
                        />
                        <h4 className={cn("name-supplier")}>
                            {staff?.fullName}
                        </h4>
                        {
                            <Chip
                                style={{ "fontSize": "13px" }}
                                label={StaffStatus[staff?.status]?.name}
                                color={StaffStatus[staff?.status]?.color} variant="outlined" />
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
                                        {staff?.userName}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Email:
                                    </div>
                                    <div className="col">
                                        {staff?.email}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Số điện thoại:
                                    </div>
                                    <div className="col">
                                        {staff?.phoneNumber}
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col-2">
                                        Giới tính:
                                    </div>
                                    <div className="col">
                                        {GENDER[staff?.gender]}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ModalWarningDelete
                message={staff?.status == "ACTIVE" ? "Bạn có chắc chắn muốn ngừng hoạt động tài khoản này" :
                    "Bạn có chắc chắn muốn bật hoạt động tài khoản này"
                }
                show={showWaringDelete}
                setShow={setShowWarningDelete}
                onCLickAgree={() => {
                    handleDelete()
                }}
            />
            <ModalWarningDelete
                message={"Bạn có chắc chắn muốn thu hồi tài khoản này"
                }
                show={showWaringRecall}
                setShow={setShowWarningRecall}
                onCLickAgree={() => {
                    handleRecall()
                }}
            />
        </>
    )
}