import {eliminarProductoDeCarrito, obtenerProductosCarrito} from "./api/calls.js"
const dataUser = localStorage.getItem("userData");

const state = {
  page: 1,
  searchQuery: "",
  categoryId: null,
  pageSize: 10,
  isLoading: false,
};


// al inicializar Shop
export async function initShop() {
const productList = document.getElementById("listaProductos");

    const responseUser = JSON.parse(dataUser);


    console.log(responseUser)

  const pagination =  await obtenerProductosCarrito(state , responseUser.ID)
 console.log(pagination.data);

 const productosHTML =  createProductCards(pagination.data)


 productList.innerHTML = productosHTML;

setupEventListeners();

}


  const setupEventListeners = () => {

document.addEventListener("click", async (e) => {
  if (e.target.closest(".btnDeleteProductoOfCar")) {

    const boton = e.target.closest(".btnDeleteProductoOfCar");
    const id = boton.dataset.idcarrito;
const productList = document.getElementById("listaProductos");
    const response = await eliminarProductoDeCarrito(id);

    console.log(response)
    const responseUser = JSON.parse(dataUser);
    const pagination = await obtenerProductosCarrito(state, responseUser.ID);

    productList.innerHTML = createProductCards(pagination.data);
  }
});
  }


 function createProductCards(productos) {
console.log("productos", "..");

  if (!productos || productos.length === 0)   return ''
  
console.log("productos" , productos)
  return productos
    .map((producto) => {
      const imagen = producto.imgs?.[0]?.images || "placeholder.jpg";


      console.log(producto.imgs[0].images)

      return `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="position-relative overflow-hidden object-fit-contain" style="height: 200px">
            <img src=${imagen} class="w-100 h-100">
          </div> 
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate" title="${producto.nombre}">
              ${producto.nombre}
            </h5>
            <p class="card-text text-muted small flex-grow-1" style="max-height: 3em; overflow: hidden">
              ${producto.descripcion || "Sin descripción"}
            </p>
          <p class="card-text text-muted small flex-grow-1" style="max-height: 3em; overflow: hidden">
            cantidad: ${producto.cantidad}
            </p>
            <div class="mt-auto">
              <button 
                data-idCarrito="${producto.idCarrito}"
                type="button" 
                class="btnDeleteProductoOfCar btn btn-warning w-100" 
              >
                <i class="bi bi-eye"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

