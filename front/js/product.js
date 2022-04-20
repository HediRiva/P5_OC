/* Récupération de l'id du produit dans l'url*/
const productStringId = window.location.search;
const productParams = new URLSearchParams(productStringId);
const productId = productParams.get('id');

/*Requête de l'API pour récupérer le produit selon son id*/
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => response.json())
  .then((productData) => {
    console.log(productData);
    /* Affichage des éléments du produit choisi, dans la page produit */
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
    addToBasket();
  })
  .catch((error) => {
    console.log('Il y a une erreur : ' + error);
  });

function addToBasket() {
  /* Ecoute du clic du bouton 'Ajouter au panier' de la page produit */
  const addToBasketBtn = document.querySelector('#addToCart');
  addToBasketBtn.addEventListener('click', () => {
    let productName = document.querySelector('#title').textContent;
    // let productPrice = document.querySelector('#price').textContent;
    let selectedColor = document.querySelector('#colors').value;
    let selectedQty = document.querySelector('#quantity').value;
    let selectedItem = {
      id: productId,
      name: productName,
      // price: productPrice,
      color: selectedColor,
      quantity: Number(selectedQty),
    };

    /* Condition de vérification si une couleur et une quantité ont
     bien été sélectionné, si oui on appelle la fonction pushToBasket,
     sinon une alerte apparait pour avertir l'utilisateur */
    if (colors.value !== '' && quantity.value > 0 && quantity.value <= 100) {
      pushToBasket(selectedItem);
      /* Fonction servant à passer sur la page panier ou bien à continuer le shopping en retournant sur la page d'accueil*/
      const basketConfirmation = () => {
        if (
          window.confirm(
            "Produit(s) ajouté(s) au panier ! \nSi vous souhaitez accéder au panier cliquez sur OK, pour continuer le shopping et voir d'autres modèles cliquez sur annuler ! "
          )
        ) {
          window.location.href = 'cart.html';
        } else {
          window.location.href = 'index.html';
        }
      };
      basketConfirmation();
    } else {
      alert(
        'Veuillez sélectionner au moins une couleur et une quantité de 1 à 100 maximum'
      );
    }
  });
}

/*  */
function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
/* Fonction de sauvegarde du panier dans le localstorage au format JSON */
function saveBasket(basket) {
  localStorage.setItem('basket', JSON.stringify(basket));
}

/* Fonction de remplissage des produits dans le panier */
function pushToBasket(selectedItem) {
  let basket = getBasket();
  let itemFound = basket.find(
    (item) => item.id === selectedItem.id && item.color === selectedItem.color
  );
  /** Condition servant à incrémenter si le produit, avec une même ID et une même couleur,
   *  est déjà dans le panier, ou bien création d'une nouvelle ligne avec un nouveau produit */
  if (itemFound) {
    itemFound.quantity += selectedItem.quantity;
  } else {
    basket.push(selectedItem);
  }

  saveBasket(basket);
}
