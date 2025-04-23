export async function createStaff(request) {
    var promise = fetch('http://localhost:8080/staff/account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(request)
    }).then(data => data.json());
    return promise;
}

export async function searchStaff(request, page, size) {
    var promise = fetch('http://localhost:8080/staff/search?id=' + request.id + '&fullName=' + request.fullName +
        "&phoneNumber=" + request.phoneNumber + "&email=" + request.email + "&status=" + request.status +
        "&page=" + page + "&size=" + size, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(data => data.json());
    return promise;
}

export async function getStaffInfo() {
    var promise = fetch("http://localhost:8080/staff/myInfo", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}

export async function updateStaff(userRequest) {
    var promise = fetch("http://localhost:8080/staff/" + userRequest.id, {
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

export async function uploadStaffAvatar(avatarRequest, staffId) {
    const formData = new FormData();
    formData.append("avatar", avatarRequest);
    formData.append("staffId", staffId);
    var promise = fetch('http://localhost:8080/staff/avatar', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    }).then(data => data.json());
    return promise;
}

export async function recallStaff(staffId) {
    var promise = fetch("http://localhost:8080/staff/recall?staffId=" + staffId, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
    return promise;
}