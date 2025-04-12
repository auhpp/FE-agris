export async function getAllCategory() {
    var promise = fetch('http://localhost:8080/category', {
        method: 'GET'
    }).then(data => data.json());
    return promise;
}

export async function createCategory(request) {
    var promise = fetch('http://localhost:8080/category', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(data => data.json(request));
    return promise;
}