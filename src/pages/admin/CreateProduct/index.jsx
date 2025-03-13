import classNames from "classnames/bind";
import style from "./CreateProduct.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../../services/categoryService";
import { getAllSupplier } from "../../../services/supplierCategory";
import { createProduct, createProductThumbnail, createProductImages, deleteImage, deleteAttribute, deleteVariant } from "../../../services/productService";
import { inputFocus } from "../../../utils/input";

const cn = classNames.bind(style);


export default function CreateProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.item;
    var attributeList = [];
    var variantList = [];
    var imageList = [];
    if (product) {
        attributeList = product.attributes;
        console.log(product)
        variantList = product.variants.map(
            (item, index) => {
                return {
                    id: item?.id,
                    name: item?.variantValues[0].name,
                    value: item?.variantValues[0].value,
                    stock: item?.stock,
                    price: item?.price,
                    discount: item?.discount ?? "",
                    discountUnit: item?.discountUnit ?? "",
                    startDate: item?.startDate ?? "",
                    endDate: item?.endDate ?? ""
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
    const [id, setId] = useState(1);
    const [files, setFile] = useState(imageList);
    const [mainImageError, setMainImageError] = useState("");
    function handleChange(e) {
        setId(id + 1);
        setFile([
            ...files,
            {
                id: id,
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

    //get all category
    var [suppliers, setSuppliers] = useState([]);
    useEffect(
        () => {
            getAllSupplier().then(
                data => {
                    setSuppliers(data.result)

                }
            );
        }, []
    )
    //Product
    var [productInput, setProductInput] = useState({
        id: product?.id ?? null,
        name: product?.name ?? null,
        categoryId: product?.category.id ?? null,
        supplierId: product?.supplier.id ?? null,
        origin: product?.origin ?? null,
        productionDate: product?.productionDate ?? null,
        expiry: product?.expiry ?? null,
        description: product?.description ?? null,
        thumbnail: product?.thumbnail ?? null
    });
    // console.log(productInput)
    var [productError, setProductError] = useState({
        id: null,
        name: null,
        categoryId: null,
        supplierId: null,
        origin: null,
        productionDate: null,
        expiry: null,
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

                case 'supplierId':
                    if (!value) {
                        stateObj[name] = 'Vui lòng chọn nhà cung cấp.';
                    }
                    break;
                case 'origin':
                    if (!value) {
                        stateObj[name] = 'Vui lòng chọn nguồn gốc';
                    }
                    break;

                case 'productionDate':
                    if (!value) {
                        stateObj[name] = 'Vui lòng chọn ngày sản xuất.';
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
    var [variantInput, setVariantInput] = useState({
        id: null,
        name: '',
        value: '',
        stock: 0,
        price: '',
        discount: '',
        discountUnit: '',
        startDate: '',
        endDate: ''
    });
    var [variants, setVariants] = useState([...variantList]);
    var [variantError, setVariantError] = useState({
        name: '',
        value: '',
        stock: "",
        price: ""
    });
    var [variantMainError, setVariantMainError] = useState("");

    const onVariantInputChange = (e) => {
        const { name, value } = e.target;
        setVariantInput((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateVariantInput(e);
    };
    const validateVariantInput = (e) => {
        let { name, value } = e.target;
        setVariantError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'name':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập tên';
                    }
                    break;
                case 'value':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập giá trị';
                    }
                    break;
                case 'stock':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập giá trị';
                    }
                    break;
                case 'price':
                    if (!value) {
                        stateObj[name] = 'Vui lòng nhập giá';
                    }
                    break;
                default:
                    break;
            }

            return stateObj;
        });
    };
    const [variantId, setVariantId] = useState(window.crypto.randomUUID());
    const handleSubmitVariant = (e) => {
        const field = ["name",
            "value",
            "stock",
            "price"]
        var ok = true;
        field.forEach((it) => {
            if (variantInput[it].length == 0) {
                ok = false;
            }
        })
        if (ok) {
            if (variantInput.id !== null) {
                var element = variants.find((e) => e.id == variantInput.id);
                element.id = variantInput.id;
                element.name = variantInput.name;
                element.value = variantInput.value;
                element.stock = variantInput.stock;
                element.price = variantInput.price;
                element.discount = variantInput.discount;
                element.discountUnit = variantInput.discountUnit;
                element.startDate = variantInput.startDate;
                element.endDate = variantInput.endDate;
                refreshVariantInput();
            }
            else {
                setVariants([
                    ...variants,
                    {
                        id: variantId,
                        name: variantInput.name,
                        value: variantInput.value,
                        stock: variantInput.stock,
                        price: variantInput.price,
                        discount: variantInput.discount,
                        discountUnit: variantInput.discountUnit,
                        startDate: variantInput.startDate,
                        endDate: variantInput.endDate
                    }
                ]
                )
                setVariantId(window.crypto.randomUUID())
            }
        }
    }
    const refreshVariantInput = () => {
        setVariantInput({
            id: null,
            name: "",
            value: "",
            stock: 0,
            price: '',
            discount: '',
            discountUnit: '',
            startDate: '',
            endDate: ''
        })
    }

    const handleEditVariant = (variant) => {
        setVariantInput({
            id: variant.id,
            name: variant.name,
            value: variant.value,
            stock: variant.stock,
            price: variant.price,
            discount: variant.discount,
            discountUnit: variant.discountUnit,
            startDate: variant.startDate,
            endDate: variant.endDate
        }
        )
    }

    const handleDeleteVariant = (item) => {
        var isDelete = false;
        variantList?.forEach(
            (it) => {
                if (it.id == item.id) {
                    isDelete = true;
                }
            }
        )
        if (isDelete) {
            deleteVariant(item.id);
        }
    }



    // Submit product
    const handleSubmitProduct = () => {
        let productRequest = {
            id: product?.id ?? null
        };
        let productThumbnailRequest = "";
        let imageRequest = [];
        var ok = true;
        let fields = ["name", "categoryId", "supplierId",
            "origin", "productionDate", "description"];

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
                thumbnail: "Vui lòng thêm thumnail"
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
        if (variants.length == 0) {
            setVariantMainError("Vui lòng thêm variant cho sản phẩm")
            ok = false
        }
        else {
            setVariantMainError("")
            const variantRequest = [];
            const variantValuesRequest = [];
            variants.forEach((it) => {
                // Find if the variant name already exists in the variantRequest array
                let variant = variantRequest.find(v => v.name === it.name);
                if (!variant) {
                    // If not found, create a new object for the variant
                    variant = { name: it.name, values: [] };
                    variantRequest.push(variant);  // Add it to the array
                }

                // Push the value into the corresponding variant's values array
                variant.values.push(it.value);
                const isNew = !variantList.some(element => element.id === it.id);
                variantValuesRequest.push({
                    id: isNew ? null : it.id,
                    variantCombination: [
                        it.value
                    ],
                    stock: it.stock,
                    price: it.price,
                    startDate: it.startDate,
                    endDate: it.endDate,
                    discount: it.discount,
                    discountUnit: it.discountUnit
                })
            })
            productRequest.variants = variantRequest;
            productRequest.variantValues = variantValuesRequest;
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
        // console.log(productRequest)
        // console.log(imageRequest)

        if (ok) {
            console.log("product Request")
            console.log(productRequest)
            if (productRequest.id != null) {
                createProduct(productRequest).then(
                    data => console.log(data)
                )
                if (productThumbnailRequest != '') {
                    createProductThumbnail(productThumbnailRequest, productRequest.id);
                }
                if (imageRequest.length != 0) {
                    createProductImages(imageRequest, productRequest.id)
                }

            }
            else {
                createProduct(productRequest).then(
                    data => {
                        // console.log(data);
                        if (data.code == 200) {
                            createProductThumbnail(productThumbnailRequest, data.result.id)
                            // .then(it => 
                            //     console.log(it)
                            // );
                            createProductImages(imageRequest, data.result.id)
                            // .then(
                            //     it => console.log(it)
                            // );
                        }
                    }
                );
            }
        }
    }
    return (
        <>

            <div className={cn("container", "mt-5")}>
                <div className="row mb-4">
                    <div onClick={() => navigate(-1)} className={cn("back-previous-page", "col")}>
                        <ArrowBackIosIcon />
                        <span>Quay lại</span>
                    </div>
                    <div className={cn("btn-create-product", 'col')}>
                        <button
                            onClick={handleSubmitProduct}
                            className={cn("btn-4")}>Tạo sản phẩm</button>
                    </div>
                </div>
                <div className="row">
                    {/* back */}
                    {/* Image part */}
                    <div className={cn("col-3", "img-content")}>
                        <div className={cn("inner-content")}>
                            <div className={cn("head", "row")}>
                                <h3 className={cn("title", "col-6")}>Ảnh sản phẩm</h3>
                                <div className={cn("add-img", "col-6")}>
                                    <button className={cn("add-img-btn", "btn-6")}>
                                        <label for="product-image">
                                            <AddIcon />
                                            <span>
                                                Thêm ảnh
                                            </span>
                                        </label>
                                    </button>

                                    <input
                                        multiple
                                        onChange={handleChange} hidden name="product-image" type="file" id="product-image" />
                                </div>
                                {mainImageError && (<span className={cn("text-danger")}>{mainImageError}</span>)}
                            </div>
                            <div className={cn("img-list")}>
                                {
                                    files?.map(
                                        (item, index) =>
                                        (
                                            <div
                                                key={item.id}
                                                className={cn("img-item", "row")}>
                                                <img className={cn("col-9", "img-preview")}
                                                    src={item.path} alt="" />
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
                                            </div>
                                        )
                                    )
                                }
                                {/* <button className={cn("load-more-btn", "btn-5")}>
                                    <AddIcon />
                                    <span>
                                        Hiển thị thêm
                                    </span>
                                </button> */}
                            </div>
                        </div>
                    </div>
                    {/* End image part */}
                    {/* Product info */}
                    <div className={cn("col-9", "product-info")}>
                        <div className={cn("inner-content")}>
                            <h3 className={cn("title")}>Thông tin</h3>
                            <div className={cn("main-content")}>
                                <form action="" className={cn("form-create-product")}>
                                    {/* name */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="productName"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tiêu đề</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
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
                                        <div className={cn("col-9")}>
                                            <select name="categoryId" id="categoryId"
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
                                    </div>
                                    {/* Supplier */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="supplierId"
                                            className={cn("col-3", "col-form-label", "input-title")}>Nhà cung cấp</label>
                                        <div className={cn("col-9")}>
                                            <select name="supplierId" id="supplierId"
                                                onChange={onProductInputChange}
                                                className={cn("form-select", "form-select-item", "supplierId")}>
                                                <option value="">-- Chọn nhà cung cấp --</option>
                                                {
                                                    suppliers?.map(
                                                        (item, index) => (
                                                            item.id == productInput.supplierId ?
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
                                            {productError.supplierId && (<span className={cn("text-danger")}>
                                                {productError.supplierId}</span>)}

                                        </div>
                                    </div>
                                    {/* Origin */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="origin"
                                            className={cn("col-3", "col-form-label", "input-title")}>Xuất xứ</label>
                                        <div className={cn("col-9")}>
                                            <select
                                                onChange={onProductInputChange}
                                                name="origin" id="origin"
                                                className={cn("form-select", "form-select-item", "origin")}
                                                value={productInput.origin}
                                            >
                                                <option value="">-- Chọn quốc gia --</option>
                                                <option value="VIET_NAM">Việt Nam</option>
                                            </select>
                                            {productError.origin && (<span className={cn("text-danger")}>
                                                {productError.origin}</span>)}
                                        </div>
                                    </div>
                                    {/* create date */}
                                    {/* <div className={cn("mb-4 row")}>
                                        <label for="createDate"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="createDate"
                                                id="createDate"
                                                className={cn("form-control", "input-item")}
                                               
                                            />
                                        </div>
                                    </div> */}
                                    {/* production date */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="productionDate"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày sản xuất</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="productionDate"
                                                className={cn("form-control", "input-item", "productionDate")}
                                                name="productionDate"
                                                onChange={onProductInputChange}
                                                value={productInput.productionDate}
                                            />
                                            {productError.productionDate && (<span className={cn("text-danger")}>
                                                {productError.productionDate}</span>)}
                                        </div>
                                    </div>
                                    {/* expiry */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="expiry"
                                            className={cn("col-3", "col-form-label", "input-title")}>Hạn sử dụng</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="expiry"
                                                className={cn("form-control", "input-item", "expiry")}
                                                name="expiry"
                                                onChange={onProductInputChange}
                                                value={productInput.expiry}
                                            />
                                            {productError.expiry && (<span className={cn("text-danger")}>
                                                {productError.expiry}</span>)}
                                        </div>
                                    </div>
                                    {/* Thumbnail */}
                                    <div className={cn("mb-4 row")}>
                                        <label
                                            className={cn("col-3", "col-form-label", "input-title")}>Thumbnail</label>
                                        <div className={cn("col-9")}>
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
                                            <button type="button"
                                                data-bs-toggle="modal" data-bs-target="#attribute-modal"
                                                className={cn("btn-6", "btn-open-attribute-dialog")}>
                                                <AddIcon />
                                                <span>
                                                    Thêm
                                                </span>
                                            </button>
                                            {attributeMainError && (<span className={cn("text-danger")}>
                                                {attributeMainError}</span>)}
                                        </div>

                                        <div className={cn("attribute-list", "mt-3")}>

                                            <table className={cn("table", "table-hover")}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Tên</th>
                                                        <th scope="col">Giá trị</th>
                                                        <th scope="col">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        attributes?.map(
                                                            (item, index) => (
                                                                <tr>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.value}</td>
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
                                                                </tr>

                                                            )
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                            {/* <button type="button" className={cn("load-more-btn", "btn-5")}>
                                                <AddIcon />
                                                <span>
                                                    Hiển thị thêm
                                                </span>
                                            </button> */}
                                        </div>
                                    </div>
                                    {/* variant */}
                                    <div className={cn("mt-4", "row", "product-variant")}>
                                        <label for=""
                                            className={cn("col-3", "col-form-label", "input-title", "mb-4")}>Product variant </label>
                                        <div className={cn("col-9")}>
                                            <button
                                                type="button"
                                                className={cn("btn-open-variant-dialog", "btn-6")}
                                                data-bs-toggle="modal" data-bs-target="#product-variant-modal"
                                            >
                                                <AddIcon />
                                                <span>
                                                    Thêm
                                                </span>
                                            </button>
                                            {variantMainError && (<span className={cn("text-danger")}>
                                                {variantMainError}</span>)}
                                        </div>
                                        <div className={cn("product-variant-list")}>
                                            <table className={cn("table table-hover")}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Tên</th>
                                                        <th scope="col">Giá trị</th>
                                                        <th scope="col">Stock</th>
                                                        <th scope="col">Giá</th>
                                                        <th scope="col">Giảm giá</th>
                                                        <th scope="col">Ngày bắt đầu</th>
                                                        <th scope="col">Ngày kết thúc</th>
                                                        <th scope="col">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        variants?.map(
                                                            (item, index) => (
                                                                <tr key={item.id}>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.value}</td>
                                                                    <td>{item.stock}</td>

                                                                    <td>{item.price}</td>
                                                                    <td>{item.discount + ' %'}</td>
                                                                    <td>{item.startDate}</td>
                                                                    <td>{item.endDate}</td>
                                                                    <td>
                                                                        <EditIcon
                                                                            onClick={() => handleEditVariant(item)}
                                                                            data-bs-toggle="modal" data-bs-target="#product-variant-modal"
                                                                            className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                                        <DeleteIcon
                                                                            onClick={(() => {
                                                                                setVariants(
                                                                                    variants?.filter(a => a.id !== item.id)
                                                                                )
                                                                                handleDeleteVariant(item)
                                                                            })}
                                                                            className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                            {/* <button className={cn("load-more-btn", "btn-5")}>
                                                <AddIcon />
                                                <span>
                                                    Hiển thị thêm
                                                </span>
                                            </button> */}
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
                    {/* product variant form */}
                    <div class="modal fade " tabindex="-1" id="product-variant-modal" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div class={cn("modal-content", "modal-inner-content")}>
                                <div class="modal-header">
                                    <h3 className={cn("modal-title")}>Product variant</h3>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class={cn("modal-body", "product-variant-form")}>
                                    {/* Name */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="nameVariant"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tên</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="nameVariant"
                                                className={cn("form-control", "input-item")}
                                                name="name"
                                                onChange={onVariantInputChange}
                                                value={variantInput.name}
                                            />
                                            {variantError.name && (<span className={cn("text-danger")}>{variantError.name}</span>)}

                                        </div>
                                    </div>
                                    {/* value */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="variantValue"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giá trị</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="variantValue"
                                                className={cn("form-control", "input-item")}
                                                name="value"
                                                onChange={onVariantInputChange}
                                                value={variantInput.value}
                                            />
                                            {variantError.value && (<span className={cn("text-danger")}>{variantError.value}</span>)}

                                        </div>
                                    </div>
                                    {/* stock */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="stock"
                                            className={cn("col-3", "col-form-label", "input-title")}>Stock</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="stock"
                                                className={cn("form-control", "input-item", "w-10")}
                                                name="stock"
                                                onChange={onVariantInputChange}
                                                value={variantInput.stock}
                                            />
                                            {variantError.stock && (<span className={cn("text-danger")}>{variantError.stock}</span>)}

                                        </div>
                                    </div>

                                    {/* price */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="variantPrice"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giá</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="variantPrice"
                                                className={cn("form-control", "input-item")}
                                                name="price"
                                                onChange={onVariantInputChange}
                                                value={variantInput.price}
                                            />
                                        </div>
                                    </div>
                                    {/* Discount price */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="discountPrice"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giảm giá</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="discountPrice"
                                                className={cn("form-control", "input-item")}
                                                name="discount"
                                                onChange={onVariantInputChange}
                                                value={variantInput.discount}
                                            />
                                            <select
                                                onChange={onVariantInputChange}
                                                name="discountUnit" id="supplier" className={cn("mt-2", "form-select", "form-select-item")}>

                                                <option defaultChecked value="%">%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="startDate"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày bắt đầu</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="startDate"
                                                className={cn("form-control", "input-item")}
                                                name="startDate"
                                                onChange={onVariantInputChange}
                                                value={variantInput.startDate}
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="endDate"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày kết thúc</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="endDate"
                                                className={cn("form-control", "input-item")}
                                                name="endDate"
                                                onChange={onVariantInputChange}
                                                value={variantInput.endDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class={cn("btn-8")} data-bs-dismiss="modal">Hủy</button>
                                    <button
                                        onClick={handleSubmitVariant}
                                        data-bs-dismiss="modal"
                                        type="button" class={cn("btn-7")}>Thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* End product variant form */}
                </div >
            </div >
            {/* End variant and attribute form */}
        </>
    )
}