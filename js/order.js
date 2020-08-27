const selectOrderDisplay = document.getElementById('orderDisplay');
const myOrder = JSON.parse(localStorage.getItem('myOrder'));

if (myOrder) {
    const totalPrice = getTotalPrice();
    selectOrderDisplay.innerHTML = `
    <div class="col-12 text-center">
        <p>Merci pour votre commande n° <span class="font-weight-bold">${myOrder.orderId}</span> d'un montant de <span class="font-weight-bold">${totalPrice / 100} €</span></p>
        <a href="index.html" class="btn btn-info">Retour à l'accueil</a>
    </div>
    `
} else {
    selectOrderDisplay.innerHTML = `
    <div class="col-12 text-center">
        <p>Vous n'avez encore passé(e)s aucune commande</p>
        <a href="index.html" class="btn btn-info">Retour à l'accueil</a>
    </div>
    `
}

function getTotalPrice() {
    let addPrices = 0;
    myOrder.products.forEach(product => {
        addPrices += product.price
    });
    return addPrices;
}