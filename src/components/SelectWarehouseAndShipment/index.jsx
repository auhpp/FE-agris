import { Button, FormControl, InputLabel, Menu, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllShipment } from "../../services/shipmentService";
import { formatDate } from "../../utils/formatDate";
import Dropdown from 'react-bootstrap/Dropdown';
import CloseIcon from '@mui/icons-material/Close';

export default function SelectWarehouseAndShipment({
    productVariantId, warehouseRequest, setWarehouseRequest, order, orderQuantity
}) {
    const [warehouses, setWarehouses] = useState([])

    useEffect(
        () => {
            getAllShipment(productVariantId).then(
                data => {
                    setWarehouses(data.result)
                }
            )
        }, [productVariantId]
    )


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [shipment, setShipment] = useState([]);

    const handleClose = (wdId, sm) => {
        var valid = true;
        warehouseRequest.forEach(element => {
            var found = element.warehouseDetailId.find(a => a == wdId)
            if (found) {
                valid = false;
            }
        });
        var sumStock = shipment.reduce(
            (acc, current) => {
                return acc + current.quantity;
            }, 0
        )
        if (sumStock >= orderQuantity) {
            valid = false;
        }
        if (valid) {
            var whr = warehouseRequest.find(a => a.productVariantId == productVariantId)
            if (whr) {
                whr.warehouseDetailId = [...whr.warehouseDetailId, wdId];
            }
            else {
                setWarehouseRequest(prev => [
                    ...warehouseRequest, {
                        productVariantId: productVariantId,
                        warehouseDetailId: [wdId]
                    }
                ])
            }
            if (sm)
                setShipment([...shipment, sm])
        }
        setAnchorEl(null);
    };
    console.log("shipment", shipment)
    const handleDeleteShipment = (sm, wdId) => {
        warehouseRequest.forEach(element =>
            element.warehouseDetailId = element.warehouseDetailId.filter(a => a !== wdId)
        )
        setWarehouseRequest(warehouseRequest)
        setShipment(shipment.filter(a => a.id !== sm.id))
    }
    return (
        <>
            <div className="warehouse-shipment row align-items-center">
                {
                    order.orderStatus == "WAIT_FOR_CONFIRMATION" &&
                    <div div className="mt-1 col-2">
                        {
                            order.orderStatus != "CANCELED" &&
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                Chọn kho và lô
                            </Button>
                        }
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            {
                                warehouses.map(
                                    sm => (
                                        sm.warehouseDetail.map(
                                            wd => (
                                                <MenuItem onClick={() => handleClose(wd.warehouseDetailId, sm)}>
                                                    <div className="me-3">{wd.warehouseName + " - " + sm.name}</div>
                                                    <div className="me-3"> {sm.expiry && "HSD:" + formatDate(sm.expiry)}</div>
                                                    <div>Tồn: {sm.quantity}</div>
                                                </MenuItem>
                                            )
                                        )

                                    )
                                )
                            }
                        </Menu>
                    </div>
                }
                {
                    shipment.length != 0 && order.orderStatus == "WAIT_FOR_CONFIRMATION" &&
                    <div className="col">

                        {
                            shipment.map(
                                sm => (
                                    sm.warehouseDetail.map(
                                        wd => (
                                            <MenuItem
                                                style={{ "width": "fit-content" }}
                                                onClick={() => handleClose(wd.warehouseDetailId)}>
                                                <div className="me-3">{wd.warehouseName + " - " + sm.name}</div>
                                                <div className="me-3"> {sm.expiry && "HSD:" + formatDate(sm.expiry)}</div>
                                                {
                                                    sm.quantity &&
                                                    <div>Tồn: {sm.quantity}</div>
                                                }
                                                <CloseIcon onClick={() => {
                                                    handleDeleteShipment(sm, wd.warehouseDetailId)
                                                }} className="ms-2" />
                                            </MenuItem>
                                        )
                                    )

                                )
                            )
                        }
                    </div>
                }

            </div >
        </>
    )
}