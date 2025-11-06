import style from "./SearchAccount.module.css";
import Search from "../../../layouts/components/admin/Search";
import { useNavigate } from 'react-router-dom'
import { routes } from "../../../config/routes";
import classNames from "classnames/bind";
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const cn = classNames.bind(style);
// table
function createData(id, name, expiry, createdData, origin, category, supplier) {
    return {
        id,
        name,
        expiry,
        createdData,
        origin,
        category,
        supplier
    };
}

const rows = [
    createData(1, 'Thuốc trừ sâu Agris', "20-02-2026", "20-02-2024", "Việt Nam", "Thuốc trừ sâu", "Cong ty TNHH Agris"),
    createData(2, 'Thuốc trừ sâu Agris', "20-02-2024", "20-02-2024", "Việt Nam", "Thuốc trừ sâu", "Cong ty TNHH Agris")
];



const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên',
    },
    {
        id: 'expiry',
        numeric: true,
        disablePadding: false,
        label: 'Hạn sử dụng',
    },
    {
        id: 'createdDate',
        numeric: true,
        disablePadding: false,
        label: 'Ngày tạo',
    },
    {
        id: 'origin',
        numeric: true,
        disablePadding: false,
        label: 'Xuất xứ',
    },
    {
        id: 'category',
        numeric: true,
        disablePadding: false,
        label: 'Danh mục',
    },
    {
        id: 'supplier',
        numeric: true,
        disablePadding: false,
        label: 'Nhà cung cấp',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Thao tác',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } =
        props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        <TableHead
                            sx={{ fontSize: 14 }}
                        >
                            {headCell.label}
                        </TableHead>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%', fontSize: 12 }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%', fontSize: 16 }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Danh sách sản phẩm
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Tooltip>
            ) : (<></>)}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

// end table


export default function SearchAccount() {
    const navigate = useNavigate();
    // table
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [showWarning, setShowWarning] = React.useState(false);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage],
    );
    // end table
    return (
        <>
            <Search nameInputSearch={"name"} nameInputSelect={"role"} labelNameInputSelect={"Role"}
                displaySelect={true}
            />
            <button onClick={() => navigate(routes.register, { state: { goBack: true } })} className={cn("btn-8", "mb-2", "col-2", "offset-10")}>
                <AddIcon />
                <span>
                    Thêm tài khoản
                </span>
            </button>
            <div className={cn("result-table")}>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {visibleRows.map((row, index) => {
                                        const isItemSelected = selected.includes(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    className={cn("table-data-item")}
                                                    sx={{ fontSize: 14 }}
                                                >
                                                    {row.name}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: 14 }} align="left">{row.expiry}</TableCell>
                                                <TableCell sx={{ fontSize: 14 }} align="left">{row.createdData}</TableCell>
                                                <TableCell sx={{ fontSize: 14 }} align="left">{row.origin}</TableCell>
                                                <TableCell sx={{ fontSize: 14 }} align="left">{row.category}</TableCell>
                                                <TableCell sx={{ fontSize: 14 }} align="left">{row.supplier}</TableCell>
                                                <TableCell>
                                                    <EditIcon
                                                        className={cn("edit-icon")}
                                                        sx={{ fontSize: 22, marginInline: 1 }}
                                                        titleAccess="Chỉnh sửa"
                                                    />

                                                    <MenuIcon
                                                        className={cn("menu-icon")}

                                                        sx={{ fontSize: 22, marginInline: 1 }}
                                                    />
                                                    <DeleteIcon
                                                        className={cn("delete-icon")}
                                                        sx={{ fontSize: 22 }}
                                                        data-bs-toggle="modal" data-bs-target="#warning-modal"
                                                    />

                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (dense ? 33 : 53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ fontSize: 12 }}
                            labelRowsPerPage={"Số dòng mỗi trang:"}
                            className={cn("pagination")}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    />
                </Box>
            </div>
            <div class="modal fade " tabindex="-1" id="warning-modal" aria-hidden="true">
                <div class="modal-dialog">
                    <div class={cn("modal-content", "modal-inner-content")}>
                        <div class="modal-header">
                            <h3 className={cn("modal-title", "text-danger")}>Cảnh báo!</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class={cn("modal-body", "attribute-form")}>
                            <p>Bạn có chắc chắn xóa ?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class={cn("btn-8", "pt-0", "pb-0")} data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class={cn("btn-da", "btn-danger", "btn", "btn-lg")}>Đồng ý</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}