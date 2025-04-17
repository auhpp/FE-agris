export async function createWarehouseReceipt(request) {
    var promise = fetch("http://localhost:8080/warehouse/receipt", {
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


export async function searchWarehouseReceipt(supplierId = "", page, size) {
    var promise = fetch("http://localhost:8080/warehouse/receipt/search?page=" + page + "&size=" + size +
            "&supplierId=" + supplierId, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => res.json())
    return promise;
}

export async function createWarehouse(request) {
    var promise = fetch("http://localhost:8080/warehouse", {
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


export async function searchWarehouse(name, page, size) {
    var promise = fetch("http://localhost:8080/warehouse/search" +
            "?name=" + name + "&page=" + page + "&size=" + size, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
        .then(res => res.json())
    return promise;
}

export async function deleteWarehouse(id) {
    var promise = fetch("http://localhost:8080/warehouse/" + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}

export async function getAllWarehouse() {
    var promise = fetch("http://localhost:8080/warehouse", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}

export async function importWarehouse(warehouseReceiptId) {
    var promise = fetch("http://localhost:8080/warehouse/receipt/import/" + warehouseReceiptId, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}