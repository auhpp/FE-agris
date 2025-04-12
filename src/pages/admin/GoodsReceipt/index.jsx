import { useNavigate } from "react-router-dom";
import style from "./GoodsReceipt.module.css";
import classNames from "classnames/bind";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import productImg from "./../../../assets/images/product-test.png";
import { use, useEffect, useState } from "react";
import { searchProductVariant } from "../../../services/productVariantService";
import { VND } from "../../../utils/formatNumber";
import Modal from 'react-bootstrap/Modal';
import { createSupplier, searchSupplier } from "../../../services/supplierService";
import { routes } from "../../../config/routes";
import { createWarehouseReceipt, getAllWarehouse } from "../../../services/warehouseService";
import Dropdown from 'react-bootstrap/Dropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getAllShipment } from "../../../services/shipment";
import CloseIcon from '@mui/icons-material/Close';
import { formatDate } from "../../../utils/formatDate";
import { searchStaff } from "../../../services/staffService";
const cn = classNames.bind(style);


function sum(arr) {
    var amount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].shipment)
            amount += (arr[i].capitalPrice * arr[i].shipment?.reduce(
                (total, current) => {
                    return total + Number(current.quantity)
                }, 0
            ));
        else amount = 0
    }
    return amount;
}

function dept(goodsAmount, moneyForSupplier) {
    return goodsAmount - moneyForSupplier;
}

//validate email
const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// Validate phone number
const isPhoneNumber = (phoneNumber) =>
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phoneNumber);

// Validate name
const isFullNameValid = (fullName) =>
    /^[a-zA-Z0-9À-ỹ ]+$/.test(fullName)

