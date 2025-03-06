import style from "./Search.module.css";
import { BsSearch } from "react-icons/bs";
import classNames from "classnames/bind";
const cn = classNames.bind(style);

export default function Search() {
    return (
        <>
            {/* <!-- Input search san pham --> */}
            <div className={cn("col-xl-6", "col-12", "myOrder-lg-1")}>
                <form action="#" className={cn("search-bar")}>
                    <input type="text" name="query" placeholder="Tìm kiếm ở đây..."
                        value="" />
                    <button type="submit" className={cn("btn-1", "btn-search")}>
                        <BsSearch className={cn("search-icon")} />
                    </button>
                </form>
            </div>
            {/* <!-- end Input search san pham --> */}
        </>
    );
}