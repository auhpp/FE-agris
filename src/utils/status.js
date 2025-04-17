export const OrderStatus = {
    WAIT_FOR_CONFIRMATION: {
        name: "Chờ xác nhận",
        color: "primary"
    },
    WAITING_FOR_SHIPPING: {
        name: "Chờ giao hàng",
        color: "info"
    },
    CANCELED: {
        name: "Đã hủy",
        color: "error"
    }
}

export const PaymentStatus = {
    NO_PAYMENT: "Chưa thanh toán"
}

export const SupplierStatus = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Ngừng hoạt động"
}

export const ProductStatus = {
    ACTIVE: "Hiển thị",
    INACTIVE: "Đã ẩn"
}

export const StaffStatus = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Ngừng hoạt động"
}

export const ShipmentStatus = {
    ACTIVE: {
        name: "Còn hạn sử dụng",
        color: "primary"
    },
    INACTIVE: {
        name: "Hết hạn sử dụng",
        color: "error"
    }
}