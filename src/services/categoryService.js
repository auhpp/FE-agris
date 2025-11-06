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

export async function searchCategory(name, page, size) {
    var promise = fetch('http://localhost:8080/category/search?name=' + name +
        "&page=" + page + "&size=" + size, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            }
        }).then(data => data.json());
    return promise;
}

export async function deleteCategory(id) {
    var promise = fetch('http://localhost:8080/category/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());
    return promise;
}