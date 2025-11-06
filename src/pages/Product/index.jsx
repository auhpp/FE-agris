import { useEffect, useState } from "react";
import style from "./Product.module.css";
import classNames from "classnames/bind";
import { getAllCategory } from "../../services/categoryService";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../services/productService";
import Card from "../../components/Card";
import { CircularProgress, Pagination } from "@mui/material";
import Form from 'react-bootstrap/Form';
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

const cn = classNames.bind(style);

export default function Product() {
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const categoryIds = categoryId ? categoryId.split(',') : [];

    const priceFrom = searchParams.get('priceFrom') ?? "";
    const priceTo = searchParams.get('priceTo') ?? "";
    const [selectedCategories, setSelectedCategories] = useState();

    const [categoryQuery, setCategoryQuery] = useState(categoryIds);
    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(14);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    console.log(categoryId)
    useEffect(() => {
        (async () => {
            try {

                const data = await searchProduct({
                    name: "",
                    categoryId, priceFrom, priceTo, currentPage, pageSize, status: "ACTIVE"
                });
                if (data.result?.data) {
                    setResults(data.result?.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [priceFrom, priceTo, categoryId, currentPage])
    //Get all category
    useEffect(() => {
        getAllCategory().then(
            data => {
                setCategories(data.result)
            }
        )
    }, [])


    //category check box change
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
    useEffect(
        () => {
            navigate(
                `?${new URLSearchParams({
                    categoryId: categoryQuery,
                    priceFrom: priceFrom,
                    priceTo: priceTo
                })}`
            )
        }, [categoryQuery]
    )
    //Pagination
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
                                <form className={cn("block-content")}>
                                    {/* Danh mục chính */}
                                    <div className={cn("main-category")}>
                                        <h4 className={cn("title")}>Danh mục chính</h4>
                                        <ul className={cn("categories-list")}>
                                            {
                                                categories.map(
                                                    (item) => (
                                                        <li className={cn("category-item")}>
                                                            <input
                                                                checked={categoryQuery.find(a => a == item.id) ? true : false}
                                                                onChange={onChangeCheckCategory}
                                                                type="checkbox" name="categoryId"
                                                                value={item.id}
                                                                id={item.id} />
                                                            <label className={cn("name-category")}
                                                                htmlFor={item.id}>
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
                                            <Form.Group className={cn("category-item-price", "mb-2")} as={Row} controlId="formHorizontalEmail">
                                                <Form.Label className={cn("name-category")} column sm={3}>
                                                    Giá từ:

                                                </Form.Label>
                                                <Col sm={9}>
                                                    <Form.Control
                                                        onChange={(e) => {
                                                            navigate(
                                                                `?${new URLSearchParams({
                                                                    categoryId: categoryId,
                                                                    priceFrom: e.target.value,
                                                                    priceTo: priceTo
                                                                })}`
                                                            )
                                                        }}
                                                        className={cn("col-2")} type="number"
                                                        name="priceFrom" id="inputPriceFrom" />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className={cn("category-item-price", "mb-3")} controlId="formHorizontalEmail">
                                                <Form.Label className={cn("name-category")} column sm={3}>
                                                    Giá đến:
                                                </Form.Label>
                                                <Col sm={9}>
                                                    <Form.Control
                                                        className="col-4"
                                                        onChange={(e) => {
                                                            navigate(
                                                                `?${new URLSearchParams({
                                                                    categoryId: categoryId,
                                                                    priceFrom: priceFrom,
                                                                    priceTo: e.target.value
                                                                })}`
                                                            )
                                                        }}
                                                        type="number" name="priceTo" id="input-price" />
                                                </Col>
                                            </Form.Group>

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
                                    {/* <div className={cn("filter-btn row")}>
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
                                    </div> */}
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
                                {
                                    loading ?
                                        (
                                            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                                                <CircularProgress color="success" size="3rem" />
                                            </div>
                                        ) : (
                                            <>
                                                {/* <!-- Hiển thị products --> */}
                                                <div className={cn("products-list")}>
                                                    <div className={cn("row", "products")}>
                                                        {
                                                            results.map(
                                                                (item) => (

                                                                    <div key={item.id}
                                                                        className={cn("col-xl-3", "col-md-3", "col-6", "product")}>
                                                                        <Card product={item} />
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                {/* <!-- End hiển thị products --> */}

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

                                            </>
                                        )

                                }
                                {/* <!-- end title --> */}
                            </div>
                        </div>
                        {/* <!-- end product --> */}
                    </div>
                </div >
            </section >
        </>
    );
}