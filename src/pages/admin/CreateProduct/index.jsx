import classNames from "classnames/bind";
import style from "./CreateProduct.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLocation, useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { createCategory, getAllCategory } from "../../../services/categoryService";
import {
    deleteImage, deleteAttribute, deleteVariant,
    getAllVariant,
    getVariantValue,
    createProduct,
    createProductImages,
    createProductThumbnail
} from "../../../services/productService";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getStock } from "../../../services/stockService";
import { formatDate } from "../../../utils/formatDate";
import AddDynamicInputFields from "../../../components/AddDynamicInputFields";
import Form from 'react-bootstrap/Form';
import { cartesianProduct } from "../../../utils/variant";
import { createCalculationUnit, getCalculationUnit } from "../../../services/calculationUnitService";
import { inputFocus } from "../../../utils/input";
import ModalWarningDelete from "../../../components/ModalWarningDelete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AlertError from "../../../components/AlertError";
import CloseIcon from '@mui/icons-material/Close';
import { Box, Breadcrumbs, ImageList, ImageListItem, Typography } from "@mui/material";
import { styleModal } from "../ImportGoods";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { routes } from "../../../config/routes";

const cn = classNames.bind(style);

function validateValueArray(array, value) {
    var valid = true;
    var values = array.map(a => a.values)
    values.forEach(
        a => {
            a.forEach(element => {
                if (element == value) {
                    valid = false;
                }
            });
        }
    )
    return valid;
}
export default function CreateProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.item;
    const isView = location.state?.isView;
    const isEdit = location.state?.isEdit;
    var attributeList = [];
    var variantList = [];
    var imageList = [];
    const [show, setShow] = useState(false);
    const [showCalculationUnit, setShowCalculationUnit] = useState(false);
    const [calculationUnitRequest, setCalculationUnitRequest] = useState({
        name: "",
        description: ""
    });
    const [calculationUnits, setCalculationUnits] = useState([]);

    const [variationTypes, setVariantTypes] = useState([]);
    const [variation, setVariation] = useState([])
    const [unavailableCombinations, setUnavailableCombinations] = useState([])
    const [variantNames, setVariantNames] = useState([]);
    const [variantCombination, setVariantCombination] = useState([]);
    const [newVariantError, setNewVariantError] = useState({
        name: '',
        existed: ''
    })

    const [variantValues, setVariantValues] = useState([]);
    const [shouldCreateCombination, setShouldCreateCombination] = useState(false);
    const [showModalWarningDelete, setShowModalWarningDelete] = useState(false)
    const [statusProduct, setStatusProduct] = useState(product?.status ?? "ACTIVE")
    const [variantDelete, setVariantDelete] = useState({})
    const [showAlertDeleteError, setShowAlterDeleteError] = useState(false)
    const [showModalWarningDeleteVariantValue, setShowModalWarningDeleteVariantValue] = useState(false)
    const [variantValueDelete, setVariantValueDelete] = useState({})
    const [variantValueNameDelete, setVariantValueNameDelete] = useState({})
    const [openModalShipment, setOpenModalShipment] = useState(false)

    console.log("product", product)
    //Variant
    useEffect(
        () => {
            getAllVariant().then(
                data => {
                    console.log("variant", data)
                    setVariantNames(data.result)
                }
            )
        }, []
    )
    useEffect(
        () => {
            var tempVariantTypes = [];
            var tempVariantCombination = [];
            product?.variants?.forEach(element => {
                var tempObject = {
                    id: element.id,
                    variantCombination: element.variantValues.map(
                        a => a.value
                    ),
                    stock: element.stock,
                    sellingPrice: element.sellingPrice,
                    capitalPrice: element.capitalPrice,
                    calculationUnitId: element.calculationUnit.id
                };
                tempVariantCombination.push(tempObject)
                element.variantValues.forEach(
                    a => {
                        var isFound = false;
                        tempVariantTypes.forEach
                            (
                                it => {
                                    if (it.name == a.name) {
                                        isFound = true
                                        it.values = [...it.values, a.value]
                                    }
                                }
                            )
                        if (!isFound) {
                            tempVariantTypes.push(
                                {
                                    id: Math.random(),
                                    name: a.name,
                                    values: [a.value]
                                }
                            )
                        }
                    }
                )
            });
            setVariantTypes(tempVariantTypes)
            setVariantCombination(tempVariantCombination)
        }, [product]
    )

    //calculationUnit
    useEffect(
        () => {
            getCalculationUnit().then(
                data => {
                    console.log("calcUnit", data)
                    setCalculationUnits(data.result)
                }
            )
        }, []
    )
    if (product) {
        attributeList = product.attributes;
        variantList = product.variants.map(
            (item, index) => {
                return {
                    id: item?.id,
                    name: item?.variantValues[0].name,
                    value: item?.variantValues[0].value,
                    stock: item?.stock,
                    sellingPrice: item?.sellingPrice,
                    capitalPrice: item?.capitalPrice
                }
            }
        );
        imageList = product.images.map(
            (item, index) => {
                return {
                    id: item?.id,
                    path: item?.filePath,
                    file: null
                }
            }
        );
    }
    //Preview image
    const [files, setFile] = useState(imageList);
    const [mainImageError, setMainImageError] = useState("");
    function handleChange(e) {
        setFile([
            ...files,
            {
                id: window.crypto.randomUUID(),
                path: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0]
            }
        ]
        )
    }

    const handleDeleteImage = (item) => {
        if (item.file == null) {
            deleteImage(item.id)
        }
    }
    //get all category
    var [categories, setCategories] = useState([]);
    useEffect(
        () => {
            getAllCategory().then(
                data => { setCategories(data.result) }
            );
        }, []
    )

    //Product
    var [productInput, setProductInput] = useState({
        id: product?.id ?? null,
        name: product?.name ?? null,
        categoryId: product?.category.id ?? null,
        description: product?.description ?? null,
        thumbnail: product?.thumbnail ?? null
    });
    // console.log(productInput)
    var [productError, setProductError] = useState({
        id: null,
        name: null,
        categoryId: null,
        description: null,
        thumbnail: null
    });

    const onProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateProductInput(e)
    };

    const validateProductInput = (e) => {
        let { name, value } = e.target;
        setProductError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên';
                    }
                    break;
                case 'categoryId':
                    if (!value) {
                        stateObj[name] = 'Vui lòng chọn danh mục';
                    }
                    break;
                case 'description':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập mô tả.';
                    }
                    break;
                case 'thumbnail':
                    if (!value) {
                        stateObj[name] = 'Vui lòng chọn ảnh thumbnail';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };

    //Review product thumbnail
    const [productReviewThumbnail, setProductReviewThumbnail] = useState(productInput.thumbnail || "");
    function handleChangeProductThumbnail(e) {
        setProductInput((prev) => ({
            ...prev,
            thumbnail: e.target.files[0],
        }));
        setProductReviewThumbnail(
            URL.createObjectURL(e.target.files[0])
        )
    }

    //Attribute
    var [attributeInput, setAttributeInput] = useState({
        id: null,
        name: '',
        value: ''
    });
    var [attributeError, setAttributeError] = useState({
        name: '',
        value: ''
    });
    var [attributeMainError, setAttributeMainError] = useState("");
    var [attributes, setAttributes] = useState([...attributeList]);
    const handleDeleteAttribute = (item) => {
        var isDelete = false;
        attributeList?.forEach(
            (it) => {
                if (it.id == item.id) {
                    isDelete = true;
                }
            }
        )
        if (isDelete) {
            //Call Api
            deleteAttribute(item.id);
        }
    }


    const onAttributeInputChange = (e) => {
        const { name, value } = e.target;
        setAttributeInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateAttributeInput(e)
    };

    const validateAttributeInput = (e) => {
        let { name, value } = e.target;
        setAttributeError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên';
                    }
                    break;
                case 'value':
                    if (!value) {
                        stateObj[name] = 'Vui lòng giá trị';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };


    const [attributeId, setAttributeId] = useState(window.crypto.randomUUID());
    const handleSubmitAttribute = (e) => {
        console.log("submit attribute")
        if (attributeError.name.length == 0 && attributeError.value.length == 0
            && attributeInput.name !== '' && attributeInput.value !== ''
        ) {
            if (attributeInput.id !== null) {
                setAttributes(attributes.map(attr =>
                    attr.id === attributeInput.id ? { ...attributeInput } : attr
                ));
            }
            else {
                setAttributes([
                    ...attributes,
                    {
                        id: attributeId,
                        name: attributeInput.name,
                        value: attributeInput.value
                    }
                ]
                )
                setAttributeId(window.crypto.randomUUID())
            }
        }
    }
    const refreshAttributeInput = () => {
        setAttributeInput({
            id: null,
            name: "",
            value: ""
        })
    }

    const handleEditAttribute = (attribute) => {
        setAttributeInput({
            id: attribute.id,
            name: attribute.name,
            value: attribute.value
        }
        )
    }

    //Variant    
    var [variantMainError, setVariantMainError] = useState("");

    const handleDefaultVariant = () => {
        if (variationTypes.length == 0) {
            setVariantTypes(
                prev =>
                    [...prev, { name: "DEFAULT", values: ["DEFAULT"] }]
            );
            setShouldCreateCombination(true)
        }
        else if (variationTypes.length == 1) {
            if (variationTypes[0].name == "DEFAULT") {
                setShouldCreateCombination(true)
            }
        }
    }

    useEffect(() => {
        if (shouldCreateCombination && variationTypes.length > 0) {
            handleCreateVariantCombination();
            setShouldCreateCombination(false); // reset cờ
        }
    }, [variationTypes, shouldCreateCombination]);

    // Submit product
    const handleSubmitProduct = () => {
        let productRequest = {
            id: product?.id ?? null,
            status: statusProduct
        };
        let productThumbnailRequest = "";
        let imageRequest = [];
        var ok = true;
        let fields = ["name", "categoryId", "description"];

        fields.forEach(field => {
            if (productInput[field]) {
                productRequest[field] = productInput[field];
            } else {
                if (field == "name") field = "productName";
                inputFocus(field);
                ok = false;
            }
        });
        if (productInput.thumbnail) {
            productThumbnailRequest = productInput.thumbnail;
            setProductError((prev) => ({
                ...prev,
                thumbnail: ""
            }))
        }
        else {
            setProductError((prev) => ({
                ...prev,
                thumbnail: "Vui lòng thêm thumbnail"
            }))
            ok = false
        }
        // Attribute
        if (attributes.length == 0) {
            setAttributeMainError("Vui lòng thêm thông tin chi tiết sản phẩm")
            ok = false
        }
        else {
            setAttributeMainError("")
            productRequest.attributes = [];
            console.log("submit")
            console.log(attributes)
            productRequest.attributes = attributes.map(e => {
                const isNew = !attributeList.some(element => element.id === e.id);
                return {
                    ...e,
                    id: isNew ? null : e.id,  // Giữ nguyên id nếu đã có
                };
            });

            // console.log(productRequest.attributes);
        }
        // Variant
        if (variantCombination.length == 0) {
            setVariantMainError("Vui lòng thêm variant cho sản phẩm")
            ok = false
        }
        else {
            setVariantMainError("")
            productRequest.variants = variationTypes;
            productRequest.variantValues = variantCombination;
        }
        //image
        if (files.length == 0) {
            setMainImageError("Vui lòng thêm ảnh cho sản phẩm")
        }
        else {
            setMainImageError("")
            files.forEach(e => {
                if (e.file != null) {
                    imageRequest.push(e.file)
                }
            })
        }

        if (ok) {
            console.log("product Request")
            console.log(productRequest)
            if (productRequest.id != null) {
                createProduct(productRequest).then(
                    data => {
                        if (data.code == 200) {
                            if (productThumbnailRequest != '') {
                                createProductThumbnail(productThumbnailRequest, productRequest.id);
                            }
                            if (imageRequest.length != 0) {
                                createProductImages(imageRequest, productRequest.id)
                            }
                            navigate(-1)
                        }
                    }
                )
            }
            else {
                createProduct(productRequest).then(
                    data => {
                        // console.log(data);
                        if (data.code == 200) {
                            createProductThumbnail(productThumbnailRequest, data.result.id)
                                .then(it =>
                                    console.log(it)
                                );
                            createProductImages(imageRequest, data.result.id)
                                .then(
                                    it => console.log(it)
                                );
                            navigate(-1)
                        }
                    }
                );
            }
        }
    }

    // category Modal 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [categoryError, setCategoryError] = useState("")
    const [categoryName, setCategoryName] = useState("");
    const handleChangeCategoryName = (e) => {
        const { value } = e.target;
        setCategoryName(value)
    }
    const handleSubmitCategory = (e) => {
        if (!categoryName) {
            setCategoryError("Nhập tên danh mục")
        }
        else {
            console.log(categoryName)
            createCategory({ name: categoryName }).then(
                data => {
                    if (data.code == 200) {
                        getAllCategory().then(
                            categoryData => setCategories(categoryData?.result)
                        )
                    }
                }
            )
        }
    }

    //Warehouse modal
    const [warehouseList, setWarehouseList] = useState([]);
    const [showWareHouse, setShowWarehouse] = useState(false);
    const handleCloseWarehouse = () => setShowWarehouse(false);
    const handleShowWarehouse = () => setShowWarehouse(true);

    const handleShowWarehouseCard = (id) => {
        if (product?.id != null) {
            handleShowWarehouse()
            getStock(id).then(
                data => {
                    console.log(data)
                    data.result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                    setWarehouseList(data.result);
                }
            )
        }
    }

    useEffect(
        () => {
            console.log("variationTypes", variationTypes)
        }, [variationTypes]
    )

    useEffect(
        () => {
            console.log(variantCombination)
        }, [variantCombination]
    )

    const handleCreateVariantCombination = (newVariant) => {
        var valid = true;
        if (variationTypes.length == 0) {
            valid = false
        }
        variationTypes.forEach(
            it => {
                if (it.name == "") {
                    valid = false
                    setNewVariantError({
                        name: "Hãy chọn thuộc tính"
                    })
                    return;
                }
                it.values.forEach(
                    value => {
                        if (value == "") {
                            valid = false;
                            setNewVariantError({
                                name: "Hãy chọn giá trị"
                            })
                            return;
                        }
                    }
                )
            }
        )
        if (!valid) return;
        else {
            var values = variationTypes.map(a => a.values);
            if (newVariant) {
                values = newVariant.map(a => a.values);
            }
            const variantCombinations = cartesianProduct(values);
            console.log("combinations", variationTypes)
            var temp = [];
            var cnt = 0;
            if (variantCombination?.length > 0) {
                variantCombination.forEach(
                    (a, index) => {
                        if (a.id != null && variantCombinations[index]) {
                            a.variantCombination = variantCombinations[index];
                            temp.push(a)
                        }
                        else if (variantCombinations[index]) {
                            temp.push(
                                {
                                    id: null,
                                    variantCombination: variantCombinations[index],
                                    stock: "",
                                    sellingPrice: "",
                                    capitalPrice: "",
                                    calculationUnitId: ""
                                }
                            )
                        }
                        cnt++;
                    }
                )
            }
            if (variantCombination.length > 0 || variantCombination.length < variantCombinations.length) {
                console.log("yes")
                var x = cnt;
                while (x < variantCombinations.length) {
                    if (variantCombinations[x])
                        temp.push(
                            {
                                id: null,
                                variantCombination: variantCombinations[x],
                                stock: "",
                                sellingPrice: "",
                                capitalPrice: "",
                                calculationUnitId: ""
                            }
                        )
                    x++
                }
            }

        }
        setVariantCombination(temp)
    }

    // Calculation unit
    const handleSubmitCalculationUnit = () => {
        createCalculationUnit(calculationUnitRequest).then(
            data => {
                console.log(data)
                setCalculationUnits(prev => [
                    ...prev, data.result
                ])
            }
        )
    }

    async function fetchVariant(item) {
        const data = await getVariantValue(item.name);
        setVariantValues(data.result)
    }

    const handleDeleteVariant = () => {

        if (variantDelete.id != null) {
            deleteVariant(variantDelete.id).then(
                data => {
                    if (data.code == 200) {
                        setVariantCombination(prev =>
                            prev.filter(variant =>
                                JSON.stringify(
                                    variant.variantCombination
                                )
                                !== JSON.stringify(
                                    variantDelete.variantCombination
                                )
                            )
                        )
                        if (variationTypes[0]?.name == "DEFAULT") {
                            setVariantTypes(
                                prev =>
                                    prev.filter(a => a.name != "DEFAULT")

                            )
                        }
                    }
                    else {
                        setShowAlterDeleteError(true)
                    }
                }
            )
        }
        else if (variantDelete.id == null) {
            setVariantCombination(prev =>
                prev.filter(variant =>
                    JSON.stringify(
                        variant.variantCombination
                    )
                    !== JSON.stringify(
                        variantDelete.variantCombination
                    )
                )
            )
            if (variationTypes[0]?.name == "DEFAULT") {
                setVariantTypes(
                    prev =>
                        prev.filter(a => a.name != "DEFAULT")

                )
            }
        }
        setShowModalWarningDelete(false)
    }

    const handleDeleteVariantValue = () => {
        var variantIds = [];
        var temp = [];
        variantCombination.forEach(
            a => {
                var valid = a.variantCombination.some(it => it == variantValueDelete)
                console.log("valid", a.variantCombination)
                if (valid) {
                    if (a.id != null) {
                        variantIds.push(a.id)
                    }
                }
                else {
                    temp.push(a)
                }
            }
        )
        console.log("deleteRequest", variantIds.join(","))
        deleteVariant(variantIds.join(",")).then(
            data => {
                console.log(data)
                if (data.status == 200) {
                    setVariantTypes(prev =>
                        prev.map(variant =>
                            variant.name === variantValueNameDelete.name
                                ? { ...variant, values: variant.values.filter(a => a != variantValueDelete) }
                                : variant
                        )
                    )
                    setVariantCombination(temp);
                }
                else {
                    setShowAlterDeleteError(true)
                }
            }
        )
        setShowModalWarningDeleteVariantValue(false)

    }
    return (
        <>
            <div className={cn("container", "mt-1")}>
                <Breadcrumbs aria-label="breadcrumb">
                    <div
                        style={{ cursor: "pointer" }}
                        underline="hover" onClick={() => {
                            navigate(routes.searchProduct)
                        }}>
                        Danh sách sản phẩm
                    </div>
                    {
                        isView &&
                        <Typography sx={{ color: 'var(--primary-color)' }}>{
                            product?.name
                        }</Typography>
                    }
                    {
                        isEdit &&
                        <Typography sx={{ color: 'var(--primary-color)' }}>
                            Chỉnh sửa sản phẩm
                        </Typography>
                    }
                    {
                        !isView && !isEdit &&
                        <Typography sx={{ color: 'var(--primary-color)' }}>
                            Thêm sản phẩm
                        </Typography>
                    }
                </Breadcrumbs>
                <div className="row mb-4 mt-2">
                    <div onClick={() => navigate(-1)} className={cn("back-previous-page", "col")}>
                        <ArrowBackIosIcon />
                        <span>Sản phẩm</span>
                    </div>
                    <div className={cn("btn-create-product", 'col')}>
                        {isView != true && (
                            <>
                                <Button variant="light"
                                    className={cn("me-2", "btn-status")}
                                    active={
                                        statusProduct == "ACTIVE" ?
                                            false
                                            :
                                            true

                                    }
                                    onClick={() => {
                                        if (statusProduct == "ACTIVE") {
                                            setStatusProduct("INACTIVE")
                                        }
                                        else {
                                            setStatusProduct("ACTIVE")
                                        }
                                    }}
                                >
                                    <div className={cn("content")}>
                                        {
                                            statusProduct == "ACTIVE" ? (
                                                <>
                                                    <VisibilityIcon />
                                                    <span>
                                                        Ẩn
                                                    </span>
                                                </>
                                            )
                                                :
                                                <>
                                                    <VisibilityOffIcon />
                                                    <span>
                                                        Hiển thị
                                                    </span>
                                                </>

                                        }
                                    </div>
                                </Button>
                                <button
                                    onClick={handleSubmitProduct}
                                    className={cn("btn-4")}>{
                                        isEdit ? "Cập nhật" : "Tạo sản phẩm"
                                    }</button>

                            </>
                        )
                        }
                    </div>
                </div>
                <div className="row">
                    {/* back */}
                    {/* Image part */}
                    <div className={cn("col-12", "img-content")}>
                        <div className={cn("inner-content")}>
                            <div className={cn("head", "row")}>
                                <h4 className={cn("title", "col-6")}>Ảnh sản phẩm</h4>
                                <div className={cn("add-img", "col-6")}>
                                    {isView != true && (
                                        <button className={cn("add-img-btn", "btn-6")}>
                                            <label for="product-image">
                                                <AddIcon />
                                                <span>
                                                    Thêm ảnh
                                                </span>
                                            </label>
                                        </button>
                                    )}

                                    <input
                                        multiple
                                        onChange={handleChange} hidden name="product-image" type="file" id="product-image" />
                                </div>
                                {mainImageError && (<span className={cn("text-danger")}>{mainImageError}</span>)}
                            </div>
                            <div className={cn("img-list")}>
                                <ImageList sx={{ width: "100%", height: 164 }} cols={5} rowHeight={164}>
                                    {files?.map((item) => (
                                        <ImageListItem key={item.img}>
                                            <div
                                                key={item.id}
                                                className={cn("img-item", "row")}>
                                                <img
                                                    loading="lazy"
                                                    className={cn("col-9", "img-preview")}
                                                    src={item.path} alt="" />
                                                {isView != true && (
                                                    <button
                                                        onClick={() => {
                                                            setFile(
                                                                files.filter(it => it.id !== item.id)
                                                            )
                                                            handleDeleteImage(item)
                                                        }}
                                                        className={cn("delete-btn", "col-3")}>
                                                        <DeleteIcon />
                                                        <span>Xóa</span>
                                                    </button>
                                                )}
                                            </div>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </div>
                        </div>
                    </div>
                    {/* End image part */}
                    {/* Product info */}
                    <div className={cn("col-12", "product-info")}>
                        <div className={cn("inner-content")}>
                            <h4 className={cn("title")}>Thông tin</h4>
                            <div className={cn("main-content")}>
                                <form action="" className={cn("form-create-product")}>
                                    {/* name */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="productName"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tiêu đề</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                disabled={isView ? true : false}
                                                id="productName"
                                                className={cn("form-control", "input-item", "productName")}
                                                name="name"
                                                onChange={onProductInputChange}
                                                value={productInput.name}
                                            />
                                            {productError.name && (<span className={cn("text-danger")}>{productError.name}</span>)}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="categoryId"
                                            className={cn("col-3", "col-form-label", "input-title")}>Danh mục</label>
                                        <div className={cn("col-8")}>
                                            <select
                                                disabled={isView ? true : false}
                                                name="categoryId" id="categoryId"
                                                className={cn("form-select", "form-select-item", "categoryId")}
                                                onChange={onProductInputChange}
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {
                                                    categories?.map(
                                                        (item, index) => (
                                                            item.id == productInput.categoryId ?
                                                                (<option selected={true} key={item.id} value={item.id} >
                                                                    {item.name}
                                                                </option>)
                                                                :
                                                                (<option key={item.id} value={item.id} >
                                                                    {item.name}
                                                                </option>)
                                                        )
                                                    )
                                                }
                                            </select>
                                            {productError.categoryId && (<span className={cn("text-danger")}>
                                                {productError.categoryId}</span>)}
                                        </div>
                                        {isView != true && (
                                            <div className={cn("col-1")}>
                                                {/* category Modal */}
                                                <Button size="sm" variant="outline-secondary" onClick={handleShow}>
                                                    <AddIcon />
                                                </Button>

                                                <Modal
                                                    aria-labelledby="contained-modal-title-vcenter"
                                                    centered
                                                    show={show} onHide={handleClose}
                                                    className={cn("category-modal")}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Thêm danh mục</Modal.Title>
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
                                                                    onChange={handleChangeCategoryName}
                                                                />
                                                                {categoryError && (<span className={cn("text-danger")}>{categoryError}</span>)}

                                                            </div>
                                                        </div>
                                                    </Modal.Body>

                                                    <Modal.Footer>
                                                        <Button size="lg" variant="outline-secondary" onClick={handleClose}>Hủy</Button>
                                                        <Button
                                                            size="lg" variant="success" onClick={(e) => {
                                                                handleSubmitCategory(e)
                                                                handleClose()

                                                            }
                                                            }>Lưu</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                        )}
                                    </div>



                                    {/* Thumbnail */}
                                    <div className={cn("mb-4 row")}>
                                        <label
                                            className={cn("col-3", "col-form-label", "input-title")}>Thumbnail</label>
                                        <div className={cn("col-9")}>
                                            {isView != true && (
                                                <button className={cn("add-img-btn", "btn-3", "thumbnail")}
                                                    type="button"
                                                >
                                                    <label for="productThumbnail">
                                                        <AddIcon />
                                                        <span>
                                                            Thêm ảnh
                                                        </span>
                                                    </label>
                                                </button>
                                            )}
                                            {productError.thumbnail && (<span className={cn("text-danger")}>
                                                {productError.thumbnail}</span>)}
                                            <input
                                                onChange={handleChangeProductThumbnail}
                                                hidden name="productThumbnail" type="file" id="productThumbnail"

                                            />
                                            <div className={cn("thumbnail-review")}>
                                                <img src={productReviewThumbnail} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="description"
                                            className={cn("col-3", "col-form-label", "input-title")}>Mô tả</label>
                                        <div className={cn("col-9")}>
                                            <textarea
                                                disabled={isView ? true : false}
                                                type="text"
                                                id="description"
                                                className={cn("form-control", "input-item", "description")}
                                                name="description"
                                                required
                                                rows={5}
                                                onChange={onProductInputChange}
                                                value={productInput.description}
                                            />
                                            {productError.description && (<span className={cn("text-danger")}>
                                                {productError.description}</span>)}
                                        </div>
                                    </div>

                                    {/* attribute */}
                                    <div className={cn("mb-4", "row", "product-attribute")}>
                                        <label for="attribute"
                                            className={cn("col-3", "col-form-label", "input-title")}>Chi tiết sản phẩm</label>
                                        <div className={cn("col-9")}>
                                            {isView != true && (
                                                <button type="button"
                                                    data-bs-toggle="modal" data-bs-target="#attribute-modal"
                                                    className={cn("btn-6", "btn-open-attribute-dialog")}>
                                                    <AddIcon />
                                                    <span>
                                                        Thêm
                                                    </span>
                                                </button>
                                            )}
                                            {attributeMainError && (<span className={cn("text-danger")}>
                                                {attributeMainError}</span>)}
                                        </div>

                                        <div className={cn("attribute-list", "mt-3")}>

                                            <table className={cn("table", "table-hover")}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Tên</th>
                                                        <th scope="col">Giá trị</th>
                                                        {isView != true && (
                                                            <th scope="col">Thao tác</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        attributes?.map(
                                                            (item, index) => (
                                                                <tr>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.value}</td>
                                                                    {isView != true && (
                                                                        <td>
                                                                            <EditIcon
                                                                                onClick={() => handleEditAttribute(item)}
                                                                                data-bs-toggle="modal" data-bs-target="#attribute-modal"
                                                                                className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                                            <DeleteIcon
                                                                                onClick={() => {
                                                                                    setAttributes(
                                                                                        attributes.filter(a => a.id !== item.id)
                                                                                    )
                                                                                    handleDeleteAttribute(item)
                                                                                }}
                                                                                className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                                        </td>
                                                                    )}
                                                                </tr>

                                                            )
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* new variant */}
                                    <div className={cn("product-variant")}>
                                        <h5>
                                            Biến thể
                                        </h5>
                                        {
                                            isView != true &&
                                            <Button className="mb-2"
                                                onClick={handleDefaultVariant}
                                                variant="primary">
                                                Biến thể mặc định
                                            </Button>
                                        }
                                        <AlertError showAlert={showAlertDeleteError}
                                            message={"Xóa thất bại! Sản phẩm đã được sử dụng hoặc sản phẩm phải có ít nhất một biến thể!"}
                                            onClose={() => setShowAlterDeleteError(false)}
                                        />
                                        {variationTypes?.filter(a => a.name != "DEFAULT").map((item, index) => (
                                            <div className="row">
                                                <div className="variant-name col">
                                                    <div className="title">
                                                        Thuộc tính
                                                    </div>
                                                    <div className={cn("flex-cus")}>
                                                        <AddDynamicInputFields
                                                            isAdd={false}
                                                            values={variantNames}
                                                            setInputs={setVariantTypes}
                                                            object={item}
                                                            disable={isView}
                                                            errorMessage={"Lỗi! Thuộc tính chưa chọn hoặc trùng lặp"}
                                                            error={newVariantError}
                                                            value={item.name}
                                                            type={"name"}
                                                            isEdit={
                                                                product ? true : false
                                                            }
                                                            setError={setNewVariantError}
                                                            onChange={
                                                                (e) => {
                                                                    var key = e.target.value
                                                                    var existedKey = variationTypes.find(e => e.name == key)
                                                                    if (existedKey) {
                                                                        setNewVariantError({
                                                                            name: "Lỗi! Thuộc tính chưa chọn hoặc trùng lặp"
                                                                        })
                                                                    }
                                                                    if (key != "--Chọn--" && !existedKey) {
                                                                        setNewVariantError({
                                                                            name: ""
                                                                        })
                                                                        setVariantTypes(
                                                                            prev =>
                                                                                prev.filter(a => a.name != "")

                                                                        )
                                                                        setVariantTypes(
                                                                            prev =>
                                                                                [...prev, { name: key, values: [""] }]

                                                                        )
                                                                    }
                                                                }
                                                            }
                                                        />
                                                        {
                                                            !item?.id && (
                                                                <DeleteIcon
                                                                    onClick={() => {
                                                                        const newArray = [...variationTypes];
                                                                        newArray.splice(index, 1);
                                                                        setVariantTypes(newArray);
                                                                        handleCreateVariantCombination(newArray)
                                                                    }}
                                                                />
                                                            )

                                                        }
                                                    </div>
                                                </div>
                                                <div className="variant-value col">
                                                    <div className="title">
                                                        Giá trị
                                                    </div>
                                                    {
                                                        item?.values?.map(
                                                            (valueInput, index) => (
                                                                <AddDynamicInputFields
                                                                    isAdd={true}
                                                                    type={"value"}
                                                                    keyName={item.name}
                                                                    value={valueInput}
                                                                    index={index}
                                                                    disable={isView}
                                                                    array={item.values}
                                                                    isView={isView}
                                                                    isEdit={
                                                                        product ? true : false
                                                                    }
                                                                    handleAddInput={
                                                                        () => setVariantTypes
                                                                    }
                                                                    setInputs={setVariantTypes}
                                                                    errorMessage={"Lỗi! Giá trị chưa chọn hoặc trùng lặp"}
                                                                    error={newVariantError}
                                                                    setError={setNewVariantError}
                                                                    onClick={
                                                                        () => {
                                                                            fetchVariant(item)
                                                                        }
                                                                    }
                                                                    onChange={
                                                                        (e) => {
                                                                            var value = e.target.value
                                                                            var valid = validateValueArray(variationTypes, value);
                                                                            console.log("valid", valid)
                                                                            if (!valid) {
                                                                                setNewVariantError({
                                                                                    name: "Lỗi! Giá trị chưa chọn hoặc trùng lặp"
                                                                                })
                                                                            }
                                                                            if (value != "--Chọn--" && valid) {
                                                                                setNewVariantError({
                                                                                    name: ""
                                                                                })

                                                                                setVariantTypes(prev =>
                                                                                    prev.map(variant =>
                                                                                        variant.name === item.name
                                                                                            ?
                                                                                            {
                                                                                                ...variant,
                                                                                                values: variant.values.map((v, i) => i === index ? value : v)
                                                                                            }
                                                                                            : variant
                                                                                    )
                                                                                );

                                                                            }
                                                                        }
                                                                    }
                                                                    onDelete={() => {

                                                                        setVariantValueNameDelete(item)
                                                                        setVariantValueDelete(valueInput)
                                                                        setShowModalWarningDeleteVariantValue(true)
                                                                    }}
                                                                    length={item.values.length}
                                                                />
                                                            )
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        ))}

                                        {
                                            isView != true &&
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    var valid = true;
                                                    variationTypes.forEach(
                                                        it => {
                                                            if (it.name == "") {
                                                                valid = false
                                                                setNewVariantError({
                                                                    name: "Hãy chọn thuộc tính"
                                                                })
                                                            }
                                                            it.values.forEach(
                                                                value => {
                                                                    if (value == "") {
                                                                        valid = false;
                                                                        setNewVariantError({
                                                                            name: "Hãy chọn giá trị"
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    )
                                                    if (variationTypes[0]?.name == "DEFAULT") {
                                                        valid = false;
                                                    }
                                                    if (valid)
                                                        setVariantTypes(prev => [...prev, { name: "", values: [""] }]);
                                                }
                                                }
                                                className={cn("load-more-btn", "btn-5")}>
                                                <AddIcon />
                                                <span>
                                                    Thêm thuộc tính
                                                </span>
                                            </button>
                                        }
                                        {
                                            isView != true &&
                                            <button type="button"
                                                onClick={() => {
                                                    handleCreateVariantCombination()
                                                }
                                                }
                                                className={cn("load-more-btn", "btn-3", "mt-2")}>
                                                <span>
                                                    Xong
                                                </span>
                                            </button>
                                        }
                                        {variantMainError && (<span className={cn("text-danger")}>{variantMainError}</span>)}

                                    </div>
                                    {/* old variant */}
                                    <div className={cn("mt-4", "row", "product-variant")}>

                                        <div className={cn("product-variant-list")}>
                                            <table className={cn("table table-hover")}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Biến thể</th>
                                                        <th scope="col">Đơn vị tính</th>
                                                        <th scope="col">Stock</th>
                                                        <th scope="col">Giá bán</th>
                                                        <th scope="col">Giá vốn</th>
                                                        <th scope="col">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        variantCombination?.map(
                                                            (item, index) => (
                                                                <tr
                                                                    key={index}
                                                                >
                                                                    <td>{item.variantCombination?.join(" - ")}</td>
                                                                    <td>
                                                                        {/* Calculation Unit*/}
                                                                        <div className="row">
                                                                            <div className={cn("col-8", "p-0")}>
                                                                                <select
                                                                                    disabled={isView}
                                                                                    name="calculationUnit" id="calculationUnit"
                                                                                    className={cn("form-select", "form-select-item", "calculationUnit")}
                                                                                    onChange={(e) => {
                                                                                        setVariantCombination(prev =>
                                                                                            prev.map(variant =>
                                                                                                JSON.stringify(
                                                                                                    variant.variantCombination
                                                                                                )
                                                                                                    === JSON.stringify(
                                                                                                        item.variantCombination
                                                                                                    )
                                                                                                    ? {
                                                                                                        ...variant,
                                                                                                        calculationUnitId: e.target.value
                                                                                                    }
                                                                                                    : variant
                                                                                            )

                                                                                        )
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    <option value="">-- Chọn đvt</option>
                                                                                    {
                                                                                        calculationUnits.map(
                                                                                            (calcUnit, index) => (
                                                                                                item.calculationUnitId == calcUnit.id ?
                                                                                                    (<option selected={true} value={calcUnit.id} >
                                                                                                        {calcUnit.name}
                                                                                                    </option>
                                                                                                    ) :
                                                                                                    (<option value={calcUnit.id} >
                                                                                                        {calcUnit.name}
                                                                                                    </option>)
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                            {isView != true && (
                                                                                <div className={cn("col-1")}>
                                                                                    {/* calculation Modal */}
                                                                                    <Button size="sm"
                                                                                        variant="outline-secondary"
                                                                                        onClick={
                                                                                            () => {
                                                                                                setShowCalculationUnit(true)
                                                                                            }

                                                                                        }>
                                                                                        <AddIcon />
                                                                                    </Button>


                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="stock"
                                                                            value={item.stock}
                                                                            disabled={isView}
                                                                            onChange={
                                                                                (e) => {
                                                                                    setVariantCombination(prev =>
                                                                                        prev.map(variant =>
                                                                                            JSON.stringify(
                                                                                                variant.variantCombination
                                                                                            )
                                                                                                === JSON.stringify(
                                                                                                    item.variantCombination
                                                                                                )
                                                                                                ? {
                                                                                                    ...variant,
                                                                                                    stock: e.target.value
                                                                                                }
                                                                                                : variant
                                                                                        )

                                                                                    )
                                                                                }
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="sellingPrice"
                                                                            disabled={isView}
                                                                            value={item.sellingPrice}
                                                                            onChange={
                                                                                (e) => {
                                                                                    setVariantCombination(prev =>
                                                                                        prev.map(variant =>
                                                                                            JSON.stringify(
                                                                                                variant.variantCombination
                                                                                            )
                                                                                                === JSON.stringify(
                                                                                                    item.variantCombination
                                                                                                )
                                                                                                ? {
                                                                                                    ...variant,
                                                                                                    sellingPrice: e.target.value
                                                                                                }
                                                                                                : variant
                                                                                        )

                                                                                    )
                                                                                }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="capitalPrice"
                                                                            disabled={isView}
                                                                            value={item.capitalPrice}
                                                                            onChange={
                                                                                (e) => {
                                                                                    setVariantCombination(prev =>
                                                                                        prev.map(variant =>
                                                                                            JSON.stringify(
                                                                                                variant.variantCombination
                                                                                            )
                                                                                                === JSON.stringify(
                                                                                                    item.variantCombination
                                                                                                )
                                                                                                ? {
                                                                                                    ...variant,
                                                                                                    capitalPrice: e.target.value
                                                                                                }
                                                                                                : variant
                                                                                        )

                                                                                    )
                                                                                }
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            isView != true &&
                                                                            <DeleteIcon
                                                                                onClick={() => {
                                                                                    setShowModalWarningDelete(true)
                                                                                    setVariantDelete(item)
                                                                                    // setVariantCombination(prev =>
                                                                                    //     prev.filter(variant =>
                                                                                    //         JSON.stringify(
                                                                                    //             variant.variantCombination
                                                                                    //         )
                                                                                    //         !== JSON.stringify(
                                                                                    //             item.variantCombination
                                                                                    //         )
                                                                                    //     )
                                                                                    // )
                                                                                    // if (variationTypes[0]?.name == "DEFAULT") {
                                                                                    //     setVariantTypes(
                                                                                    //         prev =>
                                                                                    //             prev.filter(a => a.name != "DEFAULT")

                                                                                    //     )
                                                                                    // }
                                                                                }}
                                                                            />
                                                                        }
                                                                        {
                                                                            isView && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn-3"
                                                                                    onClick={() =>
                                                                                        navigate(routes.stockDetail,
                                                                                            { state: { id: item.id, item, product: product } })
                                                                                    }
                                                                                >
                                                                                    <WarehouseIcon />
                                                                                </button>
                                                                            )
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    }
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                    {/* End product info */}
                    {/* variant and attribute form */}
                    {/* Attribute form */}
                    <div class="modal fade " tabindex="-1" id="attribute-modal" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class={cn("modal-content", "modal-inner-content")}>
                                <div class="modal-header">
                                    <h3 className={cn("modal-title")}>Thuộc tính sản phẩm</h3>
                                    <button
                                        onClick={refreshAttributeInput}
                                        type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class={cn("modal-body", "attribute-form")}>
                                    <div className={cn("mb-4 row")}>
                                        <label for="nameAttribute"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tên</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="nameAttribute"
                                                className={cn("form-control", "input-item")}
                                                onChange={onAttributeInputChange}
                                                name="name"
                                                value={attributeInput.name}
                                            />
                                            {attributeError.name && (<span className={cn("text-danger")}>{attributeError.name}</span>)}

                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="attributeValue"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giá trị</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="attributeValue"
                                                className={cn("form-control", "input-item")}
                                                onChange={onAttributeInputChange}
                                                name="value"
                                                value={attributeInput.value}
                                            />
                                            {attributeError.value && (<span className={cn("text-danger")}>{attributeError.value}</span>)}

                                        </div>
                                    </div>
                                    <input type="text" hidden value={attributeInput.id} name="attributeId" />
                                </div>
                                <div class="modal-footer">
                                    <button
                                        onClick={refreshAttributeInput}
                                        type="button" class={cn("btn-8")} data-bs-dismiss="modal">Hủy</button>
                                    <button
                                        onClick={handleSubmitAttribute}
                                        type="submit" class={cn("btn-7")}>
                                        {
                                            attributeInput.id !== null ? <span>Cập nhât</span> :
                                                <span>
                                                    Thêm
                                                </span>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End attribute form */}

                    {/* Calculation unit modal */}
                    <Modal
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        show={showCalculationUnit} onHide={() => {
                            setShowCalculationUnit(false)
                        }}
                        className={cn("category-modal")}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Thêm đơn vị tính</Modal.Title>
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
                                        name="nameCalculationUnit"
                                        onChange={
                                            (e) => {
                                                setCalculationUnitRequest(
                                                    prev => ({
                                                        ...prev,
                                                        name: e.target.value
                                                    })
                                                )
                                            }
                                        }
                                    />

                                </div>
                            </div>

                            {/* description */}
                            <div className={cn("mb-2 row")}>
                                <label for="nameCategory"
                                    className={cn("col-3", "col-form-label", "input-title")}>
                                    Mô tả
                                </label>
                                <div className={cn("col-9")}>
                                    <input
                                        type="text"
                                        id="nameCategory"
                                        className={cn("form-control", "input-item")}
                                        name="description"
                                        onChange={
                                            (e) => {
                                                setCalculationUnitRequest(
                                                    prev => ({
                                                        ...prev,
                                                        description: e.target.value
                                                    })
                                                )
                                            }
                                        }
                                    />

                                </div>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button size="lg" variant="outline-secondary" onClick={() => {
                                setShowCalculationUnit(false)
                            }}>Hủy</Button>
                            <Button
                                size="lg" variant="success" onClick={(e) => {
                                    handleSubmitCalculationUnit(e)
                                    setShowCalculationUnit(false)

                                }
                                }>Lưu</Button>
                        </Modal.Footer>
                    </Modal>
                </div >
            </div >
            {/* End variant and attribute form */}

            {/* Modal delete variant */}
            <ModalWarningDelete
                show={showModalWarningDelete}
                setShow={setShowModalWarningDelete}
                onCLickAgree={() => {
                    handleDeleteVariant()
                }
                }
            />
            <ModalWarningDelete
                show={showModalWarningDeleteVariantValue}
                setShow={setShowModalWarningDeleteVariantValue}
                onCLickAgree={() => {
                    handleDeleteVariantValue()
                }
                }
            />
            {/* shipment */}
            <Modal
                open={openModalShipment}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className={cn("receipt-modal")}
            >
                <Box sx={styleModal}>
                    <div className={cn("head")}>
                        <span>Lô - Hạn sử dụng</span>
                        <CloseIcon onClick={() => openModalShipment(false)} />
                    </div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Số lô</th>
                                <th scope="col">Hạn sử dụng</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Tồn kho</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </Box>
            </Modal>
        </>
    )
}