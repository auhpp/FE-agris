import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import style from "./AddDynamicInputFields.module.css";
import classNames from "classnames/bind";
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';

const cn = classNames.bind(style);

function checkName(array, name) {
    var valid = false
    array.forEach(element => {
        if (element.name == name) {
            valid = true;
        }
    });
    return valid;
}

// function checkValue(array, value) {
//     var valid = false
//     array.forEach(element => {
//         element.values.forEach(
//             it => {
//                 if (it == value) {
//                     valid = true;
//                 }
//             }
//         )
//     });
//     return valid;
// }
export default function AddDynamicInputFields({ inputs, object,
    keyName, setInputs, isAdd, values = [], onChange, handleAddInput, array,
    index, onDelete, length, value, error, setError, errorMessage, onClick, isEdit,
    type, disable, isView
}) {
    const [inputAdd, setInputAdd] = useState("");
    const [showInputAdd, setShowInputAdd] = useState(false);
    values = values.filter(
        a => a.name != "DEFAULT"
    )
    values = values.filter(
        a => a.value != "DEFAULT"
    )
    return (
        <div className="container">
            <div className={cn("input-container")}>
                <div className={cn("input-select")}>
                    {
                        type == "name" && disable != true && (
                            <Button
                                onClick={() => {
                                    if (keyName != "")
                                        setShowInputAdd(true)
                                }
                                }
                                size="sm" variant="outline-secondary">
                                <AddIcon />
                            </Button>
                        )
                    }
                    {
                        type == "value" && (
                            <>
                                <Form.Control className="mt-1" type="text" name="" id=""
                                    onChange={onChange}
                                    value={value}
                                    disabled={disable}
                                />
                                {
                                    index > 0 && !isView && (
                                        <CloseIcon onClick={onDelete} />
                                    )
                                }
                            </>
                        )

                    }
                    {
                        type == "name" && (
                            <>
                                <select
                                    onChange={onChange}
                                    onClick={onClick}
                                    disabled={disable}
                                    className={cn("form-select", "select-menu")} aria-label="Default select example">
                                    <option selected>--Chọn--</option>
                                    {
                                        inputAdd != "" && (
                                            <option>{inputAdd}</option>
                                        )
                                    }
                                    {
                                        values?.map(
                                            (item, index) => (
                                                value == item.name ? (
                                                    <option selected={true} value={item.name} >
                                                        {item.name}
                                                    </option>
                                                ) :
                                                    (<option value={item.name} >
                                                        {item.name}
                                                    </option>)
                                            )
                                        )
                                    }
                                </select>

                            </>
                        )
                    }
                </div>
                {
                    value == "" &&
                    error?.name && (<span className={cn("text-danger")}>{error?.name}</span>)}
                {
                    showInputAdd && (
                        <Form.Control className="mt-1" type="text" name="" id=""
                            onChange={(e) => setInputAdd(e.target.value)}
                        />
                    )
                }
                {index === length - 1 && isAdd && disable != true && (
                    <button
                        type="button"
                        className={cn("btn-add-more", "btn-5", "w-100")} onClick={() => {
                            if (value != "") {
                                setInputs(prev =>
                                    prev.map(item =>
                                        item.name === keyName
                                            ? { ...item, values: [...item.values, ""] }
                                            : item
                                    )
                                );
                            }
                            else {
                                setError({
                                    name: errorMessage
                                })
                            }
                        }}
                    >
                        <AddIcon />
                        <span>
                            Thêm giá trị
                        </span>
                    </button>
                )}
            </div>


        </div >
    );
}
