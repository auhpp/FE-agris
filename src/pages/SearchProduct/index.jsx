import { useEffect, useState } from "react";
import style from "./SearchProduct.module.css";
import classNames from "classnames/bind";
import { Link, useLocation } from "react-router-dom";
import { searchProduct } from "../../services/productService";
import Card from "../../components/Card";
import { CircularProgress, Pagination } from "@mui/material";
import SearchOffIcon from '@mui/icons-material/SearchOff';
const cn = classNames.bind(style);

export default function SearchProduct() {
    const location = useLocation();
    const [query, setQuery] = useState(
        new URLSearchParams(location.search).get("name") || ""
    );
    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(18);
    var [totalElement, setTotalElement] = useState(0);

    useEffect(() => {
        setQuery(new URLSearchParams(location.search).get("name"))
    }, [new URLSearchParams(location.search).get("name")])

    //Search product
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const name = query;
                const data = await searchProduct({ name, currentPage, pageSize, status: "ACTIVE" });
                console.log("data", data)
                setResults(data.result?.data)
                setTotalPage(data.result.totalPage)
                setCurrentPage(data.result.currentPage)
                setPageSize(data.result.pageSize)
                setTotalElement(data.result.totalElements)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [currentPage, query])


    //Pagination
    const handleChangePagination = (e, p) => {
        setCurrentPage(p);
    }
    return (
        <>
            <div className="col">

                <div className={cn("main-content")}>
                    {/* Breadcrumb */}
                    <div className={cn("row")}>
                        <section className={cn("breadcrumb-divider", "breadcrumb-divider-cus", "col-lg-6")}>
                            {/* <div className={cn("container")}> */}
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
                            {/* </div> */}
                        </section>
                    </div>
                    {/* End breadcrumb */}

                    {/* result list */}
                    {
                        loading ?
                            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                                <CircularProgress color="success" size="3rem" />
                            </div> : (
                                <>
                                    {/* <!-- product --> */}
                                    <div className={cn("products-section")}>
                                        {/* <!-- title --> */}
                                        <div className={cn("head-title")}>
                                            {
                                                totalElement != 0 ?
                                                    <h2 className={cn("title")}>
                                                        {"Có " + totalElement + " kết quả tìm kiếm phù hợp"}
                                                    </h2>
                                                    :
                                                    <h2 className={cn("not-found-title")}>
                                                        <SearchOffIcon style={{fontSize: 40}} className="me-2" />
                                                        {
                                                            "Không tìm thấy bất kỳ kết quả nào với từ khóa trên."
                                                        }
                                                    </h2>
                                            }
                                        </div>
                                        {/* <!-- end title --> */}
                                        {/* <!-- Hiển thị sách --> */}
                                        <div className={cn("products-list")}>
                                            <div className={cn("row", "products")}>
                                                {
                                                    results.map(
                                                        (item) => (
                                                            <div key={item.id} 
                                                            className={cn("col-xl-2", "col-md-4", "col-4", "mb-3")}>
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
                                </>

                            )

                    }
                </div>
            </div>
        </>
    );
}   
