import style from "./CreateSupplierModal.module.css"
import classNames from "classnames/bind";
import { createCalculationUnit } from "../../services/calculationUnitService";
import { use, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "@mui/material";
import { isEmail, isFullNameValid, isPhoneNumber } from "./../../utils/validate"
import { createSupplier } from "../../services/supplierService";
import AlertError from "../AlertError";
import SelectProvince from "../SelectProvince";
import SelectDistrict from "../SelectDistrict";
import SelectWard from "../SelectWard";

const cn = classNames.bind(style)
export default function CreateSupplierModal({
    show, setShow, supplier, setSupplier, isUpdate, setIsUpdate
}) {
    const [error, setError] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        contactName: '',
        address: ""
    });
    const [mainError, setMainError] = useState("");
    const [showAlert, setShowAlter] = useState(false)
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    //input
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSupplier((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
                    if (!isFullNameValid(value)) {
                        stateObj[name] = 'Vui lòng nhập tên không chứa ký tự đặc biệt';
                    }
                    break;
                case 'contactName':
                    if (!isFullNameValid(value)) {
                        stateObj[name] = 'Vui lòng nhập tên không chứa ký tự đặc biệt';
                    }
                    break;
                case 'phoneNumber':
                    if (!isPhoneNumber(value)) {
                        stateObj[name] = 'Vui lòng đúng định dạng số điện thoại.';
                    }
                    break;
                case 'email':
                    if (!isEmail(value)) {
                        stateObj[name] = 'Vui lòng nhập đúng định dạng email.';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    const handleClose = () => {
        setSupplier({
            id: null,
            name: "",
            email: "",
            phoneNumber: ""
        })
        setError({
            name: "",
            email: "",
            phoneNumber: ""
        })
        setProvince("")
        setDistrict("")
        setWard("")
        setDeliveryAddress("")
        setShow(false)
    }

    const handleSubmitSupplier = () => {
        var fields = Object.keys(supplier).filter(a => a != "outstandingDebt")
        var valid = true;
        if (deliveryAddress != "" && ward != "" && district != "" && province != "") {
            supplier.address = `${deliveryAddress}, ${ward.name}, ${district.name}, ${province.name}`;
            error.address = ""
        }
        else if (!supplier.address) {
            supplier.address = ""
        }
        else {
            error.address = ""
        }
        fields.forEach(
            key => {
                if (supplier[key] == "") {
                    setError((prev) => ({
                        ...prev,
                        [key]: "Nhập thông tin",
                    }));
                    valid = false;
                }
            }
        )
        console.log("error", error)
        console.log(supplier)
        if (error.name !== "" || error.email !== "" || error.phoneNumber !== "" || error.contactName != "" || error.address != "") {
            valid = false;
        }
        console.log("req", supplier)
        if (valid) {

            createSupplier(supplier).then(
                data => {
                    console.log(data)
                    if (data.code == 200) {
                        handleClose()
                        setIsUpdate(!isUpdate)
                    }
                    else {
                        setShowAlter(true)
                        setMainError("Số điện thoại hoăc email đã được sử dụng")
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
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhà cung cấp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AlertError
                        message={mainError}
                        onClose={() => setShowAlter(false)}
                        showAlert={showAlert}
                    />
                    {/* full name */}
                    <div className={cn("mb-5 row")}>
                        <label for="fullName-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Tên nhà cung cấp
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="fullName-input-login"
                                className={cn("form-control", "input-item")}
                                name="name"
                                onChange={onInputChange}
                                value={supplier?.name}

                            />

                            {error.name && (<span className={cn("text-danger")}>{error.name}</span>)}

                        </div>
                    </div>
                    {/* full name */}
                    <div className={cn("mb-5 row")}>
                        <label for="fullName-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Tên người liên hệ
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="text"
                                id="fullName-input-login"
                                className={cn("form-control", "input-item")}
                                name="contactName"
                                onChange={onInputChange}
                                value={supplier?.contactName}

                            />

                            {error.contactName && (<span className={cn("text-danger")}>{error.contactName}</span>)}

                        </div>
                    </div>
                    {/* email */}
                    <div className={cn("mb-5 row")}>
                        <label
                            for="email-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Email
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="email"
                                id="email-input-login"
                                className={cn("form-control", "input-item")}
                                name="email"
                                onChange={onInputChange}
                                value={supplier?.email}

                            />
                            {error.email && (<span className={cn("text-danger")}>{error.email}</span>)}

                        </div>
                    </div>
                    {/* phone number */}
                    <div className={cn("mb-5 row")}>
                        <label for="phoneNumber-input-login"
                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                            Số điện thoại
                        </label>
                        <div className={cn("col-lg-9")}>
                            <input
                                type="tel"
                                id="phoneNumber-input-login"
                                className={cn("form-control", "input-item")}
                                name="phoneNumber"
                                onChange={onInputChange}
                                value={supplier?.phoneNumber}
                            />
                            {error.phoneNumber && (<span className={cn("text-danger")}>
                                {error.phoneNumber}
                            </span>)}
                        </div>
                    </div>
                    <div className={cn("mb-4 row")}>
                        <label
                            className={cn("col-3", "col-form-label", "input-title")}>
                            Địa chỉ
                        </label>
                        <div className={cn("col-9", "d-flex", "align-items-center", "justify-content-between", "gap-1"
                        )}>
                            <SelectProvince
                                value={province}
                                setProvince={setProvince} />

                            <SelectDistrict
                                value={district}
                                provinceId={province?.id} setDistrict={setDistrict} />

                            <SelectWard
                                value={ward}
                                setWard={setWard} districtId={district?.id} />
                        </div>
                    </div>
                    <div className="col-9 offset-3">
                        {error.address && (<span className={cn("text-danger")}>{error.address}</span>)}
                    </div>
                    <div className={cn("mt-4 row")}>
                        <label for="deliveryAddress"
                            className={cn("col-3", "col-form-label", "input-title")}>Địa chỉ cụ thể</label>
                        <div className={cn("col-9")}>
                            <input
                                type="text"
                                id="deliveryAddress"
                                className={cn("form-control", "input-item")}
                                name="deliveryAddress"
                                value={deliveryAddress
                                }
                                disabled={ward ? false : true}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    {
                        supplier.id != null && supplier.address != null &&
                        <div className={cn("mb-4 row")}>
                            <label
                                className={cn("col-3", "col-form-label", "input-title")}>
                                Địa chỉ cũ
                            </label>
                            <div className={cn("col-9")}>

                                <input
                                    type="text"
                                    id="phoneNumber"
                                    disabled={true}
                                    className={cn("form-control", "input-item", "mt-2")}
                                    name="phoneNumber"
                                    value={
                                        supplier.address
                                    }
                                />

                            </div>
                        </div>
                    }

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
                            handleSubmitSupplier(e)
                        }
                        }>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}