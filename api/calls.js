import { API_ENDPOINTS } from "../const.js";

// ========== API CALLS ==========
export async function obtenerPaginado(state) {
  try {
    const response = await fetch(API_ENDPOINTS.products, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchQuery: state.searchQuery,
        categoryId: state.categoryId,
        page: state.page,
        pageSize: state.pageSize,
      }),
    });


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
  


    return {
      data: data.data || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || state.page,
      total: data.total || 0,
    };
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { data: [], totalPages: 1, currentPage: 1, total: 0 };
  }
}

export async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(API_ENDPOINTS.productByid, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }


    const data = await response.json()

    return data

  } catch (error) {
    console.error("Error al obtener producto:", error);
    mostrarError(`Error al cargar el producto: ${error.message}`);
    return null;
  }
}

export async function obtenerCategorias() {
  try {
    const response = await fetch(API_ENDPOINTS.categories);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Error al parsear categorías:", text.substring(0, 200));
      return [];
    }
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

export async function obtenerProductosCarrito(state , userId) {

  try{
 const response = await fetch(API_ENDPOINTS.findProductsOfCar, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
     searchQuery: state.searchQuery,
     categoryId: state.categoryId,
     page: state.page,
     pageSize: state.pageSize,
     userId: userId
   })   
 });

 const data = await response.json()

 return data

    
  }catch (err){

console.log("error al obtener productos del carrito" , err)

  }
}


export async function agregarProductoDeCarrito(userId , productId) {
  

  try {

    console.log(userId)
    console.log(productId)
const response = await fetch(API_ENDPOINTS.addProductToCar, {
    method: "POST",
    body: JSON.stringify({
      userId: userId,
      productId: productId,
    }),
  });


const data = await response.json()


  console.log("listo"  , data)
  }catch (err){

    console.error("error al agregar producto:" , err)
  }

}



export async function eliminarProductoDeCarrito(idCarrito) {
  try {
   const response = await fetch(API_ENDPOINTS.deleteProductToCar, {
      method: "POST", 
      body: JSON.stringify({
        idCarrito: idCarrito,
      
      }),
    });


    const data = await response.json()
    console.log(data)

    return data
  } catch (err) {
    console.error("error al eliminar producto:", err);
  }
}
