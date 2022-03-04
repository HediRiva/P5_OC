//Récupération de l'id du produit
const productStringId = window.location.search;
console.log(productStringId);

const productParams = new URLSearchParams(productStringId);
console.log(productParams);

const productId = productParams.get('id');
console.log(productId);

// let productData = [];
// console.log(productData);

fetch(`http://localhost:3000/api/products/${productStringId}`)
  .then((res) => res.json())
  .then((promise) => {
    console.log(promise);
  })
  .catch(function (error) {
    console.log('erreur');
    return error;
  });
