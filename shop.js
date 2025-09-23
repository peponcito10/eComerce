import { getListCarrito } from "./producto.js";



// al inicializar Shop
export function initShop() {
      let listaProductos = document.getElementById("listaProductos");
    
    listaProductos.innerHTML = getListCarrito() // llama al array de cosas compradas
      .map(
        (producto, index) => `
      <div class="col-12 col-md-6 col-lg-4">    
        <div class="card h-100 shadow-sm">
          <img src="${producto.imagen_url}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="fw-bold">${producto.precio}</p>
    
          </div>
        </div>
      </div>
    `
      )
      .join("");

}
