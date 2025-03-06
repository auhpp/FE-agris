
// When click button, it'll add value1 for property 
//when click button for second time, it'll add value2 for property
//If value 2 is undefined that use to click button for once to add value1 for property
function clickAddStyleProperty(elementDisplay, btn, property, value1, value2) {
    var elementFound = document.querySelector(elementDisplay)
    var btnClick = document.querySelector(btn)
    if (value2 == undefined) {
        btnClick.addEventListener("click", function () {
            console.log("side bar: " + elementFound)
            elementFound.style[property] = value1
        })
    } else {
        var state = false
        btnClick.addEventListener("click", function () {
            state = !state
            if (state == false) {
                elementFound.style[property] = value1
            } else {
                elementFound.style[property] = value2
            }
        })
    }
}
// Header

// Display and hide list category on header
clickAddStyleProperty(".header .header-bottom .category-list", ".header .header-bottom .btn-categories", "display", "none", "inline-block")
// // Display and hide choice of account button on header
// clickAddStyleProperty(".header .header-top .content-right .info-account", ".header .header-top .account", "display", "none", "inline-block")
// // Open side bar
// clickAddStyleProperty(".header .header-bottom .nav-list .side-bar", ".header .header-top .bars", "display", "inline-block")
// // Hide side bar
// clickAddStyleProperty(".header .header-bottom .nav-list .side-bar", ".header .side-bar .hide-side-bar", "display", "none")
// // click element change color of that element
// clickAddStyleProperty(".header .header-top .account", ".header .header-top .account", "color", "var(--grey-text)", "var(--primary-color)")

// End header
