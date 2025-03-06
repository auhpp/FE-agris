export async function createUser(userRequest) {
    var promise = fetch("http://localhost:8080/user", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userRequest)
        })
        .then(res => res.json())
    return promise;
}