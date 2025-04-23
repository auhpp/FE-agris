import style from "./CalculationUnit.module.css";
import classNames from "classnames/bind";

import { Button, CircularProgress, Pagination } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import { deleteCalculationUnit, searchCalculationUnit } from "../../../services/calculationUnitService";
import CreateCalculationUnitModal from "../../../components/CreateCalculationUnitModal";

const cn = classNames.bind(style);
export default function CalculationUnit() {
    const [calculationUnits, setCalculationUnits] = useState([])
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate()
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [calculationUnitDelete, setCalculationUnitDelete] = useState({
        id: null, name: ""
    });
    const [showDeleteError, setShowDeleteError] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const searchParams = new URLSearchParams(location.search)
    var name = searchParams.get("name") ?? ""
    const [calculationUnitEdit, setCalculationUnitEdit] = useState({
        id: null, name: "", description: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await searchCalculationUnit(name, currentPage, pageSize);
                console.log("data", data)
                setCalculationUnits(data?.result?.data)
                setTotalPage(data.result?.totalPage)
                setCurrentPage(data.result?.currentPage)
                setPageSize(data.result?.pageSize)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [currentPage, name, isUpdate])

    // useEffect(
    //     () => {
    //         searchCalculationUnit(name, currentPage, pageSize).then(
    //             data => {
    //                 console.log("data", data)
    //                 setCalculationUnits(data?.result?.data)
    //                 setTotalPage(data.result?.totalPage)
    //                 setCurrentPage(data.result?.currentPage)
    //                 setPageSize(data.result?.pageSize)
    //             }
    //         )
    //     }, [currentPage, name, isUpdate]
    // )
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }
    const handleDelete = () => {
        deleteCalculationUnit(calculationUnitDelete.id).then(
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
    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <CircularProgress color="success" size="3rem" />
            </div>
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
                            <Form.Control placeholder={"Tên đơn vị tính ..."}
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            name: e.target.value
                                        })}`
                                    )
                                }}
                                value={name}
                            />
                        </Form.Group>
                        <div className="col-2"
                        >
                            <Button onClick={() => setShowCreateModal(true)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Thêm đơn vị tính</span>
                            </Button>
                        </div>
                        <AlertError

                            showAlert={showDeleteError}
                            onClose={() => setShowDeleteError(false)}
                            message={"Đơn vị tính đã được sản phẩm sử dụng!"}
                        />
                    </Row>
                </div>
                <div className={cn("shipment-table")}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className="text-center">Mã ĐVT</th>
                                <th>Tên</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                calculationUnits?.map(
                                    cal => (
                                        <tr key={cal.id}
                                            className={cn("category")}>
                                            <td className="text-center">{cal.id}</td>
                                            <td>{cal.name}</td>
                                            <td>
                                                <Button variant="contained"
                                                    size="sm"
                                                    color="info"
                                                    className="me-1"
                                                    onClick={() => {
                                                        setShowCreateModal(true)
                                                        setCalculationUnitEdit(cal)
                                                    }}
                                                >
                                                    <EditIcon
                                                        className={cn("edit-icon")} />
                                                </Button>
                                                <Button variant="contained"
                                                    color="error"
                                                    size="sm"
                                                    onClick={() => {
                                                        setCalculationUnitDelete(cal)
                                                        setShowWarningDelete(true)
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        className={cn("delete-icon")} />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            {
                calculationUnits?.length != 0 &&
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
            <CreateCalculationUnitModal
                show={showCreateModal}
                setShow={setShowCreateModal}
                calculationUnit={calculationUnitEdit}
                setCalculationUnit={setCalculationUnitEdit}
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