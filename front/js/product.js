//Récupération de l'id du produit
const productStringId = window.location.search;
console.log(productStringId);

const productParams = new URLSearchParams(productStringId);
console.log(productParams);

const productId = productParams.get('id');
console.log(productId);

let productData = [];
console.log(productData);

async function fillProduct() {
  let result = await fetch(`http://localhost:3000/api/products/${productId}`);
  let productData = await result.json();
  console.log(productData);
  document.querySelector(
    '.item__img'
  ).innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}" ></img>`;
  document.querySelector(
    '#title'
  ).innerHTML = `<h1 id="title">${productData.name}</h1>`;
  document.querySelector(
    '#price'
  ).innerHTML = `<span id="price">${productData.price}</span>`;
  document.querySelector(
    '#description'
  ).innerHTML = `<p id="description">${productData.description}</p>`;
  //   let productColor;
  //   productColor.classList.add('value__color');
  //   document.querySelector(
  //     '.value__color'
  //   ).innerHTML = `<option value="vert">${productData[0]}</option>`;
}

fillProduct();
