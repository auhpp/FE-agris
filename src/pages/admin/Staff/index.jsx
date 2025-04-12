import classNames from "classnames/bind";
import style from "./Staff.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { createWarehouse, deleteWarehouse, searchWarehouse } from "../../../services/warehouseService";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import AlertSuccess from "../../../components/AlertSuccess";
import { isEmail, isPhoneNumber } from "../../../utils/validate";
import { createStaff, searchStaff } from "../../../services/staffService";
import { sendConfirmAccountEmail } from "../../../services/emailService";

const cn = classNames.bind(style);
export default function Staff() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState(
        new URLSearchParams(location.search).get("query") || ""
    );
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
                            email: "Email đã được sử dụng"
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

    const handleSubmitSearch = (e) => {
        e.preventDefault();

        // Update URL with query parameters when form is submitted
        const searchParams = new URLSearchParams();
        if (query) searchParams.set("query", query);

        navigate(`?${searchParams.toString()}`);

    }
    useEffect(
        () => {
            var request = {
                fullName: "",
                phoneNumber: "",
                email: ""
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
        [query, currentPage, isEdit]
    )

    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }
    return (
        <>

            <div className="container">
                <form
                    onSubmit={handleSubmitSearch}
                    method="get">
                    <div className={cn("row", "form-search-content")}>
                        <input type="text"
                            className={cn("input-search", "col-6")}
                            placeholder="Nhập từ khóa tìm kiếm tại đây..."
                            onChange={(e) => setQuery(e.target.value)}
                            name="name"
                            value={query}
                        />
                        <button className={cn("btn-3", "btn-search", "col-1", "ms-2")} type="submit">
                            <span>Tìm kiếm</span>
                        </button>
                    </div>
                </form>
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

            <button onClick={() => setShowCreateModal(true)} className={cn("btn-8", "mb-2", "col-2", "offset-10")}>
                <AddIcon />
                <span>
                    Thêm nhân viên
                </span>
            </button>
            <div className={cn("result-table")}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Tên</th>
                            <th scope="col">Tên đăng nhập</th>
                            <th scope="col">SĐT</th>
                            <th scope="col">Email</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results?.map(
                                (item, index) => (
                                    <tr>
                                        <td>{item.fullName}</td>
                                        <td>{item.userName}</td>
                                        <td>{item.phoneNumber}</td>
                                        <td>{item.email}</td>
                                        <td>{item.status}</td>
                                        <td>
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
                                        </td>

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
