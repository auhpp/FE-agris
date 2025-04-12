import style from "./ImportGoods.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';

import Search from "../../../layouts/components/admin/Search";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config/routes";
import { useEffect, useState } from "react";
import { getAllWarehouseReceipt, importWarehouse } from "../../../services/warehouseService";
import { Pagination } from "@mui/material";
import { formatDate, formatDateTime } from "../../../utils/formatDate";
import { VND } from "../../../utils/formatNumber";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Button from 'react-bootstrap/Button';
import WarehouseReceipt from "../../../components/WarehouseReceipt";
import ReactPDF from '@react-pdf/renderer';

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

    useEffect(() => {
        getAllWarehouseReceipt(currentPage, pageSize).then(
            data => {
                if (data.result?.data) {
                    setResults(data.result.data)
                    setTotalPage(data.result.totalPage)
                    setCurrentPage(data.result.currentPage)
                    setPageSize(data.result.pageSize)
                    console.log(data)
                }
            }
        )
    }, [currentPage, isEdit])

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
    return (
        <>
            <Search nameInputSearch={"name"} displaySelect={false} />
            <button
                onClick={() => navigate(routes.goodsReceipt)}
                className={cn("btn-8", "mb-2", "col-2", "offset-7")}>
                <AddIcon />
                <span>
                    Nhập hàng
                </span>
            </button>
            <div className={cn("result-table")}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Mã phiếu nhập</th>
                            <th scope="col">Ngày tạo</th>
                            <th scope="col">Nhà cung cấp</th>
                            <th scope="col">Tiền nợ NCC</th>
                            <th scope="col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results?.map(
                                (item, index) => (
                                    <tr onClick={() => handleClickReceipt(item)}>
                                        <td>{item.id}</td>
                                        <td>{formatDateTime(item.createdDate)}</td>
                                        <td>{item.supplier.name}</td>
                                        <td>{VND.format(item.outstandingDebt)}</td>
                                        {
                                            item.importStatus != "Đã nhập hàng" ?
                                                <td><Button variant="danger">{item.importStatus}</Button>
                                                </td> :
                                                <td><Button variant="success">{item.importStatus}</Button>
                                                </td>
                                        }
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
                <Pagination
                    count={totalPage}
                    size="large"
                    page={currentPage}
                    shape="rounded"
                    color="success"
                    onChange={handleChangePagination}
                    className={cn("pagination")}
                />
            </div>




            <div>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className={cn("receipt-modal")}
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