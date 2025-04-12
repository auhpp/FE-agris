export async function createUser(userRequest) {
    var promise = fetch("http://localhost:8080/customer", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userRequest)
        })
        .then(res => res.json())
    return promise;
}


export async function getUserInfo() {
    var promise = fetch("http://localhost:8080/customer/myInfo", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}


export async function updateUser(userRequest) {
    var promise = fetch("http://localhost:8080/customer/" + userRequest.id, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(userRequest)
        })
        .then(res => res.json())
    return promise;
}

export async function uploadAvatar(avatarRequest, userId) {
    const formData = new FormData();
    formData.append("avatar", avatarRequest);
    formData.append("customerId", userId);
    var promise = fetch('http://localhost:8080/customer/avatar', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    }).then(data => data.json());
    return promise;
}


export async function changePassword(request) {
    var promise = fetch("http://localhost:8080/account/password", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}


// Address
export async function createAddress(request) {
    var promise = fetch("http://localhost:8080/customer/address", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}


export async function deleteAddress(id) {
    var promise = fetch("http://localhost:8080/customer/address/" + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    });
    return promise;
}