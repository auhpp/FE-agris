import { useEffect, useState } from "react";
import style from "./SearchProduct.module.css";
import classNames from "classnames/bind";
import { getAllCategory } from "../../services/categoryService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../services/productService";
import Card from "../../components/Card";
import { Pagination } from "@mui/material";

const cn = classNames.bind(style);

export default function SearchProduct() {
    const location = useLocation();
    const [query, setQuery] = useState(
        new URLSearchParams(location.search).get("name") || ""
    );

    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    var [totalElement, setTotalElement] = useState(0);

    useEffect(
        () => {
            const name = query;

            searchProduct({ name, currentPage, pageSize }).then(
                data => {
                    if (data.result?.data) {
                        setResults(data.result?.data)
                        setTotalPage(data.result.totalPage)
                        setCurrentPage(data.result.currentPage)
                        setPageSize(data.result.pageSize)
                        setTotalElement(data.result.totalElements)
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
            <section>
                {/* Breadcrumb */}
                <div className={cn("row")}>
                    <section className={cn("breadcrumb-divider", "breadcrumb-divider-cus", "col-lg-6")}>
                        <div className={cn("container")}>
                            <nav aria-label="breadcrumb">
                                <ol className={cn("breadcrumb", "breadcrumb-cus")}>
                                    <li className={cn("breadcrumb-item", "breadcrumb-item-cus")}>
                                        <Link to={"/"}>Trang chủ</Link>
                                    </li>
                                    <li className={cn("breadcrumb-item", "breadcrumb-item-cus", "active")} aria-current="page">
                                        <a>Tìm kiếm</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </section>
                </div>

                {/* End breadcrumb */}
                {/* result list */}
                {/* <!-- product --> */}
                <div className={cn("products-section")}>
                    {/* <!-- title --> */}
                    <div className={cn("head-title")}>
                        <h2 className={cn("title")}>
                            {
                                totalElement != 0 ? "Có " + totalElement + " kết quả tìm kiếm phù hợp" :
                                    "Không tìm thấy bất kỳ kết quả nào với từ khóa trên."
                            }
                        </h2>
                    </div>
                    {/* <!-- end title --> */}
                    {/* <!-- Hiển thị sách --> */}
                    <div className={cn("products-list")}>
                        <div className={cn("row", "products")}>
                            {
                                results.map(
                                    (item) => (

                                        <div key={item.id} className={cn("col-xl-2", "col-md-4", "col-4", "product")}>
                                            <Card product={item} />
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                    {/* <!-- End hiển thị sách --> */}

                    {/* <!-- pagination --> */}
                    {
                        totalElement != 0 && (
                            <Pagination
                                count={totalPage}
                                size="large"
                                page={currentPage}
                                shape="rounded"
                                color="success"
                                onChange={handleChangePagination}
                                className={cn("pagination")}
                            />
                        )
                    }
                    {/* <!-- end pagination --> */}
                </div>
                {/* <!-- end product --> */}
            </section>
        </>
    );
}   
