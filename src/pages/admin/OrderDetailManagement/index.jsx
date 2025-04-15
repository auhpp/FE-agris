import { useEffect, useState } from "react";
import style from "./OrderDetailManagement.module.css";
import classNames from "classnames/bind";
import { useLocation } from "react-router-dom";
import { searchOrder } from "../../../services/orderService";
import OrderDetail from "../../../components/OrderDetailComponent";
import OrderDetailComponent from "../../../components/OrderDetailComponent";

const cn = classNames.bind(style);
export default function OrderDetailManagement() {
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order);

    // useEffect(
    //     () => {
    //         searchOrder(orderId, "", "", 1, 10).then(
    //             data => {
    //                 console.log("data", data)
    //                 setOrder(data?.result.data)
    //             }
    //         )
    //     }, [orderId]
    // )
    return (
        <>
            {
                order && (
                    <OrderDetailComponent
                        order={order}
                        setOrder={setOrder}
                        isAdmin={true}
                    />
                )
            }
        </>
    )
}