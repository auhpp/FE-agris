export async function forgetPassword(request) {
    var promise = fetch('http://localhost:8080/account/password/forget', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}


export async function changePassword(request) {
    var promise = fetch('http://localhost:8080/account/password/change', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`

        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}

export async function validatePassword(request) {
    var promise = fetch('http://localhost:8080/account/password/validate', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`

        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}

export async function getAccount() {
    var promise = fetch('http://localhost:8080/account', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`

        }
    }).then(data => data.json());
    return promise;
}