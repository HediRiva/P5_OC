let url = 'http://localhost:3000/api/products';

function fillIndex() {
  //Requête de l'API
  fetch(url).then((res) =>
    res
      .json()
      .then((apiRequest) => {
        let articles = apiRequest;
        console.table(articles);
        //Insertion des produits dans le DOM
        for (let i = 0; i < articles.length; i += 1) {
          //Insertion de l'élément a
          let productLink = document.createElement('a');
          productLink.href = `product.html?id=${articles[i]._id}`;
          //Insertion de l'élément article
          let productArticle = document.createElement('article');
          productLink.appendChild(productArticle);
          //Insertion de l'élément img
          let productImg = document.createElement('img');
          productArticle.appendChild(productImg);
          productImg.src = articles[i].imageUrl;
          productImg.alt = articles[i].altTxt;
          //Insertion de l'élément H3
          let productName = document.createElement('h3');
          productArticle.appendChild(productName);
          productName.classList.add('productName');
          productName.innerHTML = articles[i].name;
          //Insertion de l'élément p
          let productDescription = document.createElement('p');
          productArticle.appendChild(productDescription);
          productDescription.classList.add('productDescription');
          productDescription.innerHTML = articles[i].description;
          //Insertion de l'article
          document.querySelector('#items').appendChild(productLink);
        }
      })
      .catch(function (error) {
        return error;
      })
  );
}
fillIndex();
