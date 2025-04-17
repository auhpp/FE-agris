import style from "./CreatePaymentSlipModal.module.css"
import classNames from "classnames/bind";
import { createCalculationUnit } from "../../services/calculationUnitService";
import { use, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "@mui/material";
import { isEmail, isFullNameValid, isPhoneNumber } from "./../../utils/validate"
import { createSupplier, findSupplier, searchSupplier } from "../../services/supplierService";
import AlertError from "../AlertError";
import SelectProvince from "../SelectProvince";
import SelectDistrict from "../SelectDistrict";
import SelectWard from "../SelectWard";
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/esm/Row";
import InputGroup from 'react-bootstrap/InputGroup';
import AddIcon from '@mui/icons-material/Add';
import { createPaymentReason, getAllPaymentReason } from "../../services/paymentReasonService";
import { createPaymentSlip, getAllPayeeType } from "../../services/paymentSlipService";
import { PayeeType } from "../../utils/enum";
import SearchIcon from '@mui/icons-material/Search';
import { data } from "react-router-dom";
import { VND } from "../../utils/formatNumber";

const cn = classNames.bind(style)
export default function CreatePaymentSlipModal({
    show, setShow, isUpdate, setIsUpdate
}) {
    const [paymentSlip, setPaymentSlip] = useState({
        paid: '',
        paymentMethod: '',
        payeeId: null,
        paymentReasonId: '',
        payeeTypeId: "",
        note: "",
        payeeName: "",
        debt: false
    })
    const [error, setError] = useState({
        paid: '',
        paymentMethod: '',
        payeeId: '',
        payeeName: '',
        paymentReasonId: '',
        payeeTypeId: ""
    });
    const [mainError, setMainError] = useState("");
    const [showAlert, setShowAlter] = useState(false)
    const [paymentReasons, setPaymentReasons] = useState([])
    const [payeeTypes, setPayeeTypes] = useState([])
    const [paymentReasonRequest, setPaymentReasonRequest] = useState({
        name: ''
    });
    const [paymentReasonRequestError, setPaymentReasonRequestError] = useState("");
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [supplierQuery, setSupplierQuery] = useState("");
    const [supplierList, SetSupplierList] = useState([]);
    const [supplier, setSupplier] = useState();
    const [showSupplier, setShowSupplier] = useState(false);
    const [localUpdate, setLocalUpdate] = useState(false);

    useEffect(
        () => {
            var phoneNumber = "";
            var name = "";
            if (isPhoneNumber(supplierQuery)) {
                phoneNumber = supplierQuery;
            }
            else {
                name = supplierQuery;
            }
            findSupplier(name, phoneNumber).then(
                data => {
                    console.log(data)
                    SetSupplierList(data.result);
                    setShowSupplier(true)
                }
            )

        }, [supplierQuery]
    )
    useEffect(
        () => {
            getAllPaymentReason().then(
                data => {
                    console.log("payment reasons", data)
                    setPaymentReasons(data?.result)
                }
            )
        }, [localUpdate]
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
    // Supplier
    const chooseSupplier = (supplier) => {
        setSupplier(supplier);
        setSupplierQuery("");
        setError((prev) => ({
            ...prev,
            ["payeeName"]: "",
        }));
    }

    //input
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentSlip((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };
            if (!value) {
                stateObj[name] = 'Vui lòng nhập thông tin';
            }
            return stateObj;
        });
    };

    console.log(error)
    const handleClose = () => {
        setPaymentSlip({
            paid: '',
            paymentMethod: '',
            payeeId: null,
            paymentReasonId: '',
            payeeTypeId: "",
            note: "",
            payeeName: "",
            debt: false
        })
        setError({
            paid: '',
            paymentMethod: '',
            payeeId: '',
            payeeName: '',
            paymentReasonId: '',
            payeeTypeId: ""
        })
        setShow(false)
        setSupplier("")
    }

    const handleCloseReasonModal = () => {
        setShowReasonModal(false)
        setPaymentReasonRequestError("")
        setPaymentReasonRequest({ name: "" })
    }

    const handleSubmitPaymentSlip = () => {
        var fields = Object.keys(paymentSlip).filter(a => !["payeeId", "note", "debt", "payeeName"].includes(a))
        var valid = true;
        fields.forEach(
            key => {
                if (paymentSlip[key] == "") {
                    setError((prev) => ({
                        ...prev,
                        [key]: "Nhập thông tin",
                    }));
                    valid = false;
                }
            }
        )
        console.log("error", error)
        console.log(paymentSlip)
        if (error.paid !== "" || error.payeeId !== "" || error.payeeName !== "" || error.payeeTypeId != ""
            || error.paymentReasonId != "" || error.paymentMethod != "") {
            valid = false;
        }
        if (paymentSlip.payeeTypeId.substring(paymentSlip.payeeTypeId.lastIndexOf("-") + 1)
            != "SUPPLIER") {
            if (paymentSlip.payeeName == "") {
                setError((prev) => ({
                    ...prev,
                    ["payeeName"]: "Nhập thông tin",
                }));
                valid = false;
            }
        }
        else {
            if (!supplier) {
                setError((prev) => ({
                    ...prev,
                    ["payeeName"]: "Nhập thông tin",
                }));
                valid = false;
            }
        }
        if (valid) {
            if (paymentSlip.payeeTypeId.substring(paymentSlip.payeeTypeId.lastIndexOf("-") + 1)
                != "SUPPLIER") {
                paymentSlip.payeeId = null
            }
            else {
                paymentSlip.payeeId = supplier.id
                paymentSlip.payeeName = ""
            }
            paymentSlip.payeeTypeId = paymentSlip.payeeTypeId.substring(0, paymentSlip.payeeTypeId.lastIndexOf("-"))

            console.log("req ps", paymentSlip)
            createPaymentSlip(paymentSlip).then(
                data => {
                    console.log("data create ps", data)
                    if (data.code == 200) {
                        handleClose()
                        setIsUpdate(!isUpdate)
                    }
                    else {
                        setMainError("Phiếu chi không hợp lệ!")
                        setShowAlter(true)
                    }
                }
            )
        }


    }
    const handleSubmitPaymentReason = () => {
        if (paymentReasonRequest.name == "") {
            setPaymentReasonRequestError("Nhập thông tin")
        }
        else {
            setPaymentReasonRequestError("")
            createPaymentReason(paymentReasonRequest).then(
                data => {
                    console.log(data)
                    if (data.code == 200) {
                        setLocalUpdate(!localUpdate)
                        setShowReasonModal(false)
                    }
                    else {
                        setPaymentReasonRequestError("Lý do này đã tồn tại")
                    }
                }
            )
        }

    }
    return (
        <>
            <Modal
                centered
                size="lg"
                show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Tạo phiếu chi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AlertError
                        message={mainError}
                        onClose={() => setShowAlter(false)}
                        showAlert={showAlert}
                    />
                    {/* payment method */}
                    <div className="row">
                        <Form.Group className="mb-3 col-3" controlId="formGroupEmail">
                            <Form.Label>Phương thức thanh toán</Form.Label>
                            <Form.Select
                                onChange={onInputChange}
                                name="paymentMethod"
                                aria-label="Default select example">
                                <option>--Chọn--</option>
                                <option value="TRANSFER">Chuyển khoản</option>
                                <option value="CASH">Tiền mặt</option>
                            </Form.Select>
                            {error.paymentMethod && (<span className={cn("text-danger")}>{error.paymentMethod}</span>)}

                        </Form.Group>
                        <Form.Group className="mb-3 col-9" controlId="formGroupEmail">
                            <Form.Label>Lý do</Form.Label>
                            <InputGroup className=" col-6">
                                <Form.Select
                                    onChange={onInputChange}
                                    name="paymentReasonId"
                                    aria-label="Default select example">
                                    <option>--Chọn lý do--</option>
                                    {
                                        paymentReasons?.map(
                                            pr => (
                                                <option key={pr.id} value={pr.id}>{
                                                    pr.name
                                                }
                                                </option>
                                            )
                                        )
                                    }
                                </Form.Select>

                                <Button
                                    onClick={() => setShowReasonModal(true)}
                                    variant="outlined">
                                    <AddIcon />
                                </Button>
                            </InputGroup>
                            {error.paymentReasonId && (<span className={cn("text-danger")}>{error.paymentReasonId}</span>)}
                        </Form.Group>
                    </div>
                    <div className="row">
                        <Form.Group className="mb-3 col-3" controlId="formGroupEmail">
                            <Form.Label>Loại đối tượng nhận</Form.Label>
                            <Form.Select
                                name="payeeTypeId"
                                onChange={onInputChange}
                                aria-label="Default select example">
                                <option>--Chọn loại đối tượng nhận--</option>
                                {
                                    payeeTypes?.map(
                                        pt => (
                                            <option key={pt.id} value={pt.id + "-" + pt.name}>{
                                                PayeeType[pt.name]
                                            }
                                            </option>
                                        )
                                    )
                                }
                            </Form.Select>
                            {error.payeeTypeId && (<span className={cn("text-danger")}>{error.payeeTypeId}</span>)}

                        </Form.Group>
                        <Form.Group className="mb-3 col-9" controlId="formGroupEmail">
                            <Form.Label>Đối tượng nhận</Form.Label>
                            <InputGroup className="col-6">
                                {
                                    paymentSlip.payeeTypeId.substring(paymentSlip.payeeTypeId.lastIndexOf("-") + 1)
                                        != "SUPPLIER" ?
                                        <Form.Control
                                            onChange={onInputChange}
                                            name="payeeName"
                                            disabled={paymentSlip.payeeTypeId ? false : true}
                                            type="text" placeholder="Nhập đối tượng..."

                                        />
                                        :
                                        <div className={cn("input-search-product")}>
                                            <InputGroup>
                                                <Form.Control
                                                    disabled={paymentSlip.payeeTypeId ? false : true}
                                                    className={cn("input-item")}
                                                    placeholder="Tìm đối tượng ..."
                                                    value={supplier?.name}
                                                    onChange={(e) => {
                                                        setSupplier("")
                                                        setSupplierQuery(e.target.value)
                                                    }}
                                                />
                                            </InputGroup>
                                            <div
                                                className={cn("supplier-result-list")}>
                                                {
                                                    showSupplier == true && (
                                                        supplierList?.map(
                                                            (item, index) => (
                                                                <div
                                                                    key={item.id}
                                                                    onClick={() => chooseSupplier(item)}
                                                                    className={cn("product-item", "card")}>
                                                                    <div className={cn("row")}>
                                                                        <div className={cn("col")}>
                                                                            <div className={cn("content")}>
                                                                                <div className={cn("name", "title")}>
                                                                                    {item.name}
                                                                                </div>
                                                                                <div className={cn("quantity-in-stock")}>
                                                                                    <span>Số điện thoại: </span>
                                                                                    <span>{item.phoneNumber}</span>
                                                                                </div>
                                                                                <div className={cn("")}>
                                                                                    <span>Email: </span>
                                                                                    <span>{item.email}</span>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                }
                                            </div>
                                            {
                                                supplier?.debt != undefined && (
                                                    <div className={cn("text-primary", "debt")}>
                                                        Công nợ: {VND.format(supplier.debt)} đ
                                                    </div>
                                                )
                                            }
                                        </div>
                                }
                                {/* <Button onClick={() => setShowSearchModal(true)} variant="outlined">
                                    <AddIcon />
                                </Button> */}

                            </InputGroup>
                            {error.payeeName && (<span className={cn("text-danger")}>{error.payeeName}</span>)}
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3 col-6" controlId="formGroupEmail">
                        <Form.Label>Số tiền chi</Form.Label>
                        <Form.Control
                            onChange={onInputChange}
                            name="paid"
                            type="number" min={0} placeholder="Nhập tiền..." />
                        {error.paid && (<span className={cn("text-danger")}>{error.paid}</span>)}

                    </Form.Group>
                    <Form.Group className="mb-3" id="formGridCheckbox">
                        <Form.Check
                            onChange={(e) => setPaymentSlip(prev => ({
                                ...prev,
                                debt: e.target.checked
                            }))}
                            name="debt"
                            type="checkbox" label="Tính vào công nợ"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Ghi chú</Form.Label>
                        <Form.Control
                            onChange={onInputChange}
                            name="note"
                            as="textarea" rows={2} placeholder="Ghi chú..." />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="lg" variant="" onClick={() => {
                        handleClose()
                    }}>Hủy</Button>
                    <Button
                        size="lg"
                        variant="contained"
                        color="error"
                        onClick={(e) => {
                            handleSubmitPaymentSlip(e)
                        }
                        }>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* payment reason odal */}
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showReasonModal}
                className={cn("category-modal")}
            >
                <Modal.Header >
                    <Modal.Title>Tạo lý do</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Name */}
                    <div className={cn("mb-2 row")}>
                        <label for="nameCategory"
                            className={cn("col-3", "col-form-label", "input-title")}>Tên</label>
                        <div className={cn("col-9")}>
                            <input
                                type="text"
                                id="nameCategory"
                                className={cn("form-control", "input-item")}
                                name="nameCategory"
                                onChange={(e) => {
                                    setPaymentReasonRequest(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))
                                    setPaymentReasonRequestError("")
                                }
                                }
                                value={paymentReasonRequest.name}
                            />
                            {paymentReasonRequestError && (<span className={cn("text-danger")}>{paymentReasonRequestError}</span>)}

                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button size="lg" variant="" onClick={handleCloseReasonModal}>Hủy</Button>
                    <Button
                        size="lg" variant="contained"
                        color="error"
                        onClick={() => {
                            handleSubmitPaymentReason()
                        }
                        }>{
                            "Lưu"}</Button>
                </Modal.Footer>
            </Modal>
            {/* Modal search */}
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setShowSearchModal(false)}
                show={showSearchModal}
                className={cn("category-modal")}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Tìm nhà cung cấp</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className={cn("input-search-product")}>
                        <InputGroup>
                            <Form.Control
                                className={cn("input-item")}
                                placeholder="Tìm nhà cung cấp ..."
                                onChange={(e) => setSupplierQuery(e.target.value)}
                            />
                        </InputGroup>
                        <div
                            className={cn("supplier-result-list")}>
                            {
                                showSupplier == true && (
                                    supplierList?.map(
                                        (item, index) => (
                                            <div
                                                key={item.id}
                                                onClick={() => chooseSupplier(item)}
                                                className={cn("product-item", "card")}>
                                                <div className={cn("row")}>
                                                    <div className={cn("col")}>
                                                        <div className={cn("content")}>
                                                            <div className={cn("name", "title")}>
                                                                {item.name}
                                                            </div>
                                                            <div className={cn("quantity-in-stock")}>
                                                                <span>Số điện thoại: </span>
                                                                <span>{item.phoneNumber}</span>
                                                            </div>
                                                            <div className={cn("price")}>
                                                                <span>Email: </span>
                                                                <span>{item.email}</span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                )

                            }
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    )
}