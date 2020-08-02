// get every teddies from backend to diplay them on front page
fetch('http://localhost:3000/api/teddies')
  .then(response => response.json())
  .then(teddies => teddies.forEach(teddy => {
    const selectMainRow = document.getElementById('productsDisplay');
    selectMainRow.innerHTML +=`
      <div class="col-12 col-md-6 col-lg-4 p-2">
        <div class="card text-center bg-primary" style="width: 18rem;">
          <img class="card-img-top" src="${teddy.imageUrl}" style="max-height: 12rem;" alt="Un adorable ours en peluche">
          <div class="card-body">
              <h3 class="card-title">${teddy.name}</h3>
              <p class="card-text">${teddy.description}</p>
              <a href="products.html" class="btn btn-info" id="${teddy._id}">Commander - ${teddy.price/100} €</a>
          </div>  
        </div>
      </div>`
  }))

// // listen event on btn so that id is given to the next page
// const buttons = document.getElementsByClassName("btn");
// buttons.addEventListener('click', function(event) {
//   event.preventDefault();
//   console.log('Ok !!')
// });