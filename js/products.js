const selectProductsDisplay = document.getElementById('productsDisplay');
const url = new URL(window.location.href);
const urlId = url.searchParams.get("id");

// get the teddy whom id is in the url
fetch(`http://localhost:3000/api/teddies/${urlId}`)
    .then(response => response.json())
    .then(teddy => {
        selectProductsDisplay.innerHTML += `
        <div class="bg-primary rounded shadow text-center col-12 p-2">
            <div class="row">
                <div class="col-12 col-md-4 d-flex align-items-center justify-content-center">
                    <img src="${teddy.imageUrl}" style="max-width: 90%;">
                </div>
                <div class="col-12 col-md-8">
                    <h2 class="text-center">${teddy.name}</h2>
                    <p class="text-justify">${teddy.description}</p>
                    <label for="color-select">Choisissez une couleur : </label>
                    <select name="colors" id="color-select" class="mb-3">
                    </select>
                    <p class="font-weight-bold">${teddy.price / 100} €</p>
                    <a href="basket.html" class="btn btn-info" id="add-to-basket">Ajouter au panier</a>
                </div>
            </div>
        </div>`;
        // get colors from teddy to diplay them in a select tag
        const selectColorSelect = document.getElementById('color-select');
        teddy.colors.forEach(color => {
            selectColorSelect.innerHTML += `<option value="${color}">${color}</option>`;
        });
        // Listen "add to basket" button to add 1 in the quantity of the selected item
        const selectAddToBasketButton = document.getElementById('add-to-basket');
        selectAddToBasketButton.addEventListener('click', function () {
            addToBasket(teddy);
        });
    });

function addToBasket(newTeddy) {
    let myBasket = JSON.parse(localStorage.getItem('myBasket')) || [];  // If myBasket already exist recover it else create an array
    let alreadyInTheBasket = false;
    myBasket.forEach(teddy => { // Compare id of newTeddy with teddies alrady in myBasket and if it already exist increase quantity by 1
        if (teddy._id === newTeddy._id) {
            teddy.quantity += 1;
            alreadyInTheBasket = true;
        }
    });
    if (!alreadyInTheBasket) {
        myBasket.push({ _id: newTeddy._id, name: newTeddy.name, price: newTeddy.price, imageUrl: newTeddy.imageUrl, quantity: 1 });
    }
    localStorage.setItem('myBasket', JSON.stringify(myBasket));
}
