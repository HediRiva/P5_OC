/* Récupération de l'id du produit */
const productStringId = window.location.search;
const productParams = new URLSearchParams(productStringId);
const productId = productParams.get('id');
console.log(productId);

/* Envoi d'une requête HTTP à l'API avec fetch */
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productData) => {
    console.log(productData);
    document.querySelector(
      '.item__img'
    ).innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}" ></img>`;
    document.querySelector('#title').innerHTML = `${productData.name}`;
    document.querySelector('#price').innerHTML = `${productData.price}`;
    document.querySelector(
      '#description'
    ).innerHTML = `${productData.description}`;
    /* Boucle pour affichage des couleurs dans la liste déroulante */
    for (let color of productData.colors) {
      let productColors = document.createElement('option');
      document.querySelector('#colors').appendChild(productColors);
      productColors.value = color;
      productColors.innerHTML = color;
    }
  })
  .catch((error) => {
    console.log('Il y a une erreur : ' + error);
  });

/**** Ajout produit dans le panier ****/

/* Ecoute du clic du bouton panier sur la page produit */
const AddToBasketBtn = document.querySelector('#addToCart');
AddToBasketBtn.addEventListener('click', () => {
  let productName = document.querySelector('#title').textContent;
  let productPrice = document.querySelector('#price').textContent;
  let selectedColor = document.querySelector('#colors').value;
  let selectedQty = document.querySelector('#quantity').value;
  let selectedItem = {
    id: productId,
    name: productName,
    price: productPrice,
    color: selectedColor,
    quantity: selectedQty,
  };
  if (
    selectedColor.value !== '' &&
    quantity.value > 0 &&
    quantity.value <= 100
  ) {
    addToBasket(selectedItem);
  } else {
    alert('Veuillez sélectionner au moins une couleur et une quantité');
  }
});

function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}

function saveBasket(basket) {
  localStorage.setItem('basket', JSON.stringify(basket));
}

function addToBasket(selectedItem) {
  let basket = getBasket();
  basket.push(selectedItem);
  saveBasket(basket);
}
