export async function addToCart(request) {
    var promise = fetch('http://localhost:8080/cart', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}

export async function getAllCart(page = 1, size = 10) {
    var promise = fetch('http://localhost:8080/cart?page=' + page + "&size=" + size, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(data => data.json());
    return promise;
}

export async function deleteCart(id) {
    var promise = fetch('http://localhost:8080/cart/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then();
    return promise;
}

export async function findCartById(id) {
    var promise = fetch('http://localhost:8080/cart/' + id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(data => data.json());
    return promise;
}