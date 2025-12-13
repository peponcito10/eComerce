import { obtenerPaginado , obtenerCategorias} from "../../api/calls.js";
import {CONST_CATEGORY } from "../../const.js";

const state = {
  page: 1,
  searchQuery: "",
  categoryId: null,
  pageSize: 10,
};


// crea tabla
    const trTableCreate = async() => {
    const data =  (await obtenerPaginado(state))

    renderPagination(data.totalPages , data.currentPage);

    const dataInfo = data.data
    
      if (!Array.isArray(dataInfo) || !dataInfo) return;
    let trsTableDOM = document.getElementById("trsTable");

      const trTable = dataInfo
        .map(
          (e, i) => { 
            
            
            return` 
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${e.nombre}</td>
            <td>${e.descripcion}</td>
            <td>${CONST_CATEGORY[e.categoria_id] ?? "sin categoría"}</td>
            <td>${e.precio}</td>
        </tr>
    `}
        )
        .join("");



       trsTableDOM.innerHTML = trTable;

    };

// crea categorias
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
      

   // Escuchamos eventos
   const setupEventListeners = () => {
     const categoriaSelect = document.getElementById("selectCategory");
    const searchForm = document.getElementById("form-search");
     categoriaSelect.addEventListener("change" , (e) => {
        e.preventDefault()

        const value = e.target.value
        state.categoryId = value 

        trTableCreate()
     })

   searchForm.addEventListener("submit" , (e) => {
    const valueSearch = e.target.elements[0].value
    state.searchQuery = valueSearch

    trTableCreate()
   });

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
         await trTableCreate();

         // Scroll suave hacia arriba
         window.scrollTo({ top: 0, behavior: "smooth" });
       });
     });
   }



export const initAdmin = async() => {
    // esperamos las promesas
    await Promise.all([
      trTableCreate(),
      createSelectsCategoria(),
    ]);
        
    setupEventListeners()
}   