import Header from "../components/Header";

export default function HeaderLayout({ children }) {
    return (
        <>
            <Header />
            <main className="main">
                <div className="container">
                    {children}
                </div>
            </main>
        </>
    );
}