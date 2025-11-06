export async function getStock(productVariantId) {
    var promise = fetch('http://localhost:8080/stock/' + productVariantId, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(data => data.json());
    return promise;
}