export async function createCalculationUnit(request) {
    var promise = fetch('http://localhost:8080/calculation_unit', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}


export async function getCalculationUnit() {
    var promise = fetch('http://localhost:8080/calculation_unit', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(data => data.json());
    return promise;
}