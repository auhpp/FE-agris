import style from "./PaymentSlip.module.css";
import classNames from "classnames/bind";

import { Breadcrumbs, Button, Chip, Pagination, Typography } from "@mui/material";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import SearchIcon from '@mui/icons-material/Search';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { searchOrder } from "../../../services/orderService";
import { OrderStatus, PaymentStatus, status } from "../../../utils/status";
import { VND } from "../../../utils/formatNumber";
import { formatDateTime } from "../../../utils/formatDate";
import { routes } from "../../../config/routes";
import { deleteCategory, searchCategory } from "../../../services/categoryService";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateCategoryModal from "../../../components/CreateCategoryModal";
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import AlertError from "../../../components/AlertError";
import { getAllPayeeType, searchPaymentSlip } from "../../../services/paymentSlipService";
import CreatePaymentSlipModal from "../../../components/CreatePaymentSlipModal";
import { getAllPaymentReason } from "../../../services/paymentReasonService";
import { PayeeType } from "../../../utils/enum";

const cn = classNames.bind(style);
export default function PaymentSlip() {
    const [paymentSlips, setPaymentSlips] = useState([])
    var [totalPage, setTotalPage] = useState(1);
    var [currentPage, setCurrentPage] = useState(1);
    var [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate()
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)
    const searchParams = new URLSearchParams(location.search)
    var id = searchParams.get("id") ?? ""
    var payeeTypeId = searchParams.get("payeeTypeId") ?? ""
    var paymentReasonId = searchParams.get("paymentReasonId") ?? ""

    useEffect(
        () => {
            searchPaymentSlip(id, payeeTypeId, paymentReasonId, currentPage, pageSize,  "").then(
                data => {
                    console.log("data", data)
                    setPaymentSlips(data?.result?.data)
                    setTotalPage(data.result?.totalPage)
                    setCurrentPage(data.result?.currentPage)
                    setPageSize(data.result?.pageSize)
                }
            )
        }, [currentPage, id, isUpdate, payeeTypeId, paymentReasonId]
    )
    const handleChangePagination = (e, p) => {
        setCurrentPage(p)
    }
    const [paymentReasons, setPaymentReasons] = useState([])
    const [payeeTypes, setPayeeTypes] = useState([])
    useEffect(
        () => {
            getAllPaymentReason().then(
                data => {
                    console.log("payment reasons", data)
                    setPaymentReasons(data?.result)
                }
            )
        }, []
    )


    useEffect(
        () => {
            getAllPayeeType().then(
                data => {
                    console.log("payee type", data)
                    setPayeeTypes(data?.result)
                }
            )
        }, []
    )
    console.log(showCreateModal)
    return (
        <>
            <div className={cn("main-content")}>
                <div className={cn("filter-form")}>
                    <Row className="mb-3 align-items-center">
                        <Form.Group
                            className="col-4"
                            as={Col} controlId="formGridCity">
                            <Form.Control placeholder={"Mã phiếu chi..."}
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            id: e.target.value,
                                            paymentReasonId: paymentReasonId,
                                            payeeTypeId: payeeTypeId
                                        })}`
                                    )
                                }}
                                value={id}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            id: id,
                                            paymentReasonId: e.target.value,
                                            payeeTypeId: payeeTypeId
                                        })}`
                                    )
                                }}
                            >
                                <option value={""}>--Lý do--</option>
                                {
                                    paymentReasons.map(
                                        pr => (
                                            <option selected={paymentReasonId == pr.id} value={pr.id}>
                                                {pr.name}</option>
                                        )
                                    )
                                }


                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Select
                                onChange={(e) => {
                                    navigate(
                                        `?${new URLSearchParams({
                                            id: id,
                                            paymentReasonId: paymentReasonId,
                                            payeeTypeId: e.target.value
                                        })}`
                                    )

                                }}
                            >
                                <option value={""}>--Loại người nhận--</option>
                                {
                                    payeeTypes.map(
                                        pr => (
                                            <option selected={payeeTypeId == pr.id} value={pr.id}>
                                                {PayeeType[pr.name]}</option>
                                        )
                                    )
                                }


                            </Form.Select>
                        </Form.Group>
                        <div className="col-2"
                        >
                            <Button onClick={() => setShowCreateModal(true)}
                                variant="contained" color="primary">
                                <ControlPointIcon />
                                <span>Tạo phiếu chi</span>
                            </Button>
                        </div>

                    </Row>
                </div>
                <div className={cn("shipment-table")}>
                    <Table hover>
                        <thead>
                            <tr>
                                <th className="text-center">Mã phiếu </th>
                                <th>Ngày lập</th>
                                <th>Lý do</th>
                                <th>Người nhận</th>
                                <th>Giá trị</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                paymentSlips?.map(
                                    ps => (
                                        <tr key={ps?.id}
                                            className={cn("category")}>
                                            <td className="text-center">{ps?.id}</td>
                                            <td>{ps?.createdDate && formatDateTime(ps?.createdDate)}</td>
                                            <td>{ps?.paymentReason}</td>
                                            <td>
                                                <div>
                                                    {ps?.payeeName}
                                                </div>
                                                <div
                                                    style={{
                                                        // color: "var(--grey-text)"
                                                        fontSize: "14px"
                                                    }}
                                                    className="text-primary"
                                                >
                                                    {ps?.payeeType}
                                                </div>
                                            </td>
                                            <td>
                                                {VND.format(ps?.paid)}
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            {
                paymentSlips?.length != 0 &&
                <Pagination
                    count={totalPage}
                    size="large"
                    page={currentPage}
                    shape="rounded"
                    color="success"
                    onChange={handleChangePagination}
                    className={cn("pagination")}
                />
            }
            <CreatePaymentSlipModal
                show={showCreateModal}
                setShow={setShowCreateModal}
                isUpdate={isUpdate}
                setIsUpdate={setIsUpdate}
            />

        </>
    )
}