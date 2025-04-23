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
    NO_PAYMENT: {
        name: "Chưa thanh toán",
        color: "error"
    },
    PAID: {
        name: "Đã thanh toán",
        color: "success"
    }
}

export const SupplierStatus = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Ngừng hoạt động"
}

export const CustomerStatus = {
    ACTIVE: {
        name: "Đang hoạt động",
        color: "info"
    },
    INACTIVE: {
        name: "Ngừng hoạt động",
        color: "error"
    }
}

export const ProductStatus = {
    ACTIVE: "Hiển thị",
    INACTIVE: "Đã ẩn"
}

export const StaffStatus = {
    ACTIVE: {
        name: "Đang hoạt động",
        color: "info"
    },
    INACTIVE: {
        name: "Ngừng hoạt động",
        color: "error"
    },
    WAITING: {
        name: "Chờ xác nhận",
        color: "secondary"
    }
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