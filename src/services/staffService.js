export async function createStaff(request) {
    var promise = fetch('http://localhost:8080/staff/account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}

export async function searchStaff(request, page, size) {
    var promise = fetch('http://localhost:8080/staff/search?fullName=' + request.fullName +
        "&phoneNumber=" + request.phoneNumber + "&email=" + request.email + "&page=" + page + "&size=" + size, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(data => data.json());
    return promise;
}