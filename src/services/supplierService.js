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


export async function createSupplier(request) {
    var promise = fetch('http://localhost:8080/supplier', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}


export async function searchSupplier(name, phoneNumber) {
    var promise = fetch('http://localhost:8080/supplier/search?name=' + name + "&phoneNumber=" + phoneNumber, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        }
    }).then(data => data.json());
    return promise;
}