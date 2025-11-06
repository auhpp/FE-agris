import classNames from "classnames/bind";
import style from "./Search.module.css";
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, useTheme } from "@mui/material";
import { useState } from "react";

const cn = classNames.bind(style);
//for select input
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const categories = [
    'Phân bón',
    'Thuốc trừ sâu'
];

function getStyles(category, categoryName, theme) {
    return {
        fontWeight: categoryName.includes(category)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}
// End select input
export default function Search({ nameInputSearch, nameInputSelect, labelNameInputSelect, displaySelect }) {
    // select input
    const theme = useTheme();
    const [categoryName, setCategoryName] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategoryName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    // end select input
    return (
        <>
            <div className="container">
                <form action="#" method="get">
                    <div className={cn("row", "form-search-content")}>
                        <input type="text"
                            className={cn("input-search", "col-6")}
                            placeholder="Nhập từ khóa tìm kiếm tại đây..."
                            name={nameInputSearch}
                        />
                        {
                            displaySelect == true && (
                                <div className={cn("col-4")}>
                                    <FormControl sx={{ m: 1, width: 300 }}>
                                        <InputLabel id="multiple-category-label"
                                            sx={{ fontSize: 12 }}
                                        >{labelNameInputSelect}</InputLabel>
                                        <Select
                                            labelId="multiple-category-label"
                                            id="multiple-category"
                                            multiple
                                            value={categoryName}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="category" />}
                                            MenuProps={MenuProps}
                                            name={nameInputSelect}
                                            className={cn("category-list")}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem
                                                    sx={{ fontSize: 12 }}
                                                    key={category}
                                                    value={category}
                                                    style={getStyles(category, categoryName, theme)}
                                                    className={cn("category-item")}
                                                >
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )
                        }
                        {
                            displaySelect == false && (<div className={cn("col-1")}></div>)
                        }
                        <button className={cn("btn-3", "btn-search", "col-2")} type="submit">
                            <span>Tìm kiếm</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}