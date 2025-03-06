import Footer from "../components/Footer";
import Header from "../components/Header";
import style from "./DefaultLayout.module.css";
import classNames from "classnames/bind";

const cn = classNames.bind(style);
export default function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <main className={cn("main")}>
                <div className={cn("container")}>
                    {children}
                </div>
            </main>
            <Footer />
        </>
    );
}