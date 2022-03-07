//Récupération de l'id du produit
const productStringId = window.location.search;
console.log(productStringId);

const productParams = new URLSearchParams(productStringId);
console.log(productParams);

const productId = productParams.get('id');
console.log(productId);

let productData = [];
console.log(productData);

/*Fonction pour récupérer le produit choisi en page d'accueil*/
async function fillProduct() {
  let result = await fetch(`http://localhost:3000/api/products/${productId}`);
  let productData = await result.json();
  console.log(productData);
  document.querySelector(
    '.item__img'
  ).innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}" ></img>`;
  document.querySelector('#title').innerHTML = `${productData.name}`;
  document.querySelector(
    '#price'
  ).innerHTML = `<span id="price">${productData.price}</span>`;
  document.querySelector(
    '#description'
  ).innerHTML = `<p id="description">${productData.description}</p>`;
  for (let color of productData.colors) {
    console.table(color);
    let productColors = document.createElement('option');
    document.querySelector('#colors').appendChild(productColors);
    productColors.value = color;
    productColors.innerHTML = color;
  }
}

fillProduct();
