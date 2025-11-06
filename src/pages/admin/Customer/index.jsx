import classNames from "classnames/bind";
import style from "./Customer.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { Button, Chip, Pagination } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import { isEmail, isPhoneNumber } from "../../../utils/validate";
import { createStaff, searchStaff } from "../../../services/staffService";
import { sendConfirmAccountEmail } from "../../../services/emailService";
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { CustomerStatus, StaffStatus } from "../../../utils/status";
import { searchCustomer } from "../../../services/customerService";
import { routes } from "../../../config/routes";

const cn = classNames.bind(style);
export default function Customer() {
    const navigate = useNavigate();
    const location = useLocation();
    var searchParams = new URLSearchParams(location.search);
    var query = searchParams.get("query") ?? ""
    var status = searchParams.get("status") ?? ""
    var [isEdit, setIsEdit] = useState(false);

    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

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
            searchCustomer("", request.fullName, request.email, request.phoneNumber,
                status, currentPage, pageSize).then(
                    data => {
                        console.log("customer", data)
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
                                            onClick={() => navigate(routes.customerDetail.replace(":id", item.id))}
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
                                                    color={CustomerStatus[item?.status]?.color}
                                                    label={CustomerStatus[item?.status]?.name}
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

            {/* <ModalWarningDelete show={showWaring} setShow={setShowWarning}
                setIsAgree={setIsAgree}
            /> */}
        </>
    );
}
