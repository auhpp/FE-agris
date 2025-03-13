export async function getAllSupplier() {
    var promise = fetch('http://localhost:8080/supplier', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        }
    }).then(data => data.json());
    return promise;
}