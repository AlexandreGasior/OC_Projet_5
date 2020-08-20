const selectProductsDisplay = document.getElementById('productsDisplay');
const selectForm = document.getElementById('order-form');
const selectFormButton = document.getElementById('order-button');
const myBasket = JSON.parse(localStorage.getItem('myBasket'));

// check if localStorage contains items
if (myBasket) { // if it contains items diplay them
    selectProductsDisplay.innerHTML += `
    <table class="table table-image">
        <thead>
            <tr>
                <th scope="col">Quantité</th>
                <th scope="col">Image</th>
                <th scope="col">Nom de l'article</th>
                <th scope="col">Prix</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    `
    const selectTbody = document.getElementsByTagName('tbody')[0];
    let totalPrice = 0;
    myBasket.forEach(teddy => {
        totalPrice += teddy.price * teddy.quantity / 100
        selectTbody.innerHTML += `
            <tr>
                <th scope="row"><i class="fas fa-minus text-info"></i> <span class="quantity">${teddy.quantity}</span> <i class="fas fa-plus text-info"></i></th>
                <td class="w-25"><img src="${teddy.imageUrl}" class="img-fluid img-thumbnail"></td>
                <td>${teddy.name}</td>
                <td>${(teddy.price / 100) * teddy.quantity} €</td>
            </tr>
            `
    });
    // Indicate total price in the basket
    selectTbody.innerHTML += `
        <tr>
            <th scope="row"></th>
            <td class="w-25"></td>
            <td class="total-price">Prix total</td>
            <td class="total-price">${totalPrice} €</td>
        </tr>
        `
} else {    // else show a message "Basket is empty"
    selectProductsDisplay.innerHTML = `
        <div class="col-12 text-center">
            <p>Le panier est vide.</p>
            <a href="index.html" class="btn btn-info">Retour à l'accueil</a>
        </div>
        `
    selectForm.remove();
}

// Listen event on click for - and + to change quantity in basket

// listen event on click for order-button to send the request
selectFormButton.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(e);
    // validateForm();
});

function validateForm() {
    // get data from form
    const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    };

    // recover articles in the basket
    const products = [];
    myBasket.forEach(teddy => {
        for (let i = 0; i < teddy.quantity; i++) {
            products.push(teddy._id)
        }
    });

    // send request POST to backend
    const order = JSON.stringify({
        contact: contact,
        products: products
    });

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
            localStorage.setItem("order", this.responseText);
            window.location.href = "order.html";
        } else if (this.readyState == XMLHttpRequest.DONE && this.status != 201) {
            console.error("Une erreur est survenue, veuillez ressayer plus tard.");
            return;
        }
    };
    request.open("POST", "http://localhost:3000/api/teddies/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = 'text';
    request.send(order);
    console.log(localStorage.getItem("order"));
};