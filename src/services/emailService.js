export async function sendConfirmAccountEmail(fullName, email) {
    var promise = fetch("http://localhost:8080/email/" + fullName + "/" + email, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}