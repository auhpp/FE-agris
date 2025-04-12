export function formatDateTime(dateRequest) {
    var date = new Date(dateRequest);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh"
    }).format(date);
}

export function formatDate(dateRequest) {
    var date = new Date(dateRequest);
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
}