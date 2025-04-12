import classNames from "classnames/bind";
import style from "./Order.module.css";
import PlaceIcon from '@mui/icons-material/Place';
import { getUserInfo } from "../../services/customerService";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import AddressItem from "../../components/AddressItem";
import AddIcon from '@mui/icons-material/Add';
import CreateAddressModal from "../../components/CreateAddressModal";
import { useLocation } from "react-router-dom";
import { VND } from "../../utils/formatNumber";

const cn = classNames.bind(style);

export default function Order() {
    const [customer, setCustomer] = useState();
    const [address, setAddress] = useState();
    const [addressChoice, setAddressChoice] = useState();
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)
    const location = useLocation()
    const productPurchaseList = location.state?.productPurchaseList
    const amount = productPurchaseList?.reduce(
        (acc, current) => {
            return acc + (current.quantity * current.variant.sellingPrice)
        }, 0
    )
    console.log(productPurchaseList)
    useEffect(
        () => {
            getUserInfo().then(
                data => {
                    console.log("customer", data)
                    setCustomer(data?.result)
                    var address = data?.result.addresses.find(a => a.defaultChoice == true)
                    setAddress(address)
                    setAddressChoice(address)
                    console.log("address", address)
                }
            )
        }, [isSuccess]
    )
    return (
        <>
            <form action="https://www.w3schools.com/action_page.php" method="post" className={cn("pay")} target="_blank">
                <div className={cn("container")}>
                    {/* <!-- Dia chi giao hang --> */}
                    <section className={cn("ship-address")}>
                        <h3 className={cn("title")}>
                            <PlaceIcon />
                            <span className="ms-1">
                                Địa chỉ nhận hàng
                            </span>
                        </h3>
                        <hr />
                        <div className={cn("content")}>
                            <span className={cn("name-phone-number")}>
                                {address?.fullName + " | " + address?.phoneNumber}
                            </span>
                            <span className={cn("address-content")}>
                                {`${address?.ward}, ${address?.district}, ${address?.province}`}

                            </span>
                            {
                                address?.defaultChoice &&
                                <button className={cn("btn-default")}>Mặc định</button>
                            }
                            <Button size="sm"
                                onClick={() => setShowAddressModal(true)}
                                color="success" variant="contained">
                                Thay đổi
                            </Button>
                        </div>
                    </section>
                    {/* <!-- Phuong thuc thanh toan --> */}
                    <section className={cn("pay-method")}>
                        <h3 className={cn("title")}>Phương thức thanh toán</h3>
                        <hr />
                        <div className={cn("form-check all-pay")}>
                            <input
                                defaultChecked={true}
                                className={cn("form-check-input", "input-method-pay")} type="radio" name="thanh-toan-khi-nhan-hang"
                                id="thanh-toan-khi-nhan-hang" required />
                            <label className={cn("form-check-label", "pay-method-item")} for="thanh-toan-khi-nhan-hang">
                                <i className={cn("fa-solid fa-money-bill-wave icon-pay-method")}></i>
                                <span>Thanh toán bằng tiền mặt khi nhận hàng</span>
                            </label>
                        </div>
                    </section>

                    {/* <!-- Thong tin khác --> */}
                    <section className={cn("other-info")}>
                        <h3 className={cn("title")}>Thông tin khác</h3>
                        <hr />
                        <div className={cn("row g-3 align-items-center")}>
                            <div className={cn("col-sm-4 col-lg-2")}>
                                <label for="inputNote" className={cn("col-form-label")}>Ghi chú</label>
                            </div>
                            <div className={cn("col-sm-8 col-lg-10 mt-0")}>
                                <input type="text" id="inputNote" className={cn("form-control", "input-note")}
                                    aria-describedby="" />
                            </div>
                        </div>
                    </section>
                    {/* <!-- Kiem tra lai don hang --> */}
                    <section className={cn("re-check-order")} >
                        <h3 className={cn("title")} > Kiểm tra lại đơn hàng</h3>
                        <hr />
                        <div className={cn("header", "row")}>
                            <div className="col-8 text-start">
                                Sản phẩm
                            </div>
                            <div className="col">
                                Đơn giá
                            </div>
                            <div className="col">
                                Số lượng
                            </div>
                            <div className="col">
                                Thành tiền
                            </div>
                        </div>
                        {
                            productPurchaseList.map(
                                product => (
                                    <div className={cn("product", "row", "info-product")} >
                                        <div className={cn("col-2")} >
                                            <img src={product.variant.thumbnail} alt="" className={cn("img-product")} />
                                        </div>
                                        <div className={cn("col-xl-6 col-12")} >
                                            <p className={cn("name-product")} >
                                                {product.variant.name}
                                            </p >
                                        </div >
                                        <div className={cn("col")} >
                                            <div className={cn("current-price", "d-inline-block", "d-xl-block",
                                                "text-center"
                                            )} >
                                                <span>{VND.format(product.variant.sellingPrice)}</span>
                                                <sup>đ</sup>
                                            </div >
                                            {/* <div className={cn("original-price", "d-inline-block", "d-xl-block",


                                        )} >
                                            40.000
                                            < sup > đ</ sup>
                                        </div > */}
                                        </div >
                                        <div className={cn("col text-xl-center", "mt-2", "mt-xl-0"
                                        )} >
                                            <div className={cn("quantity", "text-center")}>{
                                                product.quantity}</div>
                                        </div >
                                        <div className={cn("col mt-2 mt-xl-0", "text-center")} >
                                            <span className={cn("price")} >{
                                                VND.format(
                                                    product.quantity * product.variant.sellingPrice
                                                )
                                            }</span >
                                            <sup className={cn("price")}>đ</sup>
                                        </div >
                                    </div >
                                )
                            )
                        }
                    </section >

                    {/* <!-- Tong tien --> */}
                    < section className={cn("info-pay")} >
                        <h3 className={cn("title")} > Đơn hàng</h3 >
                        <hr />
                        <div className={cn("content")}>
                            <div className={cn("price", "row")}>
                                <span className={cn("col-6 text-end")}>Thành tiền: </span>
                                <span className={cn("col-6")}>
                                    {VND.format(amount)}đ
                                </span>
                            </div>
                            {/* <div className={cn("ship-fee", "row")}>
                                <span className={cn("col-6", "text-end")}>Phí vận chuyển: </span>
                                <span className={cn("col-6")}>
                                    100.000 đ
                                </span>
                            </div> */}
                            <div className={cn("sum-price", "row")}>
                                <span className={cn("col-6", "text-end")}>Tổng Số Tiền: </span>
                                <span className={cn("col-6", "all-price")}>
                                    {VND.format(amount)} đ
                                </span>
                            </div>
                            <div className={cn("text-center")}>
                                <button type="submit" id="" className={cn("btn-3", "pay-btn")}>
                                    Xác nhận thanh toán
                                </button>
                            </div>
                        </div>
                    </section >
                </div >

            </form >
            <Modal
                show={showAddressModal}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Địa Chỉ Của Tôi
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        customer?.addresses.map(
                            it => (
                                <AddressItem
                                    address={it}
                                    currentAddress={addressChoice}
                                    setCurrentAddress={setAddressChoice}
                                    setIsSuccess={setIsSuccess}
                                />
                            )
                        )
                    }
                    <button className={cn("btn-3")}
                        onClick={() => setShowCreateAddressModal(true)}
                    >
                        <AddIcon />
                        <span>Thêm địa chỉ mới</span>
                    </button>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="text"
                        color="inherit"
                        className="me-2"
                        style={{ "fontSize": "13px" }}
                        onClick={() => setShowAddressModal(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            setShowAddressModal(false)
                            setAddress(addressChoice)
                        }

                        }>Xác nhận</Button>

                </Modal.Footer>
            </Modal>

            <CreateAddressModal
                showModal={showCreateAddressModal}
                setShowModal={setShowCreateAddressModal}
                setAddress={setAddress}
                isCreate={true}
                setIsSuccess={setIsSuccess}
                isSuccess={isSuccess}
            />
        </>
    );
}