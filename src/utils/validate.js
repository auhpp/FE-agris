//validate email
export const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// Validate phone number
export const isPhoneNumber = (phoneNumber) =>
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(phoneNumber);

// Validate name
export const isFullNameValid = (fullName) =>
    /^[a-zA-Z0-9À-ỹ ]+$/.test(fullName)

// Validate image
export const isValidImage = (img) => {
    var allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    var extension = img?.name.split('.').pop().toLowerCase();
    if (allowedExtensions.indexOf(extension) !== -1 && img.size <= 1048576) {
        return true;
    }
    return false;
}

// Check strength password
export function checkPasswordStrength(password) {
    // Initialize variables
    var strength = 0;
    var tips = "";

    // Check password length
    if (password.length < 8) {
        tips += "Phải từ 8 ký tự. ";
    } else {
        strength += 1;
    }

    // Check for mixed case
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
    } else {
        tips += "Phải có cả ký tự hoa và ký tự thường. ";
    }

    // Check for numbers
    if (password.match(/\d/)) {
        strength += 1;
    } else {
        tips += "Phải có ít nhất một chữ số. ";
    }

    // Check for special characters
    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
    } else {
        tips += "Phải có ít nhất một ký tự đặc biệt. ";
    }

    // Return results
    return [strength, tips];
}

