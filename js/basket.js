const selectProductsDisplay = document.getElementById('productsDisplay');
const selectOrderButton = document.getElementById('order');
const myBasket = localStorage.getItem('myBasket');

// check if localStorage contains items
if (myBasket) { // if it contains items diplay them
    let arrayInMyBasket = JSON.parse(myBasket);
    arrayInMyBasket.forEach(article => {
        fetch(`http://localhost:3000/api/teddies/${article}`)
            .then(response => response.json())
            .then(teddy => {
                selectProductsDisplay.innerHTML += `
                <div class="col-3 pb-2"><img src="${teddy.imageUrl}" style="max-width: 90%;"></div>
                <div class="col-6 pb-2 text-center"><p>${teddy.name}</p></div>
                <div class="col-3 pb-2 text-center"><p>${teddy.price / 100} €</p></div>
                `
            });
    });
} else {    // else show a message "Basket is empty"
    selectProductsDisplay.innerHTML += `
    <div class="col-12">
        <p class="text-center">Le panier est vide.</p>
    </div>
    `
    selectOrderButton.setAttribute("href", "index.html");
    selectOrderButton.innerHTML = "Retour à l'accueil";
}