import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import { checkPayment } from "../../services/paymentService";
import { deleteOrder, updatePaymentStatus } from "../../services/orderService";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import style from "./PaymentCallbackComponent.module.css";
import classNames from "classnames/bind";

const cn = classNames.bind(style);

export default function PaymentCallbackComponent() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    console.log("search", location.search)
    const vnpResponseCode = searchParams.get("vnp_ResponseCode")
    const vnpTxnRef = searchParams.get("vnp_TxnRef")
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    useEffect(
        () => {
            checkPayment(location.search).then(
                data => {
                    console.log(data);
                    if (data.result == 1) {
                        updatePaymentStatus("PAID", vnpTxnRef).then(
                            data => {
                                if (data.code == 200) {
                                    console.log(data)
                                    setIsSuccess(true)
                                }
                            }
                        )
                    }
                    else {
                        // deleteOrder(vnpTxnRef)
                        setIsSuccess(false)
                    }

                }
            )
        }, []
    )
    return (
        <>
            <div className={cn("bg")}>
                <div className={cn("container", "d-flex", "card-notification")}>
                    <Card sx={{ minWidth: 375 }} className="p-2" >
                        <CardContent>
                            <Typography variant="h4" className="text-center">
                                {
                                    isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"
                                }
                            </Typography>
                        </CardContent>
                        <CardActions className="p-2 border-top d-flex justify-content-center">
                            <Button
                                onClick={() => navigate(routes.purchase, { replace: true })}
                                className="col" color="info" size="large">OK</Button>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </>
    )
}