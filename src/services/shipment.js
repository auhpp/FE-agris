export async function getAllShipment(productVariantId) {
    var promise = fetch("http://localhost:8080/shipment/" + productVariantId, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}

export async function searchShipment(name, status, warehouseId, productVariantId, page, size) {
    var promise = fetch("http://localhost:8080/shipment/search?name=" + name +
            "&status=" + status +
            "&warehouseId=" + warehouseId +
            "&productVariantId=" + productVariantId +
            "&page=" + page +
            "&size=" + size, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => res.json())
    console.log("product id", promise)

    return promise;
}