export function inputFocus(className) {
    const input = document.getElementById(className);
    const length = input.value.length
    input.focus();
    input.setSelectionRange(length, length)
}

export function showPassword(isShowPassword) {
    return isShowPassword == "password" ? "text" : "password";
        
}