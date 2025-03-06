import classNames from "classnames/bind";
import style from "./CreateProduct.module.css";
import imgProduct from "./../../../assets/images/image.png";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
const cn = classNames.bind(style);

export default function CreateProduct() {
    const navigate = useNavigate();
    return (
        <>
     
            <div className={cn("container", "mt-5")}>
                <div className="row mb-4">
                    <div onClick={() => navigate(-1)} className={cn("back-previous-page", "col")}>
                        <ArrowBackIosIcon />
                        <span>Quay lại</span>
                    </div>
                    <div className={cn("btn-create-product", 'col')}>
                        <button className={cn("btn-4")}>Tạo sản phẩm</button>
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
                                        <label for="upload-img">
                                            <AddIcon />
                                            <span>
                                                Thêm ảnh
                                            </span>
                                        </label>
                                    </button>
                                    <input hidden name="upload-img" type="file" id="upload-img" />
                                </div>
                            </div>
                            <div className={cn("img-list")}>
                                <div className={cn("img-item", "row")}>
                                    <img className={cn("col-9")} src={imgProduct} alt="" />
                                    <button className={cn("delete-btn", "col-3")}>
                                        <DeleteIcon />
                                        <span>Xóa</span>
                                    </button>
                                </div>
                                <button className={cn("load-more-btn", "btn-5")}>
                                    <AddIcon />
                                    <span>
                                        Hiển thị thêm
                                    </span>
                                </button>
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
                                        <label for="product-name"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tiêu đề</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="product-name"
                                                className={cn("form-control", "input-item")}

                                            />
                                        </div>
                                    </div>
                                    {/* Category */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="category"
                                            className={cn("col-3", "col-form-label", "input-title")}>Danh mục</label>
                                        <div className={cn("col-9")}>
                                            <select name="category" id="category"
                                                className={cn("form-select", "form-select-item")}>
                                                <option value="1">Phân bón</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Supplier */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="supplier"
                                            className={cn("col-3", "col-form-label", "input-title")}>Nhà cung cấp</label>
                                        <div className={cn("col-9")}>
                                            <select name="" id="supplier" className={cn("form-select", "form-select-item")}>
                                                <option value="">Công ty TNHH PA</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Origin */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="supplier"
                                            className={cn("col-3", "col-form-label", "input-title")}>Xuất xứ</label>
                                        <div className={cn("col-9")}>
                                            <select name="" id="supplier" className={cn("form-select", "form-select-item")}>
                                                <option value="">Việt Nam</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* create date */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="createDate"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="createDate"
                                                id="createDate"
                                                className={cn("form-control", "input-item")}
                                            />
                                        </div>
                                    </div>
                                    {/* production date */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="producttion-date"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày sản xuất</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="producttion-date"
                                                id="producttion-date"
                                                className={cn("form-control", "input-item")}
                                            />
                                        </div>
                                    </div>
                                    {/* expiry */}
                                    <div className={cn("mb-4 row")}>
                                        <label for="expiry"
                                            className={cn("col-3", "col-form-label", "input-title")}>Hạn sử dụng</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="expiry"
                                                id="expiry"
                                                className={cn("form-control", "input-item")}
                                            />
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
                                                <label for="thumbnail">
                                                    <AddIcon />
                                                    <span>
                                                        Thêm ảnh
                                                    </span>
                                                </label>
                                            </button>
                                            <input hidden name="thumbnail" type="file" id="thumbnail" />
                                            <div className={cn("thumbnail-review")}>
                                                <img src={imgProduct} alt="" />
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
                                                className={cn("form-control", "input-item")}
                                                required
                                                rows={5}
                                            />
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
                                                    <tr>
                                                        <td>Công dụng</td>
                                                        <td>Chống sâu</td>
                                                        <td>
                                                            <EditIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                            <DeleteIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Công dụng</td>
                                                        <td>Chặn đọt</td>
                                                        <td>
                                                            <EditIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                            <DeleteIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            <button type="button" className={cn("load-more-btn", "btn-5")}>
                                                <AddIcon />
                                                <span>
                                                    Hiển thị thêm
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={cn("mt-4", "row", "product-variant")}>
                                        <label for=""
                                            className={cn("col-3", "col-form-label", "input-title", "mb-4")}>Product variant </label>
                                        <div className={cn("col-9")}>
                                            <button className={cn("btn-open-variant-dialog", "btn-6")}
                                                data-bs-toggle="modal" data-bs-target="#product-variant-modal"
                                            >
                                                <AddIcon />
                                                <span>
                                                    Thêm
                                                </span>
                                            </button>
                                        </div>
                                        <div className={cn("product-variant-list")}>
                                            <table className={cn("table table-hover")}>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Tên</th>
                                                        <th scope="col">Giá trị</th>
                                                        <th scope="col">Stock</th>
                                                        <th scope="col">Thumbnail</th>
                                                        <th scope="col">Giá</th>
                                                        <th scope="col">Giảm giá</th>
                                                        <th scope="col">Ngày bắt đầu</th>
                                                        <th scope="col">Ngày kết thúc</th>
                                                        <th scope="col">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Thể tích</td>
                                                        <td>100ml</td>
                                                        <td>100</td>
                                                        <td>
                                                            <img className={cn("thumbnail-img")} src={imgProduct} alt="" /></td>
                                                        <td>10000</td>
                                                        <td>10%</td>
                                                        <td>03-03-2025</td>
                                                        <td>03-03-2026</td>
                                                        <td>
                                                            <EditIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                            <DeleteIcon className={cn("table-icon")} sx={{ fontSize: 20 }} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button className={cn("load-more-btn", "btn-5")}>
                                                <AddIcon />
                                                <span>
                                                    Hiển thị thêm
                                                </span>
                                            </button>
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
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                            />
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class={cn("btn-8")} data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" class={cn("btn-7")}>Thêm</button>
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
                                    <div className={cn("mb-4 row")}>
                                        <label for="nameAttribute"
                                            className={cn("col-3", "col-form-label", "input-title")}>Tên</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="text"
                                                id="nameAttribute"
                                                className={cn("form-control", "input-item")}
                                            />
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
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="attributeValue"
                                            className={cn("col-3", "col-form-label", "input-title")}>Stock</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="attributeValue"
                                                className={cn("form-control", "input-item", "w-10")}
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label
                                            className={cn("col-3", "col-form-label", "input-title")}>Thumbnail</label>
                                        <div className={cn("col-9")}>
                                            <button className={cn("add-img-btn", "btn-3", "thumbnail")}>
                                                <label for="thumbnail">
                                                    <AddIcon />
                                                    <span>
                                                        Thêm ảnh
                                                    </span>
                                                </label>
                                            </button>
                                            <input hidden name="upload-img" type="file" id="thumbnail" />
                                            <div className={cn("thumbnail-review")}>
                                                <img src={imgProduct} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="attributeValue"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giá</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="attributeValue"
                                                className={cn("form-control", "input-item")}
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="attributeValue"
                                            className={cn("col-3", "col-form-label", "input-title")}>Giảm giá</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="number"
                                                id="attributeValue"
                                                className={cn("form-control", "input-item")}
                                            />
                                            <select name="" id="supplier" className={cn("mt-2", "form-select", "form-select-item")}>
                                                <option value="">%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="date"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày bắt đầu</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="date"
                                                className={cn("form-control", "input-item")}
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("mb-4 row")}>
                                        <label for="date"
                                            className={cn("col-3", "col-form-label", "input-title")}>Ngày kết thúc</label>
                                        <div className={cn("col-9")}>
                                            <input
                                                type="date"
                                                id="date"
                                                className={cn("form-control", "input-item")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class={cn("btn-8")} data-bs-dismiss="modal">Hủy</button>
                                    <button type="button" class={cn("btn-7")}>Thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* End product variant form */}
                </div>
            </div>
            {/* End variant and attribute form */}
        </>
    )
}