function saveCart(cart) {
  document
    .querySelector('#addToCart')
    .localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
  let cart = localStorage.getItem('cart');
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

function addCart(product) {
  let cart = getCart();
  cart.push(product);
  saveCart(cart);
}
