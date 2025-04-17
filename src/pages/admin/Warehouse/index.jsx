import style from "./Warehouse.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from "../../../config/routes";
import classNames from "classnames/bind";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { searchProduct } from "../../../services/productService";
import { Button, Pagination } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import { createWarehouse, deleteWarehouse, searchWarehouse } from "../../../services/warehouseService";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import AlertSuccess from "../../../components/AlertSuccess";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
const cn = classNames.bind(style);



export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    var name = searchParams.get("name") ?? ""

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [warehouseRequest, setWarehouseRequest] = useState(
        {
            id: null,
            name: "",
            location: "",
            description: ""
        }
    );
    const [edit, setEdit] = useState(false);
    const [warehouseError, setWarehouseError] = useState(
        {
            name: ""
        }
    );
    const [showWaring, setShowWarning] = useState(false)
    const [isAgree, setIsAgree] = useState(false)
    const [showAlertError, setShowAlertError] = useState({
        message: "",
        show: false
    });
    const [showAlertSuccess, setShowAlertSuccess] = useState({
        message: "",
        show: false
    });
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setWarehouseRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setWarehouseError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên kho';
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    };



    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

    useEffect(
        () => {
            searchWarehouse(name, currentPage, pageSize).then(
                data => {
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
        [name, currentPage, edit]
    )
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        refreshRequest()
    }

    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }

    const handleSubmitWarehouse = () => {
        if (warehouseError.name.length == 0) {
            createWarehouse(warehouseRequest).then(
                data => {
                    console.log(data)
                    setEdit(!edit)
                    refreshRequest()
                }
            )
        }
    }
    useEffect(
        () => {
            if (isAgree) {
                deleteWarehouse(warehouseRequest.id).then(
                    data => {
                        console.log(data)
                        if (data.result == false) {
                            setShowAlertError(prev => ({
                                ...prev,
                                message: "Xóa kho thất bại! Kho đã chứa sản phẩm hoặc đang được sử dụng",
                                show: true
                            }))
                        }
                        else {
                            setShowAlertSuccess(prev => ({
                                ...prev,
                                message: "Xóa kho thành công",
                                show: true
                            }))
                        }
                        setEdit(!edit)
                    }
                )
            }
        }, [isAgree, showWaring]
    )

    const refreshRequest = () => {
        setWarehouseRequest(prev => ({
            ...prev,
            id: null,
            name: "",
            location: "",
            description: ""

        }))
    }
    return (
        <>
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3">
                        <Form.Group as={Col} className="col-4" controlId="formGridCity">
                            <Form.Control placeholder="Tên kho..."
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
                                <span>Tạo kho</span>
                            </Button>
                        </div>
                    </Row>
                </div>

                <div className="row">
                    <div className="col-4">
                        <AlertError message={showAlertError.message
                        }
                            showAlert={showAlertError.show}
                            onClose={() => setShowAlertError({ ...showAlertError, show: false })}
                        />
                        <AlertSuccess message={showAlertSuccess.message
                        }
                            showAlert={showAlertSuccess.show}
                            onClose={() => setShowAlertSuccess({ ...showAlertSuccess, show: false })}
                        />
                    </div>
                </div>

                <div className={cn("result-table")}>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th scope="col">Vị trí</th>
                                <th scope="col">Số lượng sản phẩm</th>
                                <th scope="col">Tồn kho</th>
                                <th scope="col">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results?.map(
                                    (item, index) => (
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.location}</td>
                                            <td>{item.productQuantity}</td>
                                            <td>{item.stock}</td>

                                            <td>
                                                <Button variant="contained"
                                                    onClick={() => {
                                                        setWarehouseRequest(item)
                                                        setShowCreateModal(true)
                                                    }}
                                                    className="me-1"
                                                    color="info">
                                                    <EditIcon
                                                        className={cn("edit-icon")} />
                                                </Button>
                                                <Button variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        setWarehouseRequest(item)
                                                        setShowWarning(true)
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        className={cn("edit-icon")}
                                                    />
                                                </Button>
                                            </td>

                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>

                </div>
            </div>
            <Modal
                centered
                show={showCreateModal} >
                <Modal.Header>
                    <Modal.Title>Thêm kho</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*  name */}
                    <div className={cn("mb-5 row")}>
                        <label for="fullName-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Tên kho
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="fullName-input-login"
                                className={cn("form-control", "input-item")}
                                name="name"
                                onChange={onInputChange}
                                value={warehouseRequest.name}

                            />

                            {warehouseError.name && (<span className={cn("text-danger")}>{warehouseError.name}</span>)}

                        </div>
                    </div>
                    {/* location */}
                    <div className={cn("mb-5 row")}>
                        <label
                            for="email-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Vị trí
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="email-input-login"
                                className={cn("form-control", "input-item")}
                                name="location"
                                onChange={onInputChange}
                                value={warehouseRequest.location}

                            />

                        </div>
                    </div>
                    {/* description */}
                    <div className={cn("mb-5 row")}>
                        <label
                            for="email-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Mô tả
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="email-input-login"
                                className={cn("form-control", "input-item")}
                                name="description"
                                onChange={onInputChange}
                                value={warehouseRequest.description}

                            />

                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant=""
                        size="lg"
                        onClick={handleCloseCreateModal}
                    >
                        Hủy
                    </Button>
                    <Button
                        size="lg"
                        variant="contained" color="error" onClick={
                            () => {
                                handleCloseCreateModal()
                                handleSubmitWarehouse()
                            }
                        }>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
            <ModalWarningDelete show={showWaring} setShow={setShowWarning}
                setIsAgree={setIsAgree}
            />
            <Pagination
                count={totalPage}
                size="large"
                page={currentPage}
                shape="rounded"
                color="success"
                onChange={handleChangePagination}
                className={cn("pagination", "mt-2")}
            />
        </>
    );
}