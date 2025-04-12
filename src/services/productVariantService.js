export async function searchProductVariant(name) {
    var url = 'http://localhost:8080/variant?query=' + name;
    var promise = fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(data => data.json());
    return promise;
}