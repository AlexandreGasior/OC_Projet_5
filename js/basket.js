const selectProductsDisplay = document.getElementById('productsDisplay');
const selectFormContainer = document.getElementById('order-form');
const selectForm = document.querySelector('form');
const myBasket = JSON.parse(localStorage.getItem('myBasket'));
let totalPrice = 0;

// check if localStorage contains items
if (myBasket) { // if it contains items diplay them
    selectProductsDisplay.innerHTML += `
    <table class="table table-image">
        <thead>
            <tr>
                <th scope="col">Quantité</th>
                <th scope="col">Image</th>
                <th scope="col">Nom de l'article</th>
                <th scope="col">Prix/u</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    `
    const selectTbody = document.getElementsByTagName('tbody')[0];
    myBasket.forEach(teddy => {
        totalPrice += teddy.price * teddy.quantity / 100
        selectTbody.innerHTML += `
            <tr id="${teddy._id}">
                <th scope="row"><i class="fas fa-minus text-info basket-icon"></i> <span class="quantity">${teddy.quantity}</span> <i class="fas fa-plus text-info basket-icon"></i></th>
                <td class="w-25"><img src="${teddy.imageUrl}" class="img-fluid img-thumbnail"></td>
                <td>${teddy.name}</td>
                <td>${(teddy.price / 100)} €</td>
            </tr>
            `
    });
    // Indicate total price in the basket
    selectTbody.innerHTML += `
        <tr>
            <th scope="row"></th>
            <td class="w-25"></td>
            <td class="total-price">Prix total</td>
            <td class="total-price" id="total-price">${totalPrice} €</td>
        </tr>
        `
} else {    // else show a message "Basket is empty"
    showBasketIsEmptyMessage();
}

function showBasketIsEmptyMessage() {
    selectProductsDisplay.innerHTML = `
        <div class="col-12 text-center">
            <p>Le panier est vide.</p>
            <a href="index.html" class="btn btn-info">Retour à l'accueil</a>
        </div>
        `
    selectFormContainer.remove();
}

// Listen event on click for - and + to change quantity in basket
const selectRemoveButtons = Array.from(document.getElementsByClassName('fa-minus'));
const selectAddButtons = Array.from(document.getElementsByClassName('fa-plus'));
const selectTotalPrice = document.getElementById('total-price');

selectRemoveButtons.forEach(removeButton => {
    removeButton.addEventListener('click', function () {            // listen event on every - buttons
        const trFromArticleToRemove = this.parentNode.parentNode;   // get the tr of the article in case quantity === 0 after the operation to remove the row
        const idFromArticleToRemove = trFromArticleToRemove.id;     // get the id of teddy to update
        const quantityToUpdate = this.nextSibling.nextSibling;      // get quantity displayed to update it after modification
        for (let i = 0; i < myBasket.length; i++) {
            if (myBasket[i]._id === idFromArticleToRemove) {        // check if the article to update is the same as the one in localStorage
                myBasket[i].quantity -= 1;                          // remove 1 from quantity
                totalPrice -= myBasket[i].price / 100;              // update total price and refresh display
                selectTotalPrice.textContent = `${totalPrice} €`
                quantityToUpdate.textContent = myBasket[i].quantity;// change quantity displayed
                if (myBasket[i].quantity === 0) {                   // if quantity now = 0 then delete the article from the array
                    myBasket.splice(i, 1);
                    trFromArticleToRemove.remove();                 // remove row now that quantity = 0
                }
                break;                                              // break the loop once it's done
            }
        };
        if (myBasket.length === 0) {                                // if there is no more article in the basket show the appropriate message instead of the table
            showBasketIsEmptyMessage();
        }
        localStorage.setItem('myBasket', JSON.stringify(myBasket)); // overwrite it in LocalStorage to validate the changes
    });
});

selectAddButtons.forEach(addButton => {
    addButton.addEventListener('click', function () {               // listen event on every + buttons
        const idFromArticleToAdd = this.parentNode.parentNode.id;   // get the id of teddy to update
        const quantityToUpdate = this.previousSibling.previousSibling;  // get quantity displayed to update it after modification
        for (let i = 0; i < myBasket.length; i++) {
            if (myBasket[i]._id === idFromArticleToAdd) {           // check if the article to update is the same as the one in localStorage
                myBasket[i].quantity += 1;                          // add 1 from quantity
                totalPrice += myBasket[i].price / 100;              // update total price an refresh display
                selectTotalPrice.textContent = `${totalPrice} €`
                quantityToUpdate.textContent = myBasket[i].quantity;// change quantity displayed
                break;
            }
        }
        localStorage.setItem('myBasket', JSON.stringify(myBasket)); // overwrite it in LocalStorage to validate the changes
    });
});

// listen event on click for order-button to send the request
selectForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let contact = checkForm();     // check if fields in form are correct
    // if everything is fine then send request POST to backend
    if (contact) {
        const products = [];      // recover articles in the basket
        myBasket.forEach(teddy => {
            for (let i = 0; i < teddy.quantity; i++) {
                products.push(teddy._id)
            }
        });
        const myOrder = JSON.stringify({
            contact: contact,
            products: products
        });
        sendRequestPost(myOrder);
    } else {
        console.error("Une erreur est survenue, veuillez ressayer plus tard.");
    }
});

function checkForm() {
    if (document.getElementById("firstName").validity.valid &&
        document.getElementById("lastName").validity.valid &&
        document.getElementById("address").validity.valid &&
        document.getElementById("city").validity.valid &&
        document.getElementById("email").validity.valid) {
        return {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        };
    }
    return false;
}

function sendRequestPost(myOrder) {
    const options = {
        method: 'POST',
        body: myOrder,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch('http://localhost:3000/api/teddies/order', options)
        .then(response => response.json())
        .then(response => {
            localStorage.clear();
            localStorage.setItem("myOrder", JSON.stringify(response));
            window.location.href = 'order.html';
        });
}