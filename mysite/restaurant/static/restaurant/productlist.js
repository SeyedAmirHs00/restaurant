const popup = document.getElementsByClassName("popup")[0];
const closePopup = document.getElementsByClassName("close-popup")[0];

closePopup.addEventListener("click", function () {
  popup.classList.toggle("hidden");
});

const typeFormElement = document.getElementById("id_type");
const nameFormElement = document.getElementById("id_name");
const priceFormElement = document.getElementById("id_price");
const idFormElement = document.getElementById("id_id");

function showPopup(idValue, typeValue, nameValue, priceValue) {
  idFormElement.value = idValue;
  typeFormElement.value = typeValue;
  nameFormElement.value = nameValue;
  priceFormElement.value = priceValue;
  popup.classList.toggle("hidden");
}

function showEditPopup(name) {
  const [typeValue, idValue] = name.split("-");
  const element = document.getElementById(name);
  let nameValue = element.getElementsByTagName("h1")[0].innerHTML;
  let priceValue = element.getElementsByClassName("price")[0].innerHTML;
  priceValue = Number.parseInt(priceValue);
  showPopup(idValue, typeValue, nameValue, priceValue);
}

function showNewPopup() {
  showPopup("", "", "", "")
}
