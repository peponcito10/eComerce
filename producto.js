import {
  obtenerPaginado,
  obtenerCategorias,
  obtenerProductoPorId,
  agregarProductoDeCarrito,
} from "./api/calls.js";

// Estado de la aplicación
const state = {
  page: 1,
  searchQuery: "",
  categoryId: null,
  pageSize: 10,
  isLoading: false,
};


const userData = JSON.parse(localStorage.getItem("userData"))

// Getters públicos
export const getListCarrito = () => state.carrito;

export async function initProducto() {
  try {
    await Promise.all([createSelectsCategoria(), renderProductos()]);

    setupEventListeners();
  } catch (error) {
    console.error("Error al inicializar:", error);
    mostrarError("No se pudo cargar la página");
  }
}

const renderProductos = async() => {
  const productosContainer = document.getElementById("productos");
  const paginado = await obtenerPaginado(state)

  const cardsData = createProductCards(paginado.data)


  console.log("p:" , paginado)
  productosContainer.innerHTML = cardsData
  renderPagination(paginado.totalPages , paginado.currentPage)
}


  const setupEventListeners = () => {
    const categoriaSelect = document.getElementById("selectCategory");
    const searchForm = document.getElementById("form-search");


  document.addEventListener("click", async (e) => {
    if (e.target.closest(".btnMoreInfo")) {
      const boton = e.target.closest(".btnMoreInfo");
      const id = boton.dataset.bsId;

      const producto = await obtenerProductoPorId(id);

      console.log("producto", producto);
      renderModal(producto);
    }
  });




    categoriaSelect.addEventListener("change", (e) => {
      e.preventDefault();

      const value = e.target.value;
      state.categoryId = value;

      renderProductos();
    });

    searchForm.addEventListener("submit", (e) => {
      const valueSearch = e.target.elements[0].value;
      state.searchQuery = valueSearch;

      renderProductos();
    });
  };





function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  if (contador) {
    contador.textContent = state.carrito.length;
  }
}

// ========== GENERADORES DE HTML ==========
export function createProductCards(productos) {
  if (!productos || productos.length === 0)   return 
  

  return productos
    .map((producto) => {
      const imagen = producto.imgs?.[0]?.images || "placeholder.jpg";
      const precio = formatearPrecio(producto.precio);


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
            <div class="mt-auto">
              <p class="fw-bold fs-5 text-primary mb-2">${precio}</p>
              <button 
                
                type="button" 
                class="btnMoreInfo btn btn-primary w-100" 
                data-bs-toggle="modal" 
                data-bs-target="#vistaRapidaModal" 
                data-bs-id="${producto.id}"
              >
                <i class="bi bi-eye"></i> Ver más
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function renderModal(producto) {
  if (!producto) return;

  // Nombre del producto
  const nombreElement = document.getElementById("producto-nombre");
  if (nombreElement) {
    nombreElement.textContent = producto.nombre;
  }

  // Stock
  const stockElement = document.getElementById("modal-header-und");
  if (stockElement) {
    const stockClass =
      producto.stock > 10
        ? "success"
        : producto.stock > 0
        ? "warning"
        : "danger";
    stockElement.innerHTML = `
      <span class="badge text-bg-${stockClass}">
        ${producto.stock} ${
      producto.stock === 1 ? "unidad" : "unidades"
    } disponible${producto.stock !== 1 ? "s" : ""}
      </span>
    `;
  }

  // Carrusel de imágenes
  const carouselElement = document.getElementById("carouselProducto");
  if (carouselElement && producto.imgs?.length > 0) {
    const imgs = producto.imgs
      .map(
        (img, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img 
          src="${img.images}" 
          class="d-block w-100" 
          alt="${producto.nombre} - imagen ${i + 1}"
          style="max-height: 400px; object-fit: contain"
        >
      </div>
    `
      )
      .join("");
    carouselElement.innerHTML = imgs;
  }

  // Descripción
  const descripcionElement = document.getElementById("producto-descripcion");
  if (descripcionElement) {
    descripcionElement.textContent =
      producto.descripcion || "Sin descripción disponible";
  }

  // Precio
  const precioElement = document.getElementById("producto-precio");
  if (precioElement) {
    precioElement.textContent = formatearPrecio(producto.precio);
  }

  // Botón de compra
  const buyButton = document.getElementById("buy-button");
  if (buyButton) {
    // Remover listeners previos
    const newButton = buyButton.cloneNode(true);
    buyButton.parentNode.replaceChild(newButton, buyButton);

    // Agregar nuevo listener
    newButton.addEventListener("click", () => {
      if (producto.stock > 0) {
        agregarProductoDeCarrito(userData.ID , producto.id);
      } else {
        mostrarNotificacion("Producto sin stock", "error");
      }
    });

    // Deshabilitar si no hay stock
    newButton.disabled = producto.stock <= 0;
    newButton.innerHTML =
      producto.stock > 0
        ? '<i class="bi bi-cart-plus"></i> Agregar al carrito'
        : "Sin stock";
  }
}

// crea categoriass
async function createSelectsCategoria() {
  const categoriaSelect = document.getElementById("selectCategory");
  if (!categoriaSelect) return;

  try {
    const categorias = await obtenerCategorias();

    // Limpiar opciones previas (excepto la primera)
    while (categoriaSelect.options.length > 1) {
      categoriaSelect.remove(1);
    }

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      categoriaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al crear selects de categoría:", error);
  }
}

function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination");


  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  let html = '<ul class="pagination justify-content-center">';

  // Botón anterior
  html += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a href="#" class="page-link" data-page="${currentPage - 1}" ${
    currentPage === 1 ? 'tabindex="-1"' : ""
  }>
        <i class="bi bi-chevron-left"></i> Anterior
      </a>
    </li>
  `;

  // Primera página
  if (startPage > 1) {
    html += `<li class="page-item"><a href="#" class="page-link" data-page="1">1</a></li>`;
    if (startPage > 2) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  // Páginas numeradas
  for (let i = startPage; i <= endPage; i++) {
    html += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a href="#" class="page-link" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Última página
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    html += `<li class="page-item"><a href="#" class="page-link" data-page="${totalPages}">${totalPages}</a></li>`;
  }

  // Botón siguiente
  html += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a href="#" class="page-link" data-page="${currentPage + 1}" ${
    currentPage === totalPages ? 'tabindex="-1"' : ""
  }>
        Siguiente <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  `;

  html += "</ul>";
  paginationContainer.innerHTML = html;

  // Event listeners para los enlaces de paginación
  paginationContainer.querySelectorAll("a.page-link").forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const newPage = parseInt(link.dataset.page);
      if (
        isNaN(newPage) ||
        newPage < 1 ||
        newPage > totalPages ||
        newPage === currentPage
      ) {
        return;
      }

      state.page = newPage;
      await renderProductos();

      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ========== UTILIDADES ==========
function formatearPrecio(precio) {
  if (!precio) return "S/ 0.00";
  const numero = parseFloat(precio);
  return `S/ ${numero.toFixed(2)}`;
}

// Inicializar contador del carrito al cargar
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
});
