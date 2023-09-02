const popup = document.getElementsByClassName("popup")[0]
const closePopupButton = document.getElementsByClassName("close-popup")[0]
const formCustomerId = document.getElementById("customer-id");
const formFirstName = document.getElementById("first-name")
const formLastName = document.getElementById("last-name");
const formAddress = document.getElementById("address");
const formGender = document.getElementById("gender");

function togglePopup() {
    popup.classList.toggle("hidden");
}

function showCustomerForm(customerId="", firstName="", lastName="", gender="", address=""){
    if (gender == "") {
        gender = "unknown";
    }
    formCustomerId.value = customerId;
    formFirstName.value = firstName;
    formLastName.value = lastName;
    formGender.value = gender;
    formAddress.value = address;
    togglePopup();
} 

function clickOnCustomerTr(trId) {
    let customerId = trId.split('-')[1];
    customerId = Number(customerId);
    const customerTr = document.getElementById(trId);
    let childrenInnerHTML = [];
    for (let child of customerTr.children) {
        childrenInnerHTML.push(child.innerHTML);
    }
    let [counter, firstName, lastName, gender, address] = childrenInnerHTML.map(text => text.trim());
    let genderValue = "unknown";
    if (gender == "آقا") {
        genderValue = "male";
    } else if (gender == "خانم") {
        genderValue = "female";
    }
    showCustomerForm(customerId, firstName, lastName, genderValue, address);
}

function clickOnAddCustomer() {
    showCustomerForm();
}