export async function createPaymentReason(request) {
    var promise = fetch("http://localhost:8080/payment_reason", {
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

export async function getAllPaymentReason() {
    var promise = fetch("http://localhost:8080/payment_reason", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())

    return promise;
}