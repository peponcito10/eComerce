const API_BASE = "http://localhost/product/servicioweb/";
export const API_ENDPOINTS = {
  products: `${API_BASE}productPagination.php`,
  categories: `${API_BASE}categoria.php`,
  productByid: `${API_BASE}productFind.php`,
  findProductsOfCar: `${API_BASE}findProductsToCar.php`,
  addProductToCar: `${API_BASE}addProductToCar.php`,
  deleteProductToCar: `${API_BASE}deleteProductToCar.php`
};


export const CONST_CATEGORY = {
    1 : "electronica",
    2 : "ropa",
    3 : "hogar",
    4 : "accesorios"
}