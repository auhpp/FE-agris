export async function createPaymentSlip(request) {
    var promise = fetch("http://localhost:8080/payment_slip", {
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

export async function searchPaymentSlip(id = "",
    payeeTypeId = "",
    paymentReasonId = "",
    page = 1,
    size = 10, payeeId) {
    var promise = fetch("http://localhost:8080/payment_slip/search?id=" + id + "&payeeTypeId=" + payeeTypeId +
            "&paymentReasonId=" + paymentReasonId +
            "&page=" + page +
            "&size=" + size + "&payeeId=" + payeeId, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => res.json())

    return promise;
}

export async function getAllPayeeType() {
    var promise = fetch("http://localhost:8080/payment_slip/payee_type", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())

    return promise;
}