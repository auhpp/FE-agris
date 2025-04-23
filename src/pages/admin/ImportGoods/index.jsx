import style from "./ImportGoods.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';

import Search from "../../../layouts/components/admin/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { useEffect, useState } from "react";
import { getAllWarehouseReceipt, importWarehouse, searchWarehouseReceipt } from "../../../services/warehouseService";
import { Button, Chip, CircularProgress, Pagination } from "@mui/material";
import { formatDate, formatDateTime } from "../../../utils/formatDate";
import { VND } from "../../../utils/formatNumber";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import WarehouseReceipt from "../../../components/WarehouseReceipt";
import ReactPDF from '@react-pdf/renderer';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { getAllSupplier } from "../../../services/supplierService";

const cn = classNames.bind(style);


export const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1500,
    bgcolor: 'background.paper',
    p: 2
};
export default function ImportGoods() {
    const navigate = useNavigate()
    var [results, setResults] = useState([]);
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    var [isEdit, setIsEdit] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    var supplierId = searchParams.get("supplierId") ?? ""
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await searchWarehouseReceipt(supplierId, currentPage, pageSize);
                if (data.result?.data) {
                    setResults(data.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                    console.log(data)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        })()
    }, [currentPage, isEdit, supplierId])


    // useEffect(() => {
    //     searchWarehouseReceipt(supplierId, currentPage, pageSize).then(
    //         data => {
    //             if (data.result?.data) {
    //                 setResults(data.result.data)
    //                 setTotalPage(data.result.totalPage)
    //                 setCurrentPage(data.result.currentPage)
    //                 setPageSize(data.result.pageSize)
    //                 console.log(data)
    //             }
    //         }
    //     )
    // }, [currentPage, isEdit, supplierId])

    useEffect(
        () => {
            getAllSupplier().then(
                data => {
                    setSuppliers(data.result)
                }
            )
        }, []

    )

    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [receiptInfo, setReceiptInfo] = useState();

    const handleClickReceipt = (receipt) => {
        setReceiptInfo(receipt)
        handleOpen()
    }

    const handleImportGoods = () => {
        importWarehouse(receiptInfo.id).then(
            data => {
                if (data.code == 200) {
                    handleClose()
                    setIsEdit(!isEdit)
                }
            }
        )
    }
    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <CircularProgress color="success" size="3rem" />
            </div>
        )
    }
    return (
        <>
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3">
                        <Form.Group className="col-5" as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            supplierId: e.target.value
                                        })}`
                                    )
                                }}
                            >
                                <option selected value={""}>-- Chọn nhà cung cấp --</option>
                                {
                                    suppliers?.map(
                                        (item, index) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        )
                                    )
                                }

                            </Form.Select>
                        </Form.Group>
                        <div className="col-2"
                        >
                            <Button onClick={() => navigate(routes.goodsReceipt)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Nhập hàng</span>
                            </Button>
                        </div>
                    </Row>
                </div>
                <div className={cn("result-table")}>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center" scope="col">Mã phiếu nhập</th>
                                <th scope="col">Ngày tạo</th>
                                <th scope="col">Nhà cung cấp</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                results?.map(
                                    (item, index) => (
                                        <tr onClick={() => handleClickReceipt(item)}>
                                            <td className="text-center">{item.id}</td>
                                            <td>{formatDateTime(item.createdDate)}</td>
                                            <td>{item.supplier.name}</td>
                                            <td>{VND.format(item.amount)}</td>
                                            {
                                                item.importStatus != "Đã nhập hàng" ?
                                                    <td>
                                                        <Chip
                                                            // style={{fontSize: "14px"}}
                                                            variant="filled" color="error" label={item.importStatus} />
                                                    </td> :
                                                    <td>  <Chip variant="filled" color="success" label={item.importStatus} />
                                                    </td>
                                            }
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination
                count={totalPage}
                size="large"
                page={currentPage}
                shape="rounded"
                color="success"
                onChange={handleChangePagination}
                className={cn("pagination", "mt-2")}
            />

            <div>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className={cn("receipt-modal")}
                    style={{ overflow: "scroll" }}
                >
                    <Box sx={styleModal}>
                        <div className={cn("head")}>
                            <span>Phiếu nhập</span>
                            <CloseIcon onClick={handleClose} />
                        </div>
                        <WarehouseReceipt receiptInfo={receiptInfo} />
                        <div className={cn("mt-2", "btn-bottom")}>
                            {/* <button className={cn("export-btn", "btn-3")}
                            >
                                Xuất phiếu
                            </button> */}
                            {
                                receiptInfo?.importStatus != "Đã nhập hàng" &&
                                <button className={cn("import-goods", "btn-3")}
                                    onClick={handleImportGoods}
                                >
                                    Xác nhận nhập hàng
                                </button>
                            }
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
} 