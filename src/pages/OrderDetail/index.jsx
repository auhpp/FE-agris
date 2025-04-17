import { useLocation } from "react-router-dom";
import OrderDetailComponent from "../../components/OrderDetailComponent";
import { useEffect, useState } from "react";
import { searchOrder } from "../../services/orderService";

export default function OrderDetail() {
    const location = useLocation();
    var orderId = location.state?.order;
    const [order, setOrder] = useState();
    useEffect(
        () => {
            searchOrder(orderId.id, "", "", 1, 10).then(
                data => {
                    setOrder(data.result.data[0])
                }
            )
        }, []
    )
    return (
        <>
            <OrderDetailComponent order={order}
                setOrder={setOrder}
            />
        </>
    )
}