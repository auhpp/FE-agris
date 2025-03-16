import style from "./Address.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { createAddress, deleteAddress, getUserInfo } from "../../services/userService";
import { Checkbox, FormControlLabel } from "@mui/material";
const cn = classNames.bind(style);

const isPhoneNumber = (phoneNumber) =>
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phoneNumber);

const isFullNameValid = (fullName) =>
    /^[a-zA-Z0-9À-ỹ ]+$/.test(fullName)

export default function Address() {
    const [addresses, setAddresses] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    useEffect(
        () => {
            getUserInfo().then(
                data => {
                    setAddresses(data.result.addresses ?? [])
                }
            )
        }, [isSuccess]
    )
    console.log(addresses)

    const [addressInput, setAddressInput] = useState({
        id: null,
        fullName: "",
        phoneNumber: "",
        addressName: "",
        defaultChoice: false
    });

    var [addressError, setAddressError] = useState({
        fullName: "",
        phoneNumber: "",
        addressName: ""
    });


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
                case 'addressName':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập địa chỉ.';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    const handleSubmitAddress = (e) => {
        const field = ["fullName", "phoneNumber", "addressName"];
        var isValid = true;
        field.forEach(
            (it) => {
                if (addressError[it].length != 0) {
                    isValid = false;
                }
            }
        )
        console.log("submit", addressInput)
        if (isValid
        ) {
            var addressRequest = { ...addressInput };
            createAddress(addressRequest).then(
                data => {
                    console.log(data)
                    setIsSuccess(!isSuccess)
                }
            );

        }
        refreshAddressInput()
    }
    const refreshAddressInput = () => {
        setAddressInput({
            id: null,
            fullName: "",
            phoneNumber: "",
            addressName: "",
            defaultChoice: false
        })
    }

    const handleEditAddress = (address) => {
        setAddressInput({
            id: address.id,
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
            addressName: address.addressName,
            defaultChoice: address.defaultChoice
        })
    }

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

    const handleDeleteAddress = (item) => {
        deleteAddress(item.id).then(
            setAddresses(addresses.filter(a => a.id != item.id))
        )
    }
    return (
        <>
            <div className={cn("address")}>
                <div className={cn("head")}>
                    <h2>Địa chỉ của tôi</h2>
                    <button className={cn("btn-3", "btn-add-address")}
                        data-bs-toggle="modal" data-bs-target="#address-modal"

                    >
                        <AddIcon />
                        <span>Thêm địa chỉ mới</span>
                    </button>
                </div>
                <div className={cn("main-content")}>
                    <h3 className={cn("title")}>Địa chỉ</h3>
                    {/* List address */}
                    <div className={cn("address-list")}>
                        {
                            addresses?.map(
                                (item, index) => (
                                    <div key={item.id} className={cn("address-item")}>
                                        <div className={cn("content")}>
                                            <div className={cn("name-and-phone-number")}>
                                                <span className={cn("name")}>{item.fullName}</span>
                                                <span className={cn("phone-number")}>{item.phoneNumber}</span>
                                            </div>
                                            <div className={cn("address-content")}>{item.addressName}</div>
                                            {
                                                item.defaultChoice == true && (
                                                    <button className={cn("btn-default")}>Mặc định</button>
                                                )
                                            }
                                        </div>
                                        <div className={cn("action")}>
                                            <div className={cn("delete-and-edit")}>
                                                <div
                                                    onClick={() => handleEditAddress(item)}
                                                    data-bs-toggle="modal" data-bs-target="#address-modal"

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
                <div class="modal fade " tabindex="-1" id="address-modal" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class={cn("modal-content", "modal-inner-content")}>
                            <div class="modal-header">
                                <h3 className={cn("modal-title")}>Địa chỉ mới</h3>
                                <button type="button" class="btn-close"
                                    onClick={() => refreshAddressInput()}
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class={cn("modal-body", "address-form")}>
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
                                <div className={cn("mb-4 row")}>
                                    <label for="addressName"
                                        className={cn("col-3", "col-form-label", "input-title")}>Địa chỉ</label>
                                    <div className={cn("col-9")}>
                                        <textarea
                                            className={cn("form-control", "input-item")}
                                            id="addressName"
                                            name="addressName"
                                            rows="3"
                                            value={addressInput.addressName}
                                            onChange={onInputChange}
                                        ></textarea>
                                        {addressError.addressName && (<span className={cn("text-danger")}>{addressError.addressName}</span>)}

                                    </div>
                                </div>
                                {/* <div className={cn("mb-4 row")}>
                                    <label
                                        className={cn("col-3", "col-form-label", "input-title")}></label>
                                    <div className={cn("col-9")}>
                                        <div className="form-check">
                                            <input
                                                onChange={onInputChange}
                                                name="defaultChoice"
                                                className="form-check-input"
                                                type="checkbox"
                                                value={true}
                                                id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Đặt làm mặc định
                                            </label>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class={cn("btn-8")}
                                    onClick={() => refreshAddressInput()}
                                    data-bs-dismiss="modal">Hủy</button>
                                <button type="button"
                                    onClick={handleSubmitAddress}
                                    data-bs-dismiss="modal"
                                    class={cn("btn-7")}>Thêm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}