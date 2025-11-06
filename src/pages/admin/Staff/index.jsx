import classNames from "classnames/bind";
import style from "./Staff.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { Button, Chip, Pagination } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import { createWarehouse, deleteWarehouse, searchWarehouse } from "../../../services/warehouseService";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import AlertSuccess from "../../../components/AlertSuccess";
import { isEmail, isPhoneNumber } from "../../../utils/validate";
import { createStaff, searchStaff } from "../../../services/staffService";
import { sendConfirmAccountEmail } from "../../../services/emailService";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { StaffStatus } from "../../../utils/status";
import { routes } from "../../../config/routes";

const cn = classNames.bind(style);
export default function Staff() {
    const navigate = useNavigate();
    const location = useLocation();
    var searchParams = new URLSearchParams(location.search);
    var query = searchParams.get("query") ?? ""
    var status = searchParams.get("status") ?? ""

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [staffRequest, setStaffRequest] = useState(
        {
            id: null,
            fullName: "",
            email: ""
        }
    );
    const [staffError, setStaffError] = useState(
        {
            email: "",
            fullName: ""
        }
    );
    const [isEdit, setIsEdit] = useState(false);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setStaffRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setStaffError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'email':
                    if (!isEmail(value)) {
                        stateObj[name] = 'Vui lòng nhập đúng email';
                    }
                    break;
                case 'fullName':
                    if (!(value)) {
                        stateObj[name] = 'Vui lòng nhập họ tên';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };


    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        refreshRequest()
    }
    const refreshRequest = () => {
        setStaffRequest(prev => ({
            ...prev,
            id: null,
            fullName: "",
            email: ""
        }))
    }
    const handleSubmitStaff = () => {
        if (staffError.email.length == 0 && staffRequest.fullName != "" && staffRequest.email != "") {
            sendConfirmAccountEmail(staffRequest.fullName, staffRequest.email).then(
                data => {
                    if (data.code != 200) {
                        setStaffError({
                            ...staffError,
                            email: "Nhân viên này đã có tài khoản"
                        })
                    }
                    else {
                        handleCloseCreateModal()
                        setIsEdit(true)
                    }
                }
            )
        }
    }

    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

    useEffect(
        () => {
            var request = {
                id: "",
                fullName: "",
                phoneNumber: "",
                email: "",
                status: status
            };
            if (isEmail(query)) {
                request.email = query;
            }
            else if (isPhoneNumber(query)) {
                request.phoneNumber = query;
            }
            else {
                request.fullName = query;
            }
            searchStaff(request, currentPage, pageSize).then(
                data => {
                    console.log(data)
                    if (data.result?.data) {
                        setResults(data.result.data)
                        setTotalPage(data.result.totalPage)
                        setCurrentPage(data.result.currentPage)
                        setPageSize(data.result.pageSize)
                        console.log(data)
                    }
                }
            );
        },
        [query, status, currentPage, isEdit]
    )

    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }
    return (
        <>
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3">
                        <Form.Group className="col-5" as={Col} controlId="formGridState">
                            <Form.Control placeholder="Nhập từ khóa tìm kiếm..."
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            query: e.target.value,
                                            status: status

                                        })}`
                                    )
                                }}
                                value={query}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            query: query,
                                            status: e.target.value
                                        })}`
                                    )
                                }}
                            >
                                <option value={""}>--Trạng thái--</option>
                                <option selected={status == "ACTIVE"} value={"ACTIVE"}>
                                    Đang hoạt động</option>
                                <option selected={status == "INACTIVE"} value={"INACTIVE"}>
                                    Ngừng hoạt động</option>

                            </Form.Select>
                        </Form.Group>
                        <div className="col-2"
                        >
                            <Button onClick={() => setShowCreateModal(true)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Thêm nhân viên</span>
                            </Button>
                        </div>
                    </Row>
                </div>

                <div className="row">
                    <div className="col-4">
                        {/* <AlertError message={showAlertError.message
                    }
                        showAlert={showAlertError.show}
                        onClose={() => setShowAlertError({ ...showAlertError, show: false })}
                    />
                    <AlertSuccess message={showAlertSuccess.message
                    }
                        showAlert={showAlertSuccess.show}
                        onClose={() => setShowAlertSuccess({ ...showAlertSuccess, show: false })}
                    /> */}
                    </div>
                </div>

                <div className={cn("result-table")}>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Tên đăng nhập</th>
                                <th scope="col">SĐT</th>
                                <th scope="col">Email</th>
                                <th scope="col">Trạng thái</th>
                                {/* <th scope="col">Thao tác</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results?.map(
                                    (item, index) => (
                                        <tr
                                            onClick={() => navigate(routes.staffDetail.replace(":id", item.id))}
                                        >
                                            <td>{item.fullName}</td>
                                            <td>{item.userName}</td>
                                            <td>{item.phoneNumber}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <Chip
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ fontSize: "14px" }}
                                                    color={item.status && StaffStatus[item.status].color}
                                                    label={item.status && StaffStatus[item.status].name}
                                                />
                                            </td>
                                            {/* <td>
                                                <EditIcon
                                                    // onClick={() => {
                                                    //     setWarehouseRequest(item)
                                                    //     setShowCreateModal(true)
                                                    // }}
                                                    className={cn("edit-icon")} />
                                                <DeleteIcon
                                                    className={cn("edit-icon")}

                                                // onClick={() => {
                                                //     setWarehouseRequest(item)
                                                //     setShowWarning(true)
                                                // }}
                                                />
                                            </td> */}

                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                count={totalPage}
                size="large"
                page={currentPage}
                shape="rounded"
                color="success"
                onChange={handleChangePagination}
                className={cn("pagination", "mt-2")}
            />
            <Modal
                centered
                show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*  name */}
                    <div className={cn("mb-5 row")}>
                        <label for="fullName-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Họ tên
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="fullName-input-login"
                                className={cn("form-control", "input-item")}
                                name="fullName"
                                onChange={onInputChange}
                                value={staffRequest.fullName}

                            />
                            {staffError.fullName && (<span className={cn("text-danger")}>{staffError.fullName}</span>)}


                        </div>
                    </div>

                    {/* email */}
                    <div className={cn("mb-5 row")}>
                        <label
                            for="email-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Email
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="email-input-login"
                                className={cn("form-control", "input-item")}
                                name="email"
                                onChange={onInputChange}
                                value={staffRequest.email}

                            />
                            {staffError.email && (<span className={cn("text-danger")}>{staffError.email}</span>)}

                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary"
                        size="lg"
                        onClick={handleCloseCreateModal}
                    >
                        Hủy
                    </Button>
                    <Button
                        size="lg"
                        variant="success" onClick={
                            () => {
                                handleSubmitStaff()
                            }
                        }>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* <ModalWarningDelete show={showWaring} setShow={setShowWarning}
                setIsAgree={setIsAgree}
            /> */}
        </>
    );
}
