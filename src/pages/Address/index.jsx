import style from "./Address.module.css";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
const cn = classNames.bind(style);

export default function Address() {
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
                    <div className={cn("address-list")}>
                        <div className={cn("address-item")}>
                            <div className={cn("content")}>
                                <div className={cn("name-and-phone-number")}>
                                    <span className={cn("name")}>Phi Âu</span>
                                    <span className={cn("phone-number")}>03844749</span>
                                </div>
                                <div className={cn("address-content")}>Thị Trấn Long Bình, Huyện An Phú, An Giang</div>
                                <button className={cn("btn-default")}>Mặc định</button>
                            </div>
                            <div className={cn("action")}>
                                <div className={cn("delete-and-edit")}>
                                    <div className={cn("edit-action")}>Cập nhật</div>
                                    <div className={cn("delete-action")}>Xóa</div>
                                </div>
                                <button className={cn("btn-set-default-address")}>Thiết lập mặc định</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal add address */}
                <div class="modal fade " tabindex="-1" id="address-modal" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class={cn("modal-content", "modal-inner-content")}>
                            <div class="modal-header">
                                <h3 className={cn("modal-title")}>Địa chỉ mới</h3>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class={cn("modal-body", "address-form")}>
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
                                        className={cn("col-3", "col-form-label", "input-title")}>Số điện thoại</label>
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
                                        className={cn("col-3", "col-form-label", "input-title")}>Địa chỉ</label>
                                    <div className={cn("col-9")}>
                                        <textarea className={cn("form-control", "input-item")} id="exampleFormControlTextarea1" rows="3"></textarea>
                                    </div>
                                </div>
                                <div className={cn("mb-4 row")}>
                                    <label for="attributeValue"
                                        className={cn("col-3", "col-form-label", "input-title")}></label>
                                    <div className={cn("col-9")}>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label class="form-check-label" for="flexCheckDefault">
                                                Đặt làm mặc định
                                            </label>
                                        </div>
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
            </div>
        </>
    );
}