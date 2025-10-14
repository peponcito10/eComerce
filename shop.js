import { getListCarrito, createProductCards } from "./producto.js";



// al inicializar Shop
export function initShop() {
      let listaProductos = document.getElementById("listaProductos");
    
    listaProductos.innerHTML = createProductCards( getListCarrito()) // llama al array de cosas compradas
  
}

