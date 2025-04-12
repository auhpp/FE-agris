export function inputFocus(idName) {
    console.log(idName)
    const input = document.getElementById(idName);
    console.log(input)
    const length = input.value.length
    input.focus();
    if (input.tagName.toLowerCase() === 'input' && input.getAttribute("type") != "date") {
        input.setSelectionRange(length, length)
    }
}

export function showPassword(isShowPassword) {
    return isShowPassword == "password" ? "text" : "password";

}