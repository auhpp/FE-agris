import classNames from "classnames/bind";
import style from "./CreateAddressModal.module.css";
import { createAddress, getUserInfo } from "../../services/customerService";
import { isFullNameValid, isPhoneNumber } from "../../utils/validate";
import SelectProvince from "../../components/SelectProvince";
import SelectDistrict from "../../components/SelectDistrict";
import SelectWard from "../../components/SelectWard";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
const cn = classNames.bind(style);

export default function CreateAddressModal({
    showModal, setShowModal, setAddress, addressEdit, isCreate,
    setIsSuccess, isSuccess
}) {
    const [addressInput, setAddressInput] = useState({
        id: addressEdit?.id ?? null,
        fullName: addressEdit?.fullName ?? "",
        phoneNumber: addressEdit?.phoneNumber ?? "",
        deliveryAddress: addressEdit?.deliveryAddress ?? "",
        defaultChoice: addressEdit?.defaultChoice ?? false
    });

    var [addressError, setAddressError] = useState({
        fullName: "",
        phoneNumber: "",
        deliveryAddress: "",
        province: "",
        ward: "",
        district: ""
    });
    const [province, setProvince] = useState(addressEdit?.province ?? {});
    const [district, setDistrict] = useState(addressEdit?.district ?? {});
    const [ward, setWard] = useState(addressEdit?.ward ?? {});
    //input 
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setAddressInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setAddressError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'fullName':
                    if (!isFullNameValid(value)) {
                        stateObj[name] = 'Vui lòng nhập tên không chứa ký tự đặc biệt';
                    }
                    break;

                case 'phoneNumber':
                    if (!isPhoneNumber(value)) {
                        stateObj[name] = 'Vui lòng đúng định dạng số điện thoại.';
                    }
                    break;
                case 'deliveryAddress':
                    if (!(value)) {
                        stateObj[name] = 'Vui lòng nhập địa chỉ.';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    useEffect(
        () => {
            setAddressError(
                prev => ({
                    ...prev,
                    province: '',
                    ward: '',
                    district: ''
                })
            )
        }, [province, ward, district]
    )

    //Submit address
    const handleSubmitAddress = (e) => {
        var isValid = true;
        var addressRequest = { ...addressInput };
        addressRequest.province = province?.name ?? province;
        if (!addressRequest.province && !province) {
            setAddressError(
                prev => ({
                    ...prev,
                    province: "Chọn tỉnh / thành phố"
                })
            )
            isValid = false
        }
        addressRequest.ward = ward?.name ?? ward;
        if (!addressRequest.ward && !ward) {
            setAddressError(
                prev => ({
                    ...prev,
                    ward: "Chọn quận / huyện"
                })
            )
            isValid = false
        }
        addressRequest.district = district?.name ?? district;
        if (!addressRequest.district && !district) {
            setAddressError(
                prev => ({
                    ...prev,
                    district: "Chọn xã / phường"
                })
            )
            isValid = false
        }
        const field = ["fullName", "phoneNumber", "deliveryAddress"];
        field.forEach(
            (it) => {
                if (addressInput[it] == "") {
                    setAddressError(prev => ({
                        ...prev,
                        [it]: "Nhập thông tin"
                    }))
                    isValid = false
                }
                if (addressError[it].length != 0) {
                    isValid = false;
                }
            }
        )
        if (isValid
        ) {
            console.log("addrq", addressRequest)
            createAddress(addressRequest).then(
                data => {
                    setIsSuccess(true)
                }
            );

            refreshAddressInput()
            setShowModal(false)
        }

    }
    //Refresh address input
    const refreshAddressInput = () => {
        setAddressInput({
            id: null,
            fullName: "",
            phoneNumber: "",
            deliveryAddress: "",
            defaultChoice: false
        })
        setProvince("")
        setDistrict("")
        setWard("")
        setAddressError({
            fullName: "",
            phoneNumber: "",
            deliveryAddress: "",
            province: "",
            ward: "",
            district: ""
        })
    }

    return (
        <>
            <Modal
                show={showModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {/* head */}
                        <h3 className={cn("modal-title")}>Địa chỉ mới</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* content */}
                    <div class={cn("modal-body", "address-form")}>
                        {/* full name */}
                        <div className={cn("mb-4 row")}>
                            <label for="fullName"
                                className={cn("col-3", "col-form-label", "input-title")}>Tên</label>
                            <div className={cn("col-9")}>
                                <input
                                    type="text"
                                    id="fullName"
                                    className={cn("form-control", "input-item")}
                                    name="fullName"
                                    value={addressInput.fullName}
                                    onChange={onInputChange}
                                />
                                {addressError.fullName && (<span className={cn("text-danger")}>{addressError.fullName}</span>)}

                            </div>
                        </div>
                        {/* phone number */}
                        <div className={cn("mb-4 row")}>
                            <label for="phoneNumber"
                                className={cn("col-3", "col-form-label", "input-title")}>Số điện thoại</label>
                            <div className={cn("col-9")}>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    className={cn("form-control", "input-item")}
                                    name="phoneNumber"
                                    value={addressInput.phoneNumber}
                                    onChange={onInputChange}
                                />
                                {addressError.phoneNumber && (<span className={cn("text-danger")}>{addressError.phoneNumber}</span>)}

                            </div>
                        </div>
                        {/* address */}
                        <div className={cn("mb-4 row")}>
                            <label
                                className={cn("col-3", "col-form-label", "input-title")}>
                                Địa chỉ
                            </label>
                            <div className={cn("col-9")}>
                                <SelectProvince
                                    value={province}
                                    setProvince={setProvince} />
                                {addressError.province && (<span className={cn("text-danger")}>
                                    {addressError.province}</span>)}

                                <SelectDistrict
                                    value={district}
                                    provinceId={province?.id} setDistrict={setDistrict} />
                                {addressError.district && (<span className={cn("text-danger")}>
                                    {addressError.district}</span>)}

                                <SelectWard
                                    value={ward}
                                    setWard={setWard} districtId={district?.id} />
                                {addressError.ward && (<span className={cn("text-danger")}>
                                    {addressError.ward}</span>)}
                                {
                                    addressInput.id != null &&

                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        disabled={true}
                                        className={cn("form-control", "input-item", "mt-2")}
                                        name="phoneNumber"
                                        value={`${ward?.name ?? ward}, ${district?.name ?? ward}, ${province?.name ?? province}`}
                                        onChange={onInputChange}
                                    />
                                }
                            </div>

                        </div>
                        {/* phone number */}
                        <div className={cn("mb-4 row")}>
                            <label for="deliveryAddress"
                                className={cn("col-3", "col-form-label", "input-title")}>Địa chỉ cụ thể</label>
                            <div className={cn("col-9")}>
                                <input
                                    type="text"
                                    id="deliveryAddress"
                                    className={cn("form-control", "input-item")}
                                    name="deliveryAddress"
                                    value={addressInput.deliveryAddress}
                                    onChange={onInputChange}
                                />
                                {addressError.deliveryAddress && (<span className={cn("text-danger")}>
                                    {addressError.deliveryAddress}</span>)}

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class={cn("btn-8")}
                        onClick={() => {
                            isCreate && refreshAddressInput()
                            setShowModal(false)
                        }}
                    >Hủy</button>
                    <button type="button"
                        onClick={handleSubmitAddress}
                        class={cn("btn-7")}>Thêm</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}