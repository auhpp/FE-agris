import { useLocation } from "react-router-dom";
import OrderDetailComponent from "../../components/OrderDetailComponent";

export default function OrderDetail() {
    const location = useLocation();
    var order = location.state?.order;
    console.log("order detail", order)
    return (
        <>
            <OrderDetailComponent order={order} />
        </>
    )
}