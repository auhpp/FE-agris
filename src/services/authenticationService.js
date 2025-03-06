export async function login(userRequest) {
    var promise = fetch('http://localhost:8080/auth/token', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(userRequest)
    }).then(data =>  data.json());
    return promise;
}