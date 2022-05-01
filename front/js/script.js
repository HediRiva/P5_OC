/* Requête de l'API pour récupérer l'objet contenant tous les produits et leurs caractèristiques */

function fillArticles() {
  fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((products) => {
      /** Boucle pour affichage des produits sur la page d'accueil **/
      for (let product of products) {
        document.querySelector(
          '#items'
        ).innerHTML += `<a href="./product.html?id=${product._id}">
               <article>
                 <img src="${product.imageUrl}" alt="${product.altTxt}">
                 <h3 class="productName">${product.name}</h3>
                 <p class="productDescription">${product.description}</p>
               </article>
             </a>`;
      }
    })
    .catch((error) => {
      console.log('Il y a une erreur ' + error);
    });
}

fillArticles();
