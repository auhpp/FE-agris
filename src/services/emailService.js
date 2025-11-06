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

export async function generateOTPForResetPassword(email) {
    var promise = fetch("http://localhost:8080/email/otp/reset_password/" + email, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
    return promise;
}

export async function validateOTP(request) {
    var promise = fetch("http://localhost:8080/email/otp/validate", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
    return promise;
}