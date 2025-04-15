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


export async function searchOrder(id = "",
    orderStatus = "",
    paymentStatus = "",
    page = 1,
    size = 10) {
    var promise = fetch("http://localhost:8080/order/search?id=" + id +
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