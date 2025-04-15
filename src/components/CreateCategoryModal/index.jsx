import classNames from "classnames/bind";
import style from "./CreateCategoryModal.module.css";
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from "@mui/material";
import { createCategory } from "../../services/categoryService";
import ModalWarningDelete from "../ModalWarningDelete";

const cn = classNames.bind(style);

export default function CreateCategoryModal({
    show, setShow, category, setCategory, isEdit
}) {
    const [error, setError] = useState("");
    const handleClose = () => {
        setCategory({
            id: null,
            name: ""
        })
        setError("")
        setShow(false)
    }

    const handleSubmitCategory = () => {
        if (category.name == "") {
            setError("Phải nhập tên danh mục")
        }
        else {
            createCategory(category).then(
                data => {
                    if (data.code == 200) {
                        setShow(false)
                        window.location.reload()
                    }
                    else {
                        setError("Tên này đã được sử dụng")
                    }
                }
            )
        }
    }

    return (
        <>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                className={cn("category-modal")}
            >
                <Modal.Header >
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
                                onChange={(e) => setCategory(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                value={category.name}
                            />
                            {error && (<span className={cn("text-danger")}>{error}</span>)}

                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button size="lg" variant="" onClick={handleClose}>Hủy</Button>
                    <Button
                        size="lg" variant="contained"
                        color="error"
                        onClick={() => {
                            handleSubmitCategory()
                        }
                        }>{
                            category.id ? "Cập nhật" : "Lưu"}</Button>
                </Modal.Footer>
            </Modal>
           
        </>
    );
}