/** récupération des données présentes dans le localStorage */
let basket = JSON.parse(localStorage.getItem('basket'));
console.log(basket);

/** initialisation de l'array qui servira à contenir les prix
 * des produits séléctionnés dans le panier
 */
let prices = [];

/** Fonction d'affichage du produit dans la page panier */
function getBasket() {
  let basket = JSON.parse(localStorage.getItem('basket'));
  if (basket === null || basket == 0) {
    const emptyBasket = document.querySelector('h1');
    emptyBasket.textContent = 'Le panier est vide';
  } else {
    /** Boucle for servant à afficher dans la page Panier
     *  les produits séléctionnés dans la page Produit */
    for (let item of basket) {
      let productId = item.id;
      let productColor = item.color;
      let productQuantity = item.quantity;

      /** récupération depuis l'API des données des produits choisis */
      fetch(`http://localhost:3000/api/products/${productId}`)
        .then((response) => response.json())
        .then((productData) => {
          console.log(productData);
          const basketItem = document.querySelector('#cart__items');
          /** push du prix du produit dans le array Prices */
          prices.push(productData.price);
          /* Création de l'élément HTML article */
          let productArticle = document.createElement('article');
          productArticle.classList.add('cart__item');
          productArticle.dataset.id = productId;
          productArticle.dataset.color = productColor;
          basketItem.appendChild(productArticle);

          /* Création de la div contenant l'image */
          let productImgContainer = document.createElement('div');
          productImgContainer.classList.add('cart__item__img');
          productArticle.appendChild(productImgContainer);

          let productImg = document.createElement('img');
          productImg.src = productData.imageUrl;
          productImg.alt = productData.altTxt;
          productImgContainer.appendChild(productImg);

          /* Création de la div contenant la description du produit */
          let productContent = document.createElement('div');
          productContent.classList.add('cart__item__content');
          productArticle.appendChild(productContent);

          let productContentDescription = document.createElement('div');
          productContentDescription.classList.add(
            'cart__item__content__description'
          );
          productContent.appendChild(productContentDescription);

          let productName = document.createElement('h2');
          productName.textContent = productData.name;
          productContentDescription.appendChild(productName);

          /* Création de l'élément p contenant la couleur du produit */
          let productColorPicked = document.createElement('p');
          productColorPicked.textContent = productColor;
          productContentDescription.appendChild(productColorPicked);

          /* Création de l'élément p contenant le prix du produit */
          let productPrice = document.createElement('p');
          productPrice.textContent = `${productData.price} €`;
          productContentDescription.appendChild(productPrice);

          /* Création de l'élément div contenant la quantité du produit
           ainsi que la touche pour modifier le nombre de produit
          et la touche de suppression du produit */
          let productContentSettings = document.createElement('div');
          productContentSettings.classList.add('cart__item__content__settings');
          productContent.appendChild(productContentSettings);

          let productQuantitySettings = document.createElement('div');
          productQuantitySettings.classList.add(
            'cart__item__content__settings__quantity'
          );
          productContentSettings.appendChild(productQuantitySettings);

          let productQuantityPickedLabel = document.createElement('p');
          productQuantityPickedLabel.textContent = 'Quantité : ';
          productQuantitySettings.appendChild(productQuantityPickedLabel);

          /** création de l'élément Input */
          let productQuantityPicked = document.createElement('input');
          productQuantityPicked.setAttribute('type', 'number');
          productQuantityPicked.setAttribute('name', 'itemQuantity');
          productQuantityPicked.setAttribute('min', 1);
          productQuantityPicked.setAttribute('max', 100);
          productQuantityPicked.setAttribute('value', productQuantity);
          productQuantityPicked.classList.add('itemQuantity');
          productQuantitySettings.appendChild(productQuantityPicked);

          let productDelete = document.createElement('div');
          productDelete.classList.add('cart__item__content__settings__delete');
          productContentSettings.appendChild(productDelete);

          /** création du boutton Supprimer */
          let productDeleteButton = document.createElement('p');
          productDeleteButton.classList.add('deleteItem');
          productDelete.appendChild(productDeleteButton);
          productDeleteButton.textContent = 'Supprimer';

          modifyQuantity();
          deleteItem(productDeleteButton, productId, productColor);
          totalItems(prices);
        })
        .catch((error) => {
          console.log('Il y a une erreur ' + error);
        });
    }
  }
}
getBasket();

/* fonction de modification de la quantité des produits avec écoute du change */
function modifyQuantity() {
  const modifQuantity = document.querySelectorAll('.itemQuantity');

  for (let i = 0; i < modifQuantity.length; i++) {
    modifQuantity[i].addEventListener('change', (e) => {
      e.preventDefault();

      basket[i].quantity = e.target.value;

      if (basket[i].quantity == 0 || basket[i].quantity > 100) {
        alert('Veuillez sélectionner une quantité comprise entre 1 et 100');
        location.reload();
      } else {
        localStorage.setItem('basket', JSON.stringify(basket));
        totalItems(prices);
      }
    });
  }
}

/** fonction servant à supprimer un produit du panier */
function deleteItem(productDeleteButton, productId, productColor) {
  productDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    /* demande de confirmation de la suppression de l'article */
    if (window.confirm(`Êtes-vous sur de vouloir supprimer cet article ?`)) {
      basket = basket.filter(
        (el) => el.id !== productId && el.color !== productColor
      );

      localStorage.setItem('basket', JSON.stringify(basket));
      location.reload();
    }
  });
}

/** fonction servant à calculer le nombre de produit du panier ainsi que le prix total */
function totalItems(prices) {
  /** calcul de la quantité */
  let productQuantity = document.getElementsByClassName('itemQuantity');

  let totalQuantitySelect = 0;
  let totalQuantityItems = document.getElementById('totalQuantity');

  for (let i = 0; i < productQuantity.length; i++) {
    totalQuantitySelect += productQuantity[i].valueAsNumber;
  }
  totalQuantityItems.textContent = totalQuantitySelect;

  /** calcul du prix */
  let totalPrice = 0;
  let totalPriceItems = document.getElementById('totalPrice');

  for (let i = 0; i < productQuantity.length; i++) {
    totalPrice += productQuantity[i].valueAsNumber * prices;
  }

  totalPriceItems.textContent = totalPrice;
}
