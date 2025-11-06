export async function createOrder(request) {
    var promise = fetch("http://localhost:8080/order", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}


export async function searchOrder(
    customerId = "",
    id = "",
    orderStatus = "",
    paymentStatus = "",
    page = 1,
    size = 10) {
    var promise = fetch("http://localhost:8080/order/search?customerId=" + customerId + "&id=" + id +
            "&orderStatus=" + orderStatus +
            "&paymentStatus=" + paymentStatus +
            "&page=" + page +
            "&size=" + size, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => res.json())
    // console.log()
    return promise;
}

export async function confirmOrder(request) {
    var promise = fetch("http://localhost:8080/order/confirm", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}

export async function cancelOrder(request) {
    var promise = fetch("http://localhost:8080/order/cancel", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}


export async function deleteOrder(vnpTxnRef) {
    var promise = fetch("http://localhost:8080/order/delete/" + vnpTxnRef, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}


export async function updatePaymentStatus(status, vnpTxnRef) {
    var promise = fetch("http://localhost:8080/order/update/payment?status=" + status + "&vnpTxnRef=" + vnpTxnRef, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}