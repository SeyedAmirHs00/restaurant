const selectedPersonName = document.getElementById("person-name");
const selectedPersonAddress = document.getElementById("person-address");
const selectedPersonId = document.getElementById("person-id");
const personsPopup = document.getElementById("persons-popup");
const closePersonPopup = document.getElementById("close-person-popup");
const selectPersonButton = document.getElementById("select-person-button");
const productsPopup = document.getElementById("products-popup");
const sumCell = document.getElementById("sum-cell");
let selectedTrProductTable;

function togglePersonsPopup() {
  personsPopup.classList.toggle("hidden");
}

function stopProp(event) {
  event.stopPropagation();
}

function toggleProductsPopup() {
  productsPopup.classList.toggle("hidden");
}
// closePersonPopup.addEventListener("click", function () {
//   personsPopup.classList.toggle("hidden");
// });

function selectPerson(elementId) {
  const element = document.getElementById(elementId);
  const id = elementId.split("-")[1];
  let [firstNameData, lastNameData, sexData, addressData] =
    element.getElementsByTagName("td");
  let firstName = firstNameData.innerHTML,
    lastName = lastNameData.innerHTML;
  let address = addressData.innerHTML;
  selectedPersonId.value = id;
  selectedPersonName.value = `${firstName} ${lastName}`;
  selectedPersonAddress.value = address;
  togglePersonsPopup();
}

const productTableBody = document.getElementById("product-table-body");
function addRow() {
  let len = productTableBody.children.length;
  let htmlString = `<input id="product${len}-id" name="product${len}-id" class="hidden" type="text">
                    <td style="text-align: center;">
                        ${len + 1}
                    </td>
                    <td id="product${len}-name">
                    </td>
                    <td id="product${len}-price">
                    </td>
                    <td>
                        <input id="product${len}-number" name="product${len}-number" onchange="handleNumberInputChange(this.id)" onclick="stopProp(event)" type="number" >
                    </td>
                    <td id="product${len}-sumup">
                    </td>`;
  let node = document.createElement("tr");
  node.id = `product${len}`;
  node.onclick = () => clickOnTrProductTable(node.id);
  node.innerHTML = htmlString;
  productTableBody.appendChild(node);
  updateSum();
}

function deleteRow() {
  productTableBody.removeChild(productTableBody.lastChild);
  updateSum()
}

function clickOnTrProductTable(trId) {
  selectedTrProductTable = document.getElementById(trId);
  toggleProductsPopup();
}

function selectProduct(productElementId) {
  const productElement = document.getElementById(productElementId);
  const [category, id] = productElementId.split("-");
  const name = productElement.getElementsByTagName("h1")[0].innerHTML;
  let price = productElement.getElementsByTagName("p")[0].innerHTML;
  price = price.slice(0, price.length - 1);
  let [idInput, numTd, nameTd, priceTd, numberTd, sumUpTd] =
    selectedTrProductTable.children;
  idInput.value = id;
  nameTd.innerHTML = name;
  priceTd.innerHTML = price;
  numberTd.children[0].value = 0;
  sumUpTd.innerHTML = 0;
  toggleProductsPopup();
  updateSum()
}

function handleNumberInputChange(elemId) {
  let elem = document.getElementById(elemId);

  let trElem = elem.parentNode.parentNode;
  let [idInput, numTd, nameTd, priceTd, numberTd, sumUpTd] = trElem.children;
  let price = Number(priceTd.innerHTML);
  sumUpTd.innerHTML = price * elem.value;
  updateSum();
}

function updateSum() {
  let sum = 0;
  for (let row of productTableBody.children) {
    sum += Number(row.lastChild.innerHTML);
  }
  sumCell.innerHTML = sum;
}

function printTable() {
}
