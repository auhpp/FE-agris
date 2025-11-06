import style from "./CreateCalculationUnitModal.module.css"
import classNames from "classnames/bind";
import { createCalculationUnit } from "../../services/calculationUnitService";
import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "@mui/material";

const cn = classNames.bind(style)
export default function CreateCalculationUnitModal({
    show, setShow, calculationUnit, setCalculationUnit, isUpdate, setIsUpdate
}) {
    const [error, setError] = useState("");
    const handleClose = () => {
        setCalculationUnit({
            id: null,
            name: "",
            description: ""
        })
        setError("")
        setShow(false)
    }

    const handleSubmitCalculationUnit = () => {
        if (calculationUnit.name == "") {
            setError("Phải nhập tên đơn vị tính")
        }
        else {
            createCalculationUnit(calculationUnit).then(
                data => {
                    if (data.code == 200) {
                        setShow(false)
                        setIsUpdate(!isUpdate)
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
                <Modal.Header>
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
                                value={calculationUnit.name}
                                onChange={
                                    (e) => {
                                        setCalculationUnit(
                                            prev => ({
                                                ...prev,
                                                name: e.target.value
                                            })
                                        )
                                    }
                                }
                            />
                            {error && (<span className={cn("text-danger")}>{error}</span>)}

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
                                value={calculationUnit.description}
                                onChange={
                                    (e) => {
                                        setCalculationUnit(
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
                    <Button size="lg" variant="" onClick={() => {
                        handleClose()
                    }}>Hủy</Button>
                    <Button
                        size="lg"
                        variant="contained"
                        color="error"
                        onClick={(e) => {
                            handleSubmitCalculationUnit(e)
                        }
                        }>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}