/* Affichage des produits sur la page d'accueil depuis l'API */

fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((products) => {
    for (let i = 0; i < products.length; i += 1) {
      document.querySelector(
        '#items'
      ).innerHTML += `<a href="./product.html?id=${products[i]._id}">
            <article>
              <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
              <h3 class="productName">${products[i].name}</h3>
              <p class="productDescription">${products[i].description}</p>
            </article>
          </a>`;
    }
  })
  .catch((error) => {
    console.log('Il y a une erreur : ' + error);
  });
