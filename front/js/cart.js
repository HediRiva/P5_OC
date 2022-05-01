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
          /** push du prix du produit dans l'array Prices */
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

          modifyQuantity(basket);
          deleteItem(productDeleteButton, productId, productColor, basket);
          totalItems(prices);
        })
        .catch((error) => {
          console.log('Il y a une erreur ' + error);
        });
    }
  }
}
getBasket();

/* Modification de la quantité des produits avec écoute du change */
function modifyQuantity(basket) {
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

/** Suppression d'un produit du panier */
function deleteItem(productDeleteButton, productId, productColor, basket) {
  productDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    /* demande de confirmation de la suppression de l'article */
    if (window.confirm(`Êtes-vous sur de vouloir supprimer cet article ?`)) {
      basket = basket.filter(
        (el) => el.id !== productId || el.color !== productColor
      );

      localStorage.setItem('basket', JSON.stringify(basket));
      location.reload();
    }
  });
}

/** Calcul du nombre de produit du panier ainsi que du prix total */
function totalItems(prices) {
  /** calcul de la quantité */
  let productQuantity = document.querySelectorAll('.itemQuantity');

  let totalQuantitySelect = 0;
  let totalQuantityItems = document.querySelector('#totalQuantity');

  for (let i = 0; i < productQuantity.length; i++) {
    totalQuantitySelect += productQuantity[i].valueAsNumber;
  }
  totalQuantityItems.textContent = totalQuantitySelect;

  /** calcul du prix */
  let totalPrice = 0;
  let totalPriceItems = document.querySelector('#totalPrice');

  for (let i = 0; i < productQuantity.length; i++) {
    totalPrice += productQuantity[i].valueAsNumber * prices[i];
  }
  totalPriceItems.textContent = totalPrice;
}

/*******   FORMULAIRE   *******/

/** fonction de vérification des champs du formulaire remplis par l'utilisateur */
function getUserForm() {
  let inputs = document.querySelectorAll('input');

  /** Affichage des erreurs en cas de données de formulaire non valide */
  const errorMessage = (tag, message, valid) => {
    const displayErrorMessage = document.querySelector('#' + tag + 'ErrorMsg');

    if (!valid) {
      displayErrorMessage.textContent = message;
    } else {
      displayErrorMessage.textContent = '';
    }
  };

  /** Mise en place des Regex pour chaque champ */

  const firstNameChecker = (value) => {
    if (value.match(/^[a-zéèôöîïûùü' -]{2,50}$/gi)) {
      errorMessage('firstName', '', true);
      firstName = value;
    } else {
      errorMessage(
        'firstName',
        'Le prénom ne doit pas contenir de chiffres ni de caractères spéciaux'
      );
    }
  };
  const lastNameChecker = (value) => {
    if (value.match(/^[a-zéèôöîïûùü' -]{2,50}$/gi)) {
      errorMessage('lastName', '', true);
      lastName = value;
    } else {
      errorMessage(
        'lastName',
        'Le nom ne doit pas contenir de chiffres ni de caractères spéciaux'
      );
    }
  };
  const addressChecker = (value) => {
    if (value.match(/^[0-9]{1,4}[a-zéèôöîïûùü' -]{2,50}$/gi)) {
      errorMessage('address', '', true);
      address = value;
    } else {
      errorMessage(
        'address',
        "Vous ne pouvez utiliser que des chiffres, lettres, espaces, - et '"
      );
    }
  };
  const cityChecker = (value) => {
    if (value.match(/^[a-zéèôöîïûùü' -]{2,50}$/gi)) {
      errorMessage('city', '', true);
      city = value;
    } else {
      errorMessage(
        'city',
        "Vous ne pouvez utiliser que des lettres, espaces, - et '"
      );
    }
  };
  const emailChecker = (value) => {
    if (value.match(/^[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,10}$/gi)) {
      errorMessage('email', '', true);
      email = value;
    } else {
      errorMessage('email', 'Veuillez saisir une adresse email valide');
    }
  };

  inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      switch (e.target.id) {
        case 'firstName':
          firstNameChecker(e.target.value);
          break;
        case 'lastName':
          lastNameChecker(e.target.value);
          break;
        case 'address':
          addressChecker(e.target.value);
          break;
        case 'city':
          cityChecker(e.target.value);
          break;
        case 'email':
          emailChecker(e.target.value);
          break;

        default:
          null;
      }
    });
  });
}
getUserForm();

/* Initialisation de l'array de produit qui sera envoyé à l'API */
let products = [];

let form = document.querySelector('.cart__order__form');
let basket = JSON.parse(localStorage.getItem('basket'));

/* Pour chaque produit du panier, on push le productId dans l'array products */
for (let product of basket) {
  products.push(product.id);
  console.log(products);
}

/* Ecoute de l'event submit de form */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  /* Création de l'objet contact qui sera envoyé à l'API*/
  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };
  /* Envoi de l'objet contact et des produits à l'API */
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contact, products }),
  })
    /* Réponse de l'API au format JSON */
    .then((response) => response.json())
    /* Définition de la réponse de l'API en tant que orderDetails et définition de l'action à exécuter */
    .then((orderDetails) => {
      /* Obtention de l'élément orderId à partir de la réponse de l'API et affectation dans 
      une variable pour une utilisation ultérieure dans l'url */
      let orderId = orderDetails.orderId;
      if (orderId) {
        /* Redirection de l'utilisateur sur la page de confirmation et ajout de l'orderId dans l'url */
        window.location.href = `./confirmation.html?id=${orderId}`;
      } else {
        alert(
          'Il semble y avoir un problème. Veuillez ré-essayer ultérieurement'
        );
      }
    })
    .catch((error) => {
      console.log(
        "L'envoi du formulaire à l'API a rencontré un problème" + error
      );
    });
});
