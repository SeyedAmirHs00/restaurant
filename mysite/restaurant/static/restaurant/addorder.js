const selectedPersonName = document.getElementById("person-name");
const selectedPersonAddress = document.getElementById("person-address");
const selectedPersonId = document.getElementById("person-id");
const personsPopup = document.getElementById("persons-popup");
const closePersonPopup = document.getElementById("close-person-popup");
const selectPersonButton = document.getElementById("select-person-button");
const productsPopup = document.getElementById("products-popup");
const sumCell = document.getElementById("sum-cell");
const productTable = document.getElementById("product-table");
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
  updateSum();
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
  updateSum();
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
  let tableHtml = productTable.outerHTML;
  let style = `
<style>
@font-face {
  font-family: "IranSans";
  src: url("fonts/IranianSans.ttf");
  font-weight: normal;
  font-style: normal;
}

* {
  font-size: 3vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "IranSans";
}

.hidden {
  display: none;
}

#product-table {
  table-layout: fixed;
  border-collapse: collapse;
  border: 1px solid black;
}

#product-table td,
#product-table th {
  padding: 5px;
  border: 1px solid black;
}


#product-table tr:nth-child(even) {
  background-color: rgb(235, 235, 235);
}
#product-table tbody > tr:hover {
  background-color: rgb(160, 160, 160);
  cursor: pointer;
}

#product-table td input {
  background-color: inherit;
  outline: none;
  border: none;
  appearance: none;
  width: 100%;
  height: 100%;
  z-index: 2;
}

#product-table tbody td:nth-child(1) {
  text-align: center;
}

#product-table th:nth-child(1) {
  width: 30px;
}
#product-table th:nth-child(2) {
  width: 200px;
}

#product-table th:nth-child(3) {
  width: 150px;
}

#product-table th:nth-child(4) {
  width: 50px;
}

#product-table th:nth-child(5) {
  width: 150px;
}
</style>
`;

  // CREATE A WINDOW OBJECT.
  let win = window.open("", "", "height=700,width=700");

  win.document.write("<html dir='rtl'><head>");
  win.document.write("<title>Profile</title>"); // <title> FOR PDF HEADER.
  win.document.write(style); // ADD STYLE INSIDE THE HEAD TAG.
  win.document.write("</head>");
  win.document.write("<body>");
  win.document.write(tableHtml); // THE TABLE CONTENTS INSIDE THE BODY TAG.
  win.document.write("</body></html>");

  win.document.close(); // CLOSE THE CURRENT WINDOW.

  win.print();
}
