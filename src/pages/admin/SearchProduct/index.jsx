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
import { Pagination } from "@mui/material";
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
const cn = classNames.bind(style);



export default function SearchProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState({
        name: new URLSearchParams(location.search).get("name") || "",
        categoryId: new URLSearchParams(location.search).get("categoryId") || "",
    });
    const onSearchInputChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target)
        setQuery((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
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

    const handleSubmitSearch = (e) => {
        e.preventDefault();

        // Update URL with query parameters when form is submitted
        const searchParams = new URLSearchParams();
        if (query.name) searchParams.set("name", query.name);
        if (query.categoryId) searchParams.set("categoryId", query.categoryId);

        navigate(`?${searchParams.toString()}`);

    }
    useEffect(
        () => {
            const name = query.name;
            const categoryId = query.categoryId;
            searchProduct({ name, categoryId, currentPage, pageSize }).then(
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
        [query, currentPage]
    )
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

    return (
        <>

            <div className="container">
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


                        <button className={cn("btn-3", "btn-search", "col-2")} type="submit">
                            <span>Tìm kiếm</span>
                        </button>
                    </div>
                </form>
            </div>


            <button onClick={() => navigate(routes.createProduct)} className={cn("btn-8", "mb-2", "col-2", "offset-10")}>
                <AddIcon />
                <span>
                    Thêm sản phẩm
                </span>
            </button>
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
                                            <Badge bg={item.status == "ACTIVE" ? "success" : "warning"}>

                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button variant="secondary"
                                                size="sm"
                                                className="me-1"
                                            >
                                                <EditIcon
                                                    onClick={() => {
                                                        navigate(routes.createProduct, { state: { item, isEdit: true } })
                                                    }}
                                                    className={cn("edit-icon")} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="me-1"
                                                variant="success">
                                                <MenuIcon className={cn("menu-icon")}
                                                    onClick={() => {
                                                        navigate(routes.createProduct, { state: { isView: true, item } })
                                                    }}
                                                />
                                            </Button>
                                            <Button variant="danger"
                                                size="sm"
                                            >
                                                <DeleteIcon
                                                    onClick={() => handleDeleteProduct(item)}
                                                    className={cn("delete-icon")} />
                                            </Button>
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
        </>
    );
}