
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

export const getListCarrito = () => carrito

export async function  initProducto () {
  const productos = document.getElementById("productos");
  const categoriaSelect = document.getElementById("selectCategory");
  
    // Esperamos los datos de la peticion
const res = await fetch("http://localhost/product/servicioweb/categoria.php");
const datos = await res.json()

datos.forEach((categorias) => {
  let optionProductos = document.createElement("option");
  optionProductos.value = categorias.id;
  optionProductos.textContent = categorias.nombre;

  categoriaSelect.appendChild(optionProductos);

})


console.log("categorias" , datos)


  if (!productos || !categoriaSelect) return;

  categoriaSelect.addEvenLtistener("change", async (idProductos) => { 


    const idProductosValue = idProductos.target.value


    productos.innerHTML = '<div class="text-center">Cargando...</div>';

    const res = await fetch(
      `http://localhost/product/servicioweb/producto.php?cat=${idProductosValue}`
    );
    const data = await res.json();

    console.log(data)
    // Renderizar cards
    productos.innerHTML = data
      .map(
        (producto, index) => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${producto.imagen_url}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="fw-bold">${producto.precio}</p>
            <button 
              type="button" 
              class="btn btn-primary btn-comprar" 
              data-index="${index}">
              ¡Comprar YA!
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Ahora seleccionamos todos los botones recién creados
    document.querySelectorAll(".btn-comprar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        const productoSeleccionado = data[idx];

        // Agregar al carrito
        carrito.push(productoSeleccionado);

        // Guardar en localStorage
        localStorage.setItem("carrito", JSON.stringify(carrito));

        console.log("Producto agregado:", productoSeleccionado);
        console.log("Carrito actual:", carrito);
      });
    });
  });
}