export default function GoodsReceipt() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [productImportList, setProductImportList] = useState([]);
    const [update, setUpdate] = useState(false);
    const [goodsAmount, setGoodsAmount] = useState(0);
    const [moneyForSupplier, setMoneyForSupplier] = useState(0);
    const [moneyDept, setMoneyDept] = useState(goodsAmount);
    const [show, setShow] = useState(false);
    const [supplierQuery, setSupplierQuery] = useState("");
    const [supplierList, SetSupplierList] = useState([]);
    const [supplier, setSupplier] = useState();
    const [showSupplier, setShowSupplier] = useState(false);
    const [showProductList, setShowProductList] = useState(false);
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [warehouse, setWarehouse] = useState({});
    const [showShipment, setShowShipment] = useState(false);
    const [shipments, setShipments] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(
        () => {
            searchProductVariant(query).then(
                data => {
                    console.log(data)
                    setSearchResult(data?.result)
                }
            )
            setShowProductList(true)
        }, [query]
    )

    useEffect(
        () => {
            getAllWarehouse().then(
                data => {
                    setWarehouses(data.result)
                }
            )
        }, []
    )

    const addToProductImportList = (product) => {
        var check = true;
        productImportList.forEach(
            it => {
                if (it.id == product.id) {
                    check = false;
                    return;
                }
            }
        )
        if (check) {
            product.quantity = 1;
            setProductImportList(prevList => {
                const newList = [...prevList, product];
                setGoodsAmount(sum(newList));
                setMoneyDept(goodsAmount, moneyForSupplier)
                return newList;
            })
        }
        else {
            alert("Đã thêm sản phẩm này")
        }
    }
    useEffect(
        () => {
            setGoodsAmount(sum(productImportList));
        }, [productImportList]
    )
    useEffect(
        () => {
            setMoneyDept(dept(goodsAmount, moneyForSupplier))
        }, [goodsAmount, moneyForSupplier]
    )

    const [supplierInput, setSupplierInput] = useState({
        id: null,
        name: "",
        phoneNumber: "",
        email: ""
    });
    var [supplierError, setSupplierError] = useState({
        name: "",
        phoneNumber: "",
        email: ""
    });

    //input
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSupplierInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setSupplierError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
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

    // Handle 
    const handleSubmitSupplier = () => {
        createSupplier(supplierInput).then(
            data => console.log(data)
        )
    }

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
            searchSupplier(name, phoneNumber).then(
                data => {
                    console.log(data)
                    SetSupplierList(data.result);
                    setShowSupplier(true)
                }
            )

        }, [supplierQuery]
    )

    // Supplier
    const chooseSupplier = (supplier) => {
        setSupplier(supplier);
        setSupplierQuery("");
    }

    // Handle submit warehouse receipt 
    var [supplierError, setSupplierError] = useState("");
    var [productError, setProductError] = useState("");
    var [warehouseError, setWarehouseError] = useState("");

    const handleSubmitWarehouseReceipt = () => {
        var ok = true;
        if (!supplier) {
            setSupplierError("Phải chọn nhà cung cấp")
            ok = false;
        }
        if (!staff) {
            setStaffError("Phải chọn nhân viên")
            ok = false;
        }
        if (productImportList.length == 0) {
            setProductError("Phải chọn sản phẩm")
            ok = false;
        }
        if (!warehouse) {
            setWarehouseError("Phải chọn kho")
            ok = false
        }
        if (ok) {
            var request = {};
            request.warehouseId = warehouse;
            request.supplierId = supplier?.id;
            request.amount = goodsAmount;
            request.note = note;
            request.moneyForSupplier = moneyForSupplier;
            request.paymentMethod = paymentMethod;
            request.staffId = staff.id;
            request.receiptDetails = productImportList.map(
                it => {
                    return {
                        productVariantId: it.id,
                        unitPrice: it.capitalPrice,
                        shipments: it.shipment.map(
                            sm =>
                                sm?.existed == true ?
                                    {
                                        id: sm.id,
                                        name: sm.name,
                                        expiry: sm.expiry,
                                        quantity: sm.quantity,
                                    } :
                                    {
                                        id: null,
                                        name: sm.name,
                                        expiry: sm.expiry,
                                        quantity: sm.quantity,
                                        productVariantId: it.id
                                    }
                        )
                    }
                }
            )
            console.log("request", request)
            createWarehouseReceipt(request).then(
                data => {
                    console.log("data receipt", data)
                    if (data.code == 200) {
                        window.location.reload();
                    }
                }
            )
        }
    }

    //shipment
    const handleAddShipment = (product, shipment) => {
        if (!product.shipment) product.shipment = [];
        if (!shipment) {
            product.shipment.push({ id: window.crypto.randomUUID(), name: "", expiry: "", quantity: "" })
        }
        else {
            product.shipment.push({ ...shipment, quantity: "", existed: true })
        }
    }

    useEffect(
        () => {
            console.log("shipment", productImportList)

        }, [productImportList]
    )
    const handleGetAllShipment = (productVariantId) => {
        console.log(productVariantId)
        getAllShipment(productVariantId).then(
            data => {
                console.log("data shipment", data)
                setShipments(data.result)

            }
        )
    }

    //Staff
    const [staffQuery, setStaffQuery] = useState();
    const [showStaff, setShowStaff] = useState(true)
    const [staffList, setStaffList] = useState([])
    const [staff, setStaff] = useState();
    const [staffError, setStaffError] = useState();

    useEffect(
        () => {
            var request = {
                fullName: "",
                phoneNumber: "",
                email: ""
            };
            if (isEmail(staffQuery)) {
                request.email = staffQuery;
            }
            else if (isPhoneNumber(staffQuery)) {
                request.phoneNumber = staffQuery;
            }
            else {
                request.fullName = staffQuery;
            }
            searchStaff(request, 1, 1000).then(
                data => {
                    console.log(data)
                    if (data.result?.data) {
                        setStaffList(data.result.data)
                        setShowStaff(true)
                    }
                }
            );
        },
        [staffQuery]
    )
    return (
        <>
            <div className={cn("container", "mt-5")}>
                <div className={cn("main-content", "row")}>
                    <div className={cn("content-left", "col-8")}>
                        <div className={cn("input-search-product", "row")}>
                            <div onClick={() => navigate(-1)} className={cn("back-previous-page", "col-2")}>
                                <ArrowBackIosIcon />
                                <span>Nhập hàng</span>
                            </div>
                            <div className={cn("input-search", "col-6")}>
                                <InputGroup>
                                    <Form.Control
                                        className={cn("input-item")}
                                        placeholder="Nhập tên sản phẩm ..."
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    {/* <Button variant="outline-secondary">
                                    <SearchIcon />
                                </Button> */}
                                    <Button
                                        onClick={() => navigate(routes.createProduct)}
                                        variant="outline-secondary">
                                        <AddIcon />
                                    </Button>
                                </InputGroup>
                                <div
                                    onMouseLeave={() => setShowProductList(false)}
                                    className={cn("result-list")}>
                                    {
                                        showProductList == true && (
                                            searchResult?.map(
                                                (item, index) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => addToProductImportList(item)}
                                                        className={cn("product-item", "card")}>
                                                        <div className={cn("row")}>
                                                            <div className={cn("col-2")}>
                                                                <img className={cn("product-img")} src={item.thumbnail} alt="" />
                                                            </div>
                                                            <div className={cn("col")}>
                                                                <div className={cn("content")}>
                                                                    <div className={cn("name", "title")}>
                                                                        {item.name}
                                                                    </div>
                                                                    <div className={cn("row")}>
                                                                        <div className={cn("quantity-in-stock", "col")}>
                                                                            <span>Tồn kho: </span>
                                                                            <span>{item.stock}</span>
                                                                        </div>
                                                                        <div className={cn("price", "col")}>
                                                                            <span>Giá: </span>
                                                                            <span className="ms-1"> {item.capitalPrice} </span>
                                                                        </div>
                                                                        <div className={cn("variant-type", "col")}>
                                                                            {
                                                                                item.variantValues[0].name != "DEFAULT"
                                                                                && item.variantValues.length > 1
                                                                                && (
                                                                                    <>
                                                                                        <span>
                                                                                            Phân loại hàng:
                                                                                        </span>
                                                                                        {
                                                                                            <span>
                                                                                                {item.variantValues.map(
                                                                                                    a => a.value
                                                                                                ).join(" - ")
                                                                                                }
                                                                                            </span>
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </div>
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
                        </div>
                        <div className={cn("product-list", "mt-4")}>
                            {/* header */}
                            <div className={cn("header")}>
                                <div className={cn("row")}>
                                    <div className={cn("form-check", "col-5")}>
                                        <label className={cn("form-check-label")} for="flexCheckDefault">
                                        </label>
                                    </div>
                                    <div className={cn("product-type", "col-2")}>
                                        <span>Số lượng</span>
                                    </div>
                                    <div className={cn("product-type", "col-2")}>
                                        <span>Đơn giá</span>
                                    </div>
                                    <div className={cn("product-type", "col-2")}>
                                        <span>Thành tiền</span>
                                    </div>
                                    <div className={cn("product-type", "col-1")}>
                                    </div>
                                </div>
                            </div>
                            {/* Cart list */}
                            <div
                                className={cn("cart-list", "row")}>
                                {

                                    productImportList?.map(
                                        (item, index) => (
                                            <>
                                                <div
                                                    className={cn("cart-item", "row")}>
                                                    <div className={cn("form-check", "col-3")}>
                                                        {/* card */}
                                                        <div className={cn("card", "mb-3")}>
                                                            <div className={cn("card-body")}>
                                                                {/* name */}
                                                                <h5
                                                                    // onClick={() => handleNavigateToProduct(item.product?.id)}
                                                                    className={cn("card-title", 'title', "product-title")}>
                                                                    {item.name}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        {/* end card */}
                                                    </div>
                                                    {/* variant */}
                                                    <div className={cn("product-type", "col-2")}>
                                                        <div
                                                            className={cn("btn-product-type")}
                                                        >
                                                            {
                                                                item.variantValues[0].name != "DEFAULT" &&
                                                                item.variantValues.length > 1 && (
                                                                    <>
                                                                        <span>
                                                                            Phân loại hàng:
                                                                        </span>
                                                                        {
                                                                            <span>
                                                                                {item.variantValues.map(
                                                                                    a => a.value
                                                                                ).join(" - ")
                                                                                }
                                                                            </span>
                                                                        }
                                                                    </>
                                                                )
                                                            }
                                                        </div>

                                                    </div>
                                                    {/* end variant */}
                                                    {/* quantity */}
                                                    <div className={cn("col-2")}>
                                                        <Form.Control
                                                            disabled
                                                            readOnly
                                                            className={cn("quantity")}
                                                            value={
                                                                item.shipment?.reduce(
                                                                    (total, current) => {
                                                                        return total + Number(current.quantity)
                                                                    }, 0
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {/* price */}
                                                    <div className={cn("unit-price", "col-2")}>
                                                        <Form.Control
                                                            className={cn("quantity")}
                                                            onChange={(e) => {
                                                                item.capitalPrice = e.target.value
                                                                setProductImportList(
                                                                    [
                                                                        ...productImportList
                                                                    ], item
                                                                )
                                                                setGoodsAmount(sum(productImportList))
                                                            }}
                                                            value={item.capitalPrice}
                                                            type="number" />
                                                    </div>
                                                    {/* complete price*/}
                                                    <div className={cn("unit-price", "col-2")}>
                                                        {item.shipment ? VND.format(item.capitalPrice * item.shipment?.reduce(
                                                            (total, current) => {
                                                                return total + Number(current.quantity)
                                                            }, 0
                                                        )) : 0} đ
                                                    </div>
                                                    <div className={cn("col-1")}>
                                                        <DeleteIcon fontSize="large"
                                                            onClick={
                                                                () => {
                                                                    setProductImportList(
                                                                        prevList => {
                                                                            const newList = prevList.filter(a => a.id != item.id);
                                                                            setGoodsAmount(sum(newList));
                                                                            return newList;
                                                                        }
                                                                    )
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mb-1">
                                                    {
                                                        item.shipment?.map(
                                                            shipmentItem => (
                                                                <div className={cn("group-input-shipment", "col-5",
                                                                    "mb-1"
                                                                )}>
                                                                    <Form.Control
                                                                        className={cn("input-item")}
                                                                        placeholder="Tên lô ..."
                                                                        disabled={
                                                                            shipmentItem?.existed == true ? true : false
                                                                        }
                                                                        onChange={(e) => {
                                                                            setProductImportList(prev =>
                                                                                prev.map(
                                                                                    product =>
                                                                                        product.id == item.id
                                                                                            ? {
                                                                                                ...product,
                                                                                                shipment: product.shipment.map(
                                                                                                    a => a.id == shipmentItem.id ?
                                                                                                        {
                                                                                                            ...a,
                                                                                                            name: e.target.value
                                                                                                        } : a
                                                                                                )
                                                                                            } : product
                                                                                )

                                                                            )

                                                                        }}
                                                                        value={shipmentItem.name}
                                                                    />
                                                                    <Form.Control
                                                                        className={cn("input-item")}
                                                                        placeholder="Hạn sử dụng"
                                                                        type="date"
                                                                        disabled={
                                                                            shipmentItem?.existed == true ? true : false
                                                                        }
                                                                        onChange={(e) => {
                                                                            setProductImportList(prev =>
                                                                                prev.map(
                                                                                    product =>
                                                                                        product.id == item.id
                                                                                            ? {
                                                                                                ...product,
                                                                                                shipment: product.shipment.map(
                                                                                                    a => a.id == shipmentItem.id ?
                                                                                                        {
                                                                                                            ...a,
                                                                                                            expiry: e.target.value
                                                                                                        } : a
                                                                                                )
                                                                                            } : product
                                                                                )

                                                                            )

                                                                        }}
                                                                        value={shipmentItem.expiry}
                                                                    />
                                                                    <Form.Control
                                                                        className={cn("input-item")}
                                                                        placeholder="Số lượng"
                                                                        type="number"
                                                                        min={0}
                                                                        onChange={(e) => {
                                                                            setProductImportList(prev =>
                                                                                prev.map(
                                                                                    product =>
                                                                                        product.id == item.id
                                                                                            ? {
                                                                                                ...product,
                                                                                                shipment: product.shipment.map(
                                                                                                    a => a.id == shipmentItem.id ?
                                                                                                        {
                                                                                                            ...a,
                                                                                                            quantity: e.target.value
                                                                                                        } : a
                                                                                                )
                                                                                            } : product
                                                                                )

                                                                            )

                                                                        }}
                                                                    />
                                                                    <CloseIcon
                                                                        className={cn("close-icon")}
                                                                        onClick={() =>
                                                                            setProductImportList(prev =>
                                                                                prev.map(
                                                                                    product =>
                                                                                        product.id == item.id
                                                                                            ? {
                                                                                                ...product,
                                                                                                shipment: product.shipment.filter(
                                                                                                    a => a.id != shipmentItem.id
                                                                                                )
                                                                                            } : product
                                                                                )

                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                </div>
                                                <div>
                                                    <Dropdown onClick={() => handleGetAllShipment(item.id)}>
                                                        <Dropdown.Toggle
                                                            className="mb-2"
                                                            variant="success" id="dropdown-basic">
                                                            <AddIcon />
                                                            <span>Nhập lô</span>
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    handleAddShipment(item)
                                                                }}
                                                                className={cn("input-new-shipment")}>
                                                                <AddCircleOutlineIcon />
                                                                <span>Nhập lô mới</span>
                                                            </Dropdown.Item>
                                                            {
                                                                shipments.map(
                                                                    a => (
                                                                        <Dropdown.Item
                                                                            onClick={() => handleAddShipment(item, a)}
                                                                            className={cn("shipment")}>
                                                                            <span>{a.name}</span>
                                                                            <span>{formatDate(a.expiry)}</span>
                                                                        </Dropdown.Item>
                                                                    )
                                                                )
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </>
                                        )
                                    )

                                }
                                {
                                    productError && (<span className={cn("text-danger")}>
                                        {productError}</span>)

                                }


                            </div>
                            {/* end content left */}
                        </div>
                    </div>
                    <div className={cn("content-right", "col-4")}>
                        <div className={cn("staff")}>
                            <div className={cn("input-search-product")}>
                                <InputGroup>
                                    <Form.Control
                                        className={cn("input-item")}
                                        placeholder="Tìm nhân viên ..."
                                        onChange={(e) => setStaffQuery(e.target.value)}
                                    />
                                </InputGroup>
                                <div
                                    onMouseLeave={() => setShowStaff(false)}
                                    className={cn("supplier-result-list")}>
                                    {
                                        showStaff == true && (
                                            staffList?.map(
                                                (item, index) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            setStaff(item)
                                                            setShowStaff(false)

                                                            setStaffQuery("")
                                                        }}
                                                        className={cn("product-item", "card")}>
                                                        <div className={cn("row")}>
                                                            <div className={cn("col")}>
                                                                <div className={cn("content")}>
                                                                    <div className={cn("name", "title")}>
                                                                        {item.fullName}
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
                            <div className={cn("row", "content-item")}>
                                <div className={cn("col-5", "")}>
                                    <label htmlFor="">
                                        Nhân viên
                                    </label>
                                </div>
                                <div className={cn("col")}>
                                    {staff?.fullName}
                                    <div>
                                        {staff?.phoneNumber}
                                    </div>
                                    {
                                        staffError && (<span className={cn("text-danger")}>
                                            {staffError}</span>)

                                    }
                                </div>
                            </div>
                        </div>
                        <div className={cn("supplier")}>
                            <div className={cn("input-supplier")}>
                                <div className={cn("input-search-product")}>
                                    <InputGroup>
                                        <Form.Control
                                            className={cn("input-item")}
                                            placeholder="Tìm nhà cung cấp ..."
                                            onChange={(e) => setSupplierQuery(e.target.value)}
                                        />
                                        {/* <Button variant="outline-secondary">
                                            <SearchIcon />
                                        </Button> */}
                                        <Button onClick={handleShow} variant="outline-secondary">
                                            <AddIcon />
                                        </Button>
                                    </InputGroup>
                                    <div
                                        onMouseLeave={() => setShowSupplier(false)}
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
                                <div className={cn("content")}>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5", "")}>
                                            <label htmlFor="">
                                                Nhà cung cấp
                                            </label>
                                        </div>
                                        <div className={cn("col")}>
                                            {supplier?.name}
                                            <div>
                                                {supplier?.phoneNumber}
                                            </div>
                                            {
                                                supplierError && (<span className={cn("text-danger")}>
                                                    {supplierError}</span>)

                                            }
                                        </div>
                                    </div>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5", "")}>
                                            <label htmlFor="">
                                                Kho
                                            </label>
                                        </div>
                                        <div className={cn("col", "current-price")}>
                                            <Form.Select
                                                onChange={(e) => setWarehouse(e.target.value)}
                                            >
                                                <option>--Chọn kho--</option>
                                                {
                                                    warehouses.map(
                                                        it => (
                                                            <option value={it.id}>
                                                                {it.name}
                                                            </option>
                                                        )
                                                    )
                                                }
                                            </Form.Select>
                                            {
                                                warehouseError && (<span className={cn("text-danger")}>
                                                    {warehouseError}</span>)

                                            }
                                        </div>
                                    </div>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5", "")}>
                                            <label htmlFor="">
                                                Tổng tiền hàng
                                            </label>
                                        </div>
                                        <div className={cn("col", "current-price")}>
                                            {VND.format(goodsAmount)}
                                        </div>
                                    </div>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5")}>
                                            <label htmlFor="">
                                                Phương thức thanh toán
                                            </label>
                                        </div>
                                        <div className={cn("col")}>
                                            <Form.Select
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                style={{ fontSize: 14 }}
                                                name="paymentMethod">
                                                <option>--Chọn--</option>
                                                <option value="CASH">Tiền mặt</option>
                                                <option value="TRANSFER">Chuyển khoản</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5")}>
                                            <label htmlFor="">
                                                Tiền trả nhà cung cấp
                                            </label>
                                        </div>
                                        <div className={cn("col")}>
                                            <Form.Control type="number"
                                                value={moneyForSupplier}
                                                className={cn("input-item")}
                                                defaultValue={0}
                                                onChange={(e) =>
                                                    setMoneyForSupplier(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("row", "content-item")}>
                                        <div className={cn("col-5")}>
                                            <label htmlFor="">
                                                Tính vào công nợ
                                            </label>
                                        </div>
                                        <div className={cn("col", "current-price")}>
                                            {
                                                moneyDept != 0 && (
                                                    "-"
                                                )
                                            }
                                            {VND.format(moneyDept)}
                                        </div>
                                    </div>
                                    <div className={cn("content-item")}>
                                        <textarea name="" id=""
                                            className={cn("w-100", "p-2")}
                                            placeholder="Ghi chú"
                                            onChange={(e) => setNote(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <button className={cn("btn-3", "btn-payment")}
                                        onClick={handleSubmitWarehouseReceipt}
                                    >
                                        Nhập hàng
                                    </button>
                                </div>
                            </div>

                            <Modal
                                centered
                                show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Thêm nhà cung cấp</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* full name */}
                                    <div className={cn("mb-5 row")}>
                                        <label for="fullName-input-login"
                                            className={cn("col-lg-3", "col-form-label", "input-title")}>
                                            Tên
                                        </label>
                                        <div className={cn("col-lg-9")}>
                                            <input
                                                type="text"
                                                id="fullName-input-login"
                                                className={cn("form-control", "input-item")}
                                                name="name"
                                                onChange={onInputChange}
                                                value={supplierInput.name}

                                            />

                                            {supplierError.fullName && (<span className={cn("text-danger")}>{supplierError.fullName}</span>)}

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
                                                value={supplierInput.email}

                                            />
                                            {supplierError.email && (<span className={cn("text-danger")}>{supplierError.email}</span>)}

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
                                                value={supplierInput.phoneNumber}
                                            />
                                            {supplierError.phoneNumber && (<span className={cn("text-danger")}>
                                                {supplierError.phoneNumber}
                                            </span>)}
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-secondary"
                                        size="lg"
                                        onClick={handleClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="success" onClick={
                                            () => {
                                                handleClose()
                                                handleSubmitSupplier()
                                            }
                                        }>
                                        Lưu
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}