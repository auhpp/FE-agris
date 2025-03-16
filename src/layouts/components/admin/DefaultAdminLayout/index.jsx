import Header from "./../Header";
import Sidebar from "../Sidebar";
import style from "./DefaultAdminLayout.module.css";
import classNames from "classnames/bind";


const cn = classNames.bind(style);

export default function DefaultAdminLayout({ children }) {

    return (
        <>
            <main className={cn("main")}>
                <Sidebar />
                <div className={cn("main-content")}>
                    <Header />
                    <div className="container">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}