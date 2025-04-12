import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert } from "@mui/material";
import { useState } from "react";
import style from "./AddressItem.module.css";
import Form from 'react-bootstrap/Form';
import CreateAddressModal from "../CreateAddressModal";


const cn = classNames.bind(style)
export default function AddressItem({ address,
    setIsSuccess,
    isSuccess,
    currentAddress, setCurrentAddress }) {
    const [showEditModal, setShowEditModal] = useState(false)
    return (
        <>
            <div key={address?.id} className={cn("address-item")}>
                {/* Content */}
                <div className={cn("content")}
                    onClick={() => setCurrentAddress(address)}
                >
                    <Form.Check
                        type="radio"
                        size={"lg"}
                        name="address"
                        checked={currentAddress.id == address.id}

                    />
                    <div className="main-content">
                        <div className={cn("name-and-phone-number")}>
                            <span className={cn("name")}>{address?.fullName}</span>
                            <span className={cn("phone-number")}>{address?.phoneNumber}</span>
                        </div>
                        <div className={cn("address-content")}>
                            <div className={cn("delivery-address", "address-content-info")}>
                                {address?.deliveryAddress}
                            </div>
                            <span className={cn("address-content-info")}>
                                {`${address?.ward}, ${address?.district}, ${address?.province}`}
                            </span>
                        </div>
                        {
                            address?.defaultChoice == true && (
                                <button className={cn("btn-default")}>Mặc định</button>
                            )
                        }
                    </div>
                </div>
                {/* Action */}
                <div className={cn("action")}>
                    <div className={cn("delete-and-edit")}>
                        <div
                            onClick={() => {
                                setShowEditModal(true)
                            }}

                            className={cn("edit-action")}>Cập nhật</div>
                    </div>
                </div>
            </div>

            <CreateAddressModal
                addressEdit={address}
                setIsSuccess={setIsSuccess}
                isCreate={false}
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                isSuccess={isSuccess}
            />
        </>
    )
}