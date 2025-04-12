import style from "./Warehouse.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from "../../../config/routes";
import classNames from "classnames/bind";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { searchProduct } from "../../../services/productService";
import { Pagination } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { createWarehouse, deleteWarehouse, searchWarehouse } from "../../../services/warehouseService";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import AlertSuccess from "../../../components/AlertSuccess";

const cn = classNames.bind(style);



export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState(
        new URLSearchParams(location.search).get("name") || ""
    );
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

    const handleSubmitSearch = (e) => {
        e.preventDefault();

        // Update URL with query parameters when form is submitted
        const searchParams = new URLSearchParams();
        if (query) searchParams.set("name", query);

        navigate(`?${searchParams.toString()}`);

    }
    useEffect(
        () => {
            searchWarehouse(query, currentPage, pageSize).then(
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
        [query, currentPage, edit]
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

            <div className="container">
                <form onSubmit={handleSubmitSearch} method="get">
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

            <button onClick={() => setShowCreateModal(true)} className={cn("btn-8", "mb-2", "col-2", "offset-10")}>
                <AddIcon />
                <span>
                    Thêm Kho
                </span>
            </button>
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
                                            <EditIcon
                                                onClick={() => {
                                                    setWarehouseRequest(item)
                                                    setShowCreateModal(true)
                                                }}
                                                className={cn("edit-icon")} />
                                            <DeleteIcon
                                                className={cn("edit-icon")}

                                                onClick={() => {
                                                    setWarehouseRequest(item)
                                                    setShowWarning(true)
                                                }}
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
        </>
    );
}