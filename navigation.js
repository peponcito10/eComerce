let mainContent = document.getElementById("main-content");

// Cargar Home por defecto
document.addEventListener("DOMContentLoaded", () => {
  fetch("main.html")
    .then((res) => res.text())
    .then((html) => {
      mainContent.innerHTML = html;
    });
});

// Home
document.getElementById("item-home").addEventListener("click", () => {
  fetch("./main.html")
    .then((r) => r.text())
    .then((html) => {
      mainContent.innerHTML = html;
    });
});

// Producto
document.getElementById("item-producto").addEventListener("click", () => {
  fetch("./producto.html")
    .then((r) => r.text())
    .then((html) => {
      mainContent.innerHTML = html;

      // carga el JS como módulo e inicializa
      import("./producto.js").then((m) => m.initProducto());
    });
});

// Shop
document.getElementById("item-shop").addEventListener("click", () => {
  fetch("./shop.html")
    .then((r) => r.text())
    .then((html) => {
      mainContent.innerHTML = html;

      // igual que producto
      import("./shop.js").then((m) => m.initShop());
    });
});
