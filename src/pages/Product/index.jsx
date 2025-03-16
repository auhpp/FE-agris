import { useEffect, useState } from "react";
import style from "./Product.module.css";
import classNames from "classnames/bind";
import { getAllCategory } from "../../services/categoryService";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../services/productService";
import Card from "../../components/Card";
import { Pagination } from "@mui/material";

const cn = classNames.bind(style);

export default function Product() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const [query, setQuery] = useState({
        categoryId: new URLSearchParams(location.search).get("categoryId") || "",
        priceFrom: null,
        priceTo: null
    });

    useEffect(() => {
        getAllCategory().then(
            data => {
                setCategories(data.result)
            }
        )
    }, [])

    const [categoryQuery, setCategoryQuery] = useState([]);
    const onInputChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target)
        setQuery((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onChangeCheckCategory = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            setCategoryQuery(
                [...categoryQuery, value]
            )
        }
        else {
            setCategoryQuery(
                categoryQuery.filter(a => a != value)
            )
        }
    };

    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);

    const handleSubmit = (e) => {
        e.preventDefault();
        setQuery((prev) => ({
            ...prev,
            categoryId: categoryQuery.join(", ")
        }))
    }

    useEffect(
        () => {
            const name = "";
            const categoryId = query.categoryId;
            const priceFrom = query.priceFrom;
            const priceTo = query.priceTo;
            searchProduct({ name, categoryId, priceFrom, priceTo, currentPage, pageSize }).then(
                data => {
                    if (data.result?.data) {
                        setResults(data.result?.data)
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

    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }

    return (
        <>
            <section className={cn("products-by-category")}>
                <div className={cn("container")}>
                    <div className={cn("row inner-wrap")}>
                        {/* filter */}
                        <div className={cn("col-lg-3")}>
                            <div className={cn("filter")}>
                                {/* Title lọc theo */}
                                <div className={cn("head-title")}>
                                    <div className={cn("title")}>
                                        <i className="fa-solid fa-filter"></i>
                                        <h2 className={cn("main-title")}>Lọc theo</h2>
                                    </div>
                                    <div className={cn("icon-display")}>
                                        <i className="fa-solid fa-sort-down show"></i>
                                    </div>
                                </div>

                                {/* Các lựa chọn lọc */}
                                <form onSubmit={handleSubmit} className={cn("block-content")}>
                                    {/* Danh mục chính */}
                                    <div className={cn("main-category")}>
                                        <h4 className={cn("title")}>Danh mục chính</h4>
                                        <ul className={cn("categories-list")}>
                                            {
                                                categories.map(
                                                    (item) => (
                                                        <li className={cn("category-item")}>
                                                            <input
                                                                onChange={onChangeCheckCategory}
                                                                type="checkbox" name="categoryId"
                                                                value={item.id}
                                                                id={item.id} />
                                                            <label className={cn("name-category")} htmlFor={item.id}>
                                                                {/* Tên danh mục */}
                                                                {item.name}
                                                            </label>
                                                        </li>
                                                    )
                                                )
                                            }
                                        </ul>
                                        <div className={cn("show-more")}>Xem thêm</div>
                                    </div>

                                    {/* Giá */}
                                    <div className={cn("price")}>
                                        <h4 className={cn("title")}>Giá</h4>
                                        <ul className={cn("categories-list")}>
                                            <li className={cn("category-item")}>
                                                <label className={cn("name-category")} htmlFor="inputPriceFrom">
                                                    Giá từ:
                                                </label>
                                                <input
                                                    onChange={onInputChange}
                                                    className={cn("ms-3")} type="number" name="priceFrom" id="inputPriceFrom" />
                                            </li>
                                            <li className={cn("category-item")}>
                                                <label className={cn("name-category")} htmlFor="input-price">
                                                    Giá đến:
                                                </label>
                                                <input
                                                    onChange={onInputChange}
                                                    type="number" name="priceTo" id="input-price" />
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Sắp xếp */}
                                    {/* <div className={cn("NPH")}>
                                        <h4 className={cn("title")}>Sắp xếp theo:</h4>
                                        <ul className={cn("categories-list")}>
                                            <li className={cn("category-item")}>
                                                <input type="radio" name="sort" id="price-default" value="" />
                                                <label className={cn("name-category")} htmlFor="price-default">
                                                    Mặc định
                                                </label>
                                            </li>
                                            <li className={cn("category-item")}>
                                                <input type="radio" name="sort" id="price-asc" value="asc" />
                                                <label className={cn("name-category")} htmlFor="price-asc">
                                                    Giá tiền tăng dần
                                                </label>
                                            </li>
                                            <li className={cn("category-item")}>
                                                <input type="radio" name="sort" id="price-desc" value="desc" />
                                                <label className={cn("name-category")} htmlFor="price-desc">
                                                    Giá tiền giảm dần
                                                </label>
                                            </li>
                                        </ul>
                                    </div> */}
                                    {/* Nút xóa & xem kết quả */}
                                    <div className={cn("filter-btn row")}>
                                        <div className={cn("col-6 col-lg-12 col-xl-6 text-center")}>
                                            <button type="reset" className={cn("btn-3 btn-reset")}>
                                                Xóa kết quả
                                            </button>
                                        </div>
                                        <div className={cn("col-6 col-lg-12 col-xl-6 text-center")}>
                                            <button type="submit" className={cn("btn-3")}>
                                                Xem kết quả
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* end filter */}
                        {/* <!-- product --> */}
                        <div className={cn("col-lg-9")}>
                            <div className={cn("products-section")}>
                                {/* <!-- title --> */}
                                <div className={cn("head-title")}>
                                    <h2 className={cn("title")}>Sản phẩm</h2>
                                </div>
                                {/* <!-- end title --> */}
                                {/* <!-- Hiển thị sách --> */}
                                <div className={cn("products-list")}>
                                    <div className={cn("row", "products")}>
                                        {
                                            results.map(
                                                (item) => (

                                                    <div key={item.id} className={cn("col-xl-3", "col-md-3", "col-6", "product")}>
                                                        <Card product={item} />
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                                {/* <!-- End hiển thị sách --> */}

                                {/* <!-- pagination --> */}
                                <Pagination
                                    count={totalPage}
                                    size="large"
                                    page={currentPage}
                                    shape="rounded"
                                    color="success"
                                    onChange={handleChangePagination}
                                    className={cn("pagination")}
                                />
                                {/* <!-- end pagination --> */}
                            </div>
                        </div>
                        {/* <!-- end product --> */}
                    </div>
                </div >
            </section >
        </>
    );
}