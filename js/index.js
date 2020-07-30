fetch('http://localhost:3000/api/teddies')
  .then(response => response.json())
  .then(teddies => teddies.forEach(teddy => {
    const selectMain = document.getElementsByTagName('main')[0];
    console.log(teddy);
    selectMain.innerHTML +=`
    <div class="card col-12 col-md-6 col-lg-4">
        <img class="card-img-top" src="${teddy.imageUrl}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${teddy.name}</h5>
            <p class="card-text">${teddy.description}</p>
            <a href="product.html" class="btn btn-primary">En savoir plus</a>
        </div>
    </div>`
  }))