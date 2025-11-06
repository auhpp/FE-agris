import style from "./Supplier.module.css";
import classNames from "classnames/bind";

import { Button, Chip, Pagination } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import { deleteSupplier, searchSupplier } from "../../../services/supplierService";
import { VND } from "./../../../utils/formatNumber";
import CreateSupplierModal from "../../../components/CreateSupplierModal";
import { routes } from "./../../../config/routes"
import SelectProvince from "../../../components/SelectProvince";
import SelectWard from "../../../components/SelectWard";
import SelectDistrict from "../../../components/SelectDistrict";
import { SupplierStatus } from "../../../utils/status";
const cn = classNames.bind(style);
export default function Supplier() {
    const [suppliers, setSuppliers] = useState([])
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate()
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [supplierDelete, setSupplierDelete] = useState({
        id: null, name: ""
    });
    const [showDeleteError, setShowDeleteError] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const searchParams = new URLSearchParams(location.search)
    var name = searchParams.get("name") ?? ""
    var email = searchParams.get("email") ?? ""
    var phoneNumber = searchParams.get("phoneNumber") ?? ""

    const [supplier, setSupplier] = useState({
        id: null, name: "", email: "", phoneNumber: "", address: "", contactName: ""
    });
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [deliveryAddress, setDeliveryAddress] = useState();
    useEffect(
        () => {
            searchSupplier(name, email, phoneNumber, currentPage, pageSize).then(
                data => {
                    console.log("data", data)
                    setSuppliers(data?.result?.data)
                    setTotalPage(data.result?.totalPage)
                    setCurrentPage(data.result?.currentPage)
                    setPageSize(data.result?.pageSize)
                }
            )
        }, [currentPage, name, email, phoneNumber, isUpdate]
    )
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }
    const handleDelete = () => {
        deleteSupplier(supplier.id).then(
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
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3 align-items-center">
                        <Form.Group
                            className="col-4"
                            as={Col} controlId="formGridCity">
                            <Form.Control placeholder={"Tên nhà cung cấp ..."}
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            name: e.target.value,
                                            email: email,
                                            phoneNumber: phoneNumber
                                        })}`
                                    )
                                }}
                                value={name}
                            />
                        </Form.Group>
                        <Form.Group
                            className="col-4"
                            as={Col} controlId="formGridCity">
                            <Form.Control
                                type="email"
                                placeholder={"email..."}
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            name: name,
                                            email: e.target.value,
                                            phoneNumber: phoneNumber
                                        })}`
                                    )
                                }}
                                value={email}
                            />
                        </Form.Group>
                        <Form.Group
                            className="col-4"
                            as={Col} controlId="formGridCity">
                            <Form.Control placeholder={"Số điện thoại..."}

                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            name: name,
                                            email: email,
                                            phoneNumber: e.target.value
                                        })}`
                                    )
                                }}
                                value={phoneNumber}
                            />
                        </Form.Group>

                        <div className="col-2 mt-2"
                        >
                            <Button onClick={() => setShowCreateModal(true)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Thêm nhà cung cấp</span>
                            </Button>
                        </div>
                        <AlertError

                            showAlert={showDeleteError}
                            onClose={() => setShowDeleteError(false)}
                            message={"Đã có dữ liệu nhập hàng từ nhà cung cấp này   "}
                        />
                    </Row>
                </div>
                <div className={cn("shipment-table")}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className="text-center">Mã NCC</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Trạng thái</th>
                                <th>Nợ NCC</th>
                                {/* <th>Thao tác</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                suppliers?.map(
                                    sup => (
                                        <tr
                                            onClick={() => navigate(routes.supplierDetail.replace(":id", sup.id))}
                                            key={sup.id}
                                            className={cn("category")}>
                                            <td className="text-center">{sup.id}</td>
                                            <td>{sup.name}</td>
                                            <td>{sup.email}</td>
                                            <td>{sup.phoneNumber}</td>
                                            <td>
                                                {
                                                    sup.status == "ACTIVE" ?
                                                        <Chip
                                                            style={{ "fontSize": "13px" }}
                                                            label={SupplierStatus[sup.status]}
                                                            color="primary" variant="outlined" />
                                                        :
                                                        <Chip
                                                            style={{ "fontSize": "13px" }}
                                                            label={SupplierStatus[sup.status]}
                                                            color="error" variant="outlined" />
                                                }
                                            </td>
                                            <td>{VND.format(sup.debt)}</td>
                                            {/* <td>
                                                <Button variant="contained"
                                                    color="error"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSupplier(sup)
                                                        setShowWarningDelete(true)
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        className={cn("delete-icon")} />
                                                </Button>
                                            </td> */}
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div >
            {
                suppliers?.length != 0 &&
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
            <CreateSupplierModal
                show={showCreateModal}
                setShow={setShowCreateModal}
                supplier={supplier}
                setSupplier={setSupplier}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
            />
            <ModalWarningDelete
                show={showWaringDelete}
                setShow={setShowWarningDelete}
                onCLickAgree={() => {
                    handleDelete()
                }}
            />
        </>
    )
}