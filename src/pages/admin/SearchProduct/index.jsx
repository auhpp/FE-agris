import style from "./SearchProduct.module.css";
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from "../../../config/routes";
import classNames from "classnames/bind";
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { getAllCategory } from "../../../services/categoryService";
import { useEffect, useState } from "react";
import { deleteProduct, searchProduct } from "../../../services/productService";
import { Button, Chip, CircularProgress, Pagination } from "@mui/material";
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { ProductStatus } from "../../../utils/status";

const cn = classNames.bind(style);



export default function SearchProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    var name = searchParams.get("name") ?? ""
    var categoryId = searchParams.get("categoryId") ?? ""

    //get all category
    var [categories, setCategories] = useState([]);
    useEffect(
        () => {
            getAllCategory().then(
                data => { setCategories(data.result) }
            );
        }, []
    )
    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

    const [loading, setLoading] = useState(true);
    //call api 
    useEffect(() => {
        (async () => {
            try {
                const data = await searchProduct({ name, categoryId, currentPage, pageSize, searchAllStock: true });
                if (data.result?.data) {
                    setResults(data.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                    console.log(data)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [name, categoryId, currentPage])


    // useEffect(
    //     () => {
    //         searchProduct({ name, categoryId, currentPage, pageSize, searchAllStock: true }).then(
    //             data => {
    //                 if (data.result?.data) {
    //                     setResults(data.result.data)
    //                     setTotalPage(data.result.totalPage)
    //                     setCurrentPage(data.result.currentPage)
    //                     setPageSize(data.result.pageSize)
    //                     console.log(data)
    //                 }
    //             }
    //         );
    //     },
    //     [name, categoryId, currentPage]
    // )
    const handleDeleteProduct = (item) => {
        deleteProduct(item.id).then(
            setResults(
                results.filter(a => a.id != item.id)
            )
        );

    }

    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
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

            {/* <div className="container">
                <form onSubmit={handleSubmitSearch} method="get">
                    <div className={cn("row", "form-search-content")}>
                        <input type="text"
                            className={cn("input-search", "col-6")}
                            placeholder="Nhập từ khóa tìm kiếm tại đây..."
                            onChange={onSearchInputChange}
                            name="name"
                        />
                        <div className={cn("col-4")}>
                            <select
                                name="categoryId"
                                className={cn("form-select", "input-item")} aria-label="Default select example"
                                onChange={onSearchInputChange}
                            >
                                <option selected value={""}>-- Chọn danh mục --</option>
                                {
                                    categories.map(
                                        (item, index) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </form>
            </div> */}
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Control placeholder="Tên sản phẩm..."
                                onChange={(e) => {

                                    navigate(
                                        `?${new URLSearchParams({
                                            name: e.target.value,
                                            categoryId: categoryId
                                        })}`
                                    )
                                }}
                                value={name}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {

                                    navigate(
                                        `?${new URLSearchParams({
                                            name: name,
                                            categoryId: e.target.value
                                        })}`
                                    )
                                }}
                            >
                                <option selected value={""}>-- Chọn danh mục --</option>
                                {
                                    categories.map(
                                        (item, index) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                    )
                                }

                            </Form.Select>
                        </Form.Group>
                        <div className="col-2"
                        >
                            <Button onClick={() => navigate(routes.createProduct)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Tạo sản phẩm</span>
                            </Button>
                        </div>
                    </Row>
                </div>

                <div className={cn("result-table")}>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Tên</th>
                                <th></th>
                                <th scope="col">Danh mục</th>
                                <th scope="col">Tồn kho</th>
                                <th scope="col">KH đặt</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Thao tác</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                results?.map(
                                    (item, index) => (
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>
                                                <img className={cn("thumbnail")} src={item.thumbnail} alt="" />
                                            </td>
                                            <td>{item.category.name}</td>
                                            <td>{
                                                item.stock + " trong " + item.variants.length + " biến thể"
                                            }</td>
                                            <td className="text-center">
                                                {item.reserved}
                                            </td>
                                            <td>
                                                <Chip
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ fontSize: "14px" }}
                                                    color={item.status == "ACTIVE" ? "success" : "warning"}
                                                    label={ProductStatus[item.status]}
                                                />
                                            </td>
                                            <td>
                                                <Button variant="contained"
                                                    color="info"
                                                    size="small"
                                                    className="me-1 mb-1"
                                                    onClick={() => {
                                                        navigate(routes.createProduct, { state: { item, isEdit: true } })
                                                    }}
                                                >
                                                    <EditIcon
                                                        className={cn("edit-icon")} />
                                                </Button>
                                                <Button
                                                    size="small"
                                                    className="me-1 mb-1"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => {
                                                        navigate(routes.createProduct, { state: { isView: true, item } })
                                                    }}
                                                >
                                                    <MenuIcon className={cn("menu-icon")}
                                                    />
                                                </Button>
                                                <Button variant="contained"
                                                    size="small"
                                                    color="error"
                                                    className="mb-1"
                                                    onClick={() => handleDeleteProduct(item)}
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
                    </table>
                </div>

                <div class="modal fade " tabindex="-1" id="warning-modal" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class={cn("modal-content", "modal-inner-content")}>
                            <div class="modal-header">
                                <h3 className={cn("modal-title", "text-danger")}>Cảnh báo!</h3>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class={cn("modal-body", "attribute-form")}>
                                <p>Bạn có chắc chắn xóa ?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class={cn("btn-8", "pt-0", "pb-0")} data-bs-dismiss="modal">Hủy</button>
                                <button type="button" class={cn("btn-da", "btn-danger", "btn", "btn-lg")}>Đồng ý</button>
                            </div>
                        </div>
                    </div>
                </div >
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
        </>
    );
}