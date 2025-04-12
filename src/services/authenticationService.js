
export async function login(userRequest) {
    var promise = fetch('http://localhost:8080/auth/token', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(userRequest)
    }).then(data => data.json());
    return promise;
}

export async function logout(logoutRequest) {
    var promise = fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(logoutRequest)
    });
    return promise;
}


export async function introspect(request) {
    var res = await fetch('http://localhost:8080/auth/introspect', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    return res.json();
}