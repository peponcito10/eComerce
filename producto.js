  // Exportamos funciones globales
  window.buscarProducto = buscarProducto;
  
  // Obtenemos carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // exportamos función que devuelve la lista del carrito
  export const getListCarrito = () => carrito

  // Función que se ejecuta al entrar a la sección producti
  export async function  initProducto () {


    // Producto seleccionado
    let productoActual = null;
    // Referencias al DOM
    const productos = document.getElementById("productos");
    const categoriaSelect = document.getElementById("selectCategory");

    // iniciamos con los productoss
    const allProductsFetch = await fetch(
      `http://localhost/product/servicioweb/producto.php`
    );
    const allProductsData = await allProductsFetch.json();
    // Insertamos las cards a productos
    productos.innerHTML = createProductCards(allProductsData);

    // Esperamos los datos de categorias de la peticion
    const res = await fetch(
      "http://localhost/product/servicioweb/categoria.php"
    );
    const datos = await res.json();

    // Creamos el inputSelect de categoriass
    datos.forEach((categorias) => {
      let optionProductos = document.createElement("option");
      optionProductos.value = categorias.id;
      optionProductos.textContent = categorias.nombre;

      categoriaSelect.appendChild(optionProductos);
    });

    if (!productos || !categoriaSelect) return;

    categoriaSelect.addEventListener("change", async (idProductos) => {
      const idProductosValue = await idProductos.target.value;

      // Mientras carga esto se muestra
      productos.innerHTML = '<div class="text-center">Cargando...</div>';

      const res = await fetch(
        `http://localhost/product/servicioweb/producto.php?cat=${idProductosValue}`
      );
      const data = await res.json();

      // Renderizar cards
      productos.innerHTML = createProductCards(data);

    });


    // Mostramos el modal!
    document
      .getElementById("vistaRapidaModal")
      .addEventListener("show.bs.modal", async (event) => {
        const button = event.relatedTarget;
        // obtenemos el Id del producto
        const id = button.getAttribute("data-bs-id");
        // Obtenemos producto a tavés de su ID
        productoActual = await obtenerDatosProducto(id);
        // modificamos el modal con los datos del producto
        document.getElementById("producto-nombre").textContent =
          productoActual.nombre;
        document.getElementById("modal-header-und").innerHTML = `
      <span class="badge text-bg-success">${productoActual.stock} und. disponibles</span>
    `;



        let imgs = productoActual.imgs
          .map(
            (v, i) => `
      <div class="rounded carousel-item ${i === 0 ? "active" : ""}">
        <img src=${v.images} class="d-block w-100">
      </div>
    `
          )
          .join("");


      
        // Inyectamos imagenes para el carrusel
        document.getElementById("carouselProducto").innerHTML = imgs;


        // Escuchamos el boton de compra del modal
        document.getElementById("buy-button").addEventListener("click", () => {
          if (!productoActual) return;
          // compramos producto y se agrega al carrito
          comprarProduct(productoActual);
        });
      });



  }

 

// ESTAS FUNCIONES SON ACCIONES DEL APARTADO PRODUCTO 
 



    // Función para obtener datos a través del ID
    async function obtenerDatosProducto(id) {
      try {
        
        const url = `http://localhost/product/servicioweb/productdetail.php?id=${id}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("Data", data);
        return data;
      } catch (err) {
        console.error("Error al obtener producto:", err);
      }
    }

    
    // Función para comprar productos
    function comprarProduct(producto) {
      // Agregamos producto a carrito
      console.log("Carrito:", carrito);
      console.log("producto:", producto);
      carrito.push(producto);
    }


 // Función para traer productos a traves del input Search
    function buscarProducto(event) {
      event.preventDefault();

      var search = document.getElementById("in_search").value;

      let formData = new FormData();
      formData.append("search", search);

      let rutaServicio =
        "http://localhost/product/servicioweb/searchproduct.php";

      fetch(rutaServicio, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((productos) => {
          console.log("productos : ", productos);
          document.getElementById("productos").innerHTML =
            createProductCards(productos);
        });
    }

    // Función para crear cards con productos

  export function createProductCards(productos) {
    if (!productos) return "";

    console.log(productos)
    return productos
      .map(
        (producto, index) => `
        <div class="col-sm-6 col-md-5- col-lg-4">
          <div class="card h-100 shadow-sm image-container">
            <div class="w-100   overflow-hidden  " style="height: 190px" > 
            <img src=${producto.imgs[0].images} class="card-img-top contain-img img-fluid" alt="${producto.nombre} "  >          
            </div>
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion}</p>
              <p class="fw-bold">${producto.precio}</p>
              <button 
                type="button" 
                data-bs-toggle="modal"
                data-bs-target="#vistaRapidaModal"
                data-bs-id="${producto.id}"
                class="btn btn-primary btn-comprar" >
                Ver más
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }