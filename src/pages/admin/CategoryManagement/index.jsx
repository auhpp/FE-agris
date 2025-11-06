import style from "./CategoryManagement.module.css";
import classNames from "classnames/bind";

import { Breadcrumbs, Button, Chip, CircularProgress, Pagination, Typography } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import SearchIcon from '@mui/icons-material/Search';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { searchOrder } from "../../../services/orderService";
import { OrderStatus, PaymentStatus, status } from "../../../utils/status";
import { VND } from "../../../utils/formatNumber";
import { formatDateTime } from "../../../utils/formatDate";
import { routes } from "../../../config/routes";
import { deleteCategory, searchCategory } from "../../../services/categoryService";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateCategoryModal from "../../../components/CreateCategoryModal";
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";

const cn = classNames.bind(style);
export default function CategoryManagement() {
    const [categories, setCategories] = useState([])
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate()
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showWaringDelete, setShowWarningDelete] = useState(false)
    const [categoryDelete, setCategoryDelete] = useState({
        id: null, name: ""
    });
    const [showDeleteError, setShowDeleteError] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const searchParams = new URLSearchParams(location.search)
    var name = searchParams.get("name") ?? ""
    const [categoryEdit, setCategoryEdit] = useState({
        id: null, name: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await searchCategory(name, currentPage, pageSize);
                console.log("data", data)
                setCategories(data?.result?.data)
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
    //         searchCategory(name, currentPage, pageSize).then(
    //             data => {
    //                 console.log("data", data)
    //                 setCategories(data?.result?.data)
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
        deleteCategory(categoryDelete.id).then(
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
    console.log(showCreateModal)
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
                            <Form.Control placeholder={"Tên danh mục ..."}
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
                                <span>Thêm danh mục</span>
                            </Button>
                        </div>
                        <AlertError

                            showAlert={showDeleteError}
                            onClose={() => setShowDeleteError(false)}
                            message={"Danh mục đã có sản phẩm!"}
                        />
                    </Row>
                </div>
                <div className={cn("shipment-table")}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className="text-center">Mã danh mục</th>
                                <th>Tên</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                categories?.map(
                                    cate => (
                                        <tr key={cate.id}
                                            className={cn("category")}>
                                            <td className="text-center">{cate.id}</td>
                                            <td>{cate.name}</td>
                                            <td>
                                                <Button variant="contained"
                                                    size="sm"
                                                    color="info"
                                                    className="me-1"
                                                    onClick={() => {
                                                        setShowCreateModal(true)
                                                        setCategoryEdit(cate)
                                                    }}
                                                >
                                                    <EditIcon
                                                        className={cn("edit-icon")} />
                                                </Button>
                                                <Button variant="contained"
                                                    color="error"
                                                    size="sm"
                                                    onClick={() => {
                                                        setCategoryDelete(cate)
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
                categories?.length != 0 &&
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
            <CreateCategoryModal
                show={showCreateModal}
                setShow={setShowCreateModal}
                category={categoryEdit}
                setCategory={setCategoryEdit}
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