const popup = document.getElementsByClassName("popup")[0];
const closePopup = document.getElementsByClassName("close-popup")[0];

// When click on "closePopup" close "popup"
closePopup.addEventListener("click", function () {
  popup.classList.toggle("hidden");
});

const typeFormElement = document.getElementById("id_type");
const nameFormElement = document.getElementById("id_name");
const priceFormElement = document.getElementById("id_price");
const idFormElement = document.getElementById("id_id");

function showPopup(name) {
  const element = document.getElementById(name)
  const [typeValue, idValue] = name.split("-");
  nameValue = element.getElementsByTagName("h1")[0].innerHTML;
  priceValue = element.getElementsByClassName("price")[0].innerHTML;
  priceValue = Number.parseInt(priceValue);
  typeFormElement.value = typeValue;
  nameFormElement.value = nameValue;
  priceFormElement.value = priceValue;
  idFormElement.value = idValue;
  popup.classList.toggle("hidden");
}
