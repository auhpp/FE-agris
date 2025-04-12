import style from "./Address.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { createAddress, deleteAddress, getUserInfo } from "../../services/customerService";
import { isFullNameValid, isPhoneNumber } from "../../utils/validate";
import SelectProvince from "../../components/SelectProvince";
import SelectDistrict from "../../components/SelectDistrict";
import SelectWard from "../../components/SelectWard";
import Modal from 'react-bootstrap/Modal';

const cn = classNames.bind(style);

export default function Address() {
    const [addresses, setAddresses] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [addressInput, setAddressInput] = useState({
        id: null,
        fullName: "",
        phoneNumber: "",
        deliveryAddress: "",
        defaultChoice: false
    });

    var [addressError, setAddressError] = useState({
        fullName: "",
        phoneNumber: "",
        deliveryAddress: "",
        province: "",
        ward: "",
        district: ""
    });
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [showModal, setShowModal] = useState(false)

    //Get user and set addresses
    useEffect(
        () => {
            getUserInfo().then(
                data => {
                    setAddresses(data.result.addresses ?? [])
                }
            )
        }, [isSuccess]
    )

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
                    console.log(data)
                    setIsSuccess(!isSuccess)
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

    // Edit address
    const handleEditAddress = (address) => {
        setAddressInput({
            id: address.id,
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            deliveryAddress: address.deliveryAddress,
            defaultChoice: address.defaultChoice
        })
        setProvince(address.province)
        setWard(address.ward)
        setDistrict(address.district)
    }

    //Set default choice
    const handleDefaultChoice = (item) => {
        item.defaultChoice = true;
        createAddress(item).then(
            data => {
                if (data.code == 200) {
                    setIsSuccess(!isSuccess)
                }
            }
        )
    }

    //Delete an address
    const handleDeleteAddress = (item) => {
        deleteAddress(item.id).then(
            setAddresses(addresses.filter(a => a.id != item.id))
        )
    }
    console.log("address", province, district, ward)
    return (
        <>
            <div className={cn("address")}>
                {/* Head */}
                <div className={cn("head")}>
                    <h4>Địa chỉ của tôi</h4>
                    <button className={cn("btn-3", "btn-add-address")}
                        onClick={() => setShowModal(true)}
                    >
                        <AddIcon />
                        <span>Thêm địa chỉ mới</span>
                    </button>
                </div>
                {/* end head */}
                <div className={cn("main-content")}>
                    <h4 className={cn("title")}>Địa chỉ</h4>
                    {/* List address */}
                    <div className={cn("address-list")}>
                        {
                            addresses?.map(
                                (item, index) => (
                                    <div key={item.id} className={cn("address-item")}>
                                        {/* Content */}
                                        <div className={cn("content")}>
                                            <div className={cn("name-and-phone-number")}>
                                                <span className={cn("name")}>{item.fullName}</span>
                                                <span className={cn("phone-number")}>{item.phoneNumber}</span>
                                            </div>
                                            <div className={cn("address-content")}>
                                                <div className={cn("delivery-address", "address-content-info")}>
                                                    {item?.deliveryAddress}
                                                </div>
                                                <span className={cn("address-content-info")}>
                                                    {`${item.ward}, ${item.district}, ${item.province}`}
                                                </span>
                                            </div>
                                            {
                                                item.defaultChoice == true && (
                                                    <button className={cn("btn-default")}>Mặc định</button>
                                                )
                                            }
                                        </div>
                                        {/* Action */}
                                        <div className={cn("action")}>
                                            <div className={cn("delete-and-edit")}>
                                                <div
                                                    onClick={() => {
                                                        handleEditAddress(item)
                                                        setShowModal(true)
                                                    }}

                                                    className={cn("edit-action")}>Cập nhật</div>
                                                <div className={cn("delete-action")}
                                                    onClick={() =>
                                                        handleDeleteAddress(item)
                                                    }
                                                >Xóa</div>
                                            </div>
                                            <button
                                                onClick={() => handleDefaultChoice(item)}
                                                disabled={item.defaultChoice == true && true}
                                                className={cn("btn-set-default-address")}>Thiết lập mặc định</button>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                    {/* List address */}
                </div>

                {/* modal add address */}
                <Modal
                    show={showModal}
                    onHide={() => {
                        setShowModal(false)
                        refreshAddressInput()
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
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
                                refreshAddressInput()
                                setShowModal(false)
                            }}
                        >Hủy</button>
                        <button type="button"
                            onClick={handleSubmitAddress}
                            class={cn("btn-7")}>Thêm</button>
                    </Modal.Footer>
                </Modal>
            </div >
        </>
    );
}