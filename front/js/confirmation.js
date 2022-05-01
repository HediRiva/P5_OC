let params = new URL(document.location).searchParams;
document.getElementById('orderId').textContent = params.get('id');
