import './index.css'
import 'flowbite'

window.onload = function () {
    initInputForm();
}

function initInputForm() {
    let form = document.getElementById("item-form")

    form.addEventListener("submit", (event) => {
        handleItemForm(event, form)
    })
}

function handleItemForm(event, formRef) {
    if(event.preventDefault) {
        event.preventDefault()
    }

    addInputToContactForm()
    return false

}

function addInputToContactForm() {
    let userName = document.getElementById("user-name")
    let userEmail = document.getElementById("user-email")
    let userMessage = document.getElementById("user-message")
}

