let mainContent = document.getElementById("main-content");
let modalRegisterContent = document.getElementById(
  "main-modal-register-content"
);


let loginNav = document.getElementById("nav-login-btn");
let registerNav = document.getElementById("nav-register-btn");
let logoutNav = document.getElementById("nav-logout-btn");
let logoNav = document.getElementById("logo-nav");


let userData = localStorage.getItem("userData");
// Cargar Home por defecto
document.addEventListener("DOMContentLoaded", () => {

const shop = document.getElementById("item-shop");  




if(!userData){

shop.style.display = "none";
logoutNav.style.display = "none";

} else {
  const data = JSON.parse(userData);
  logoNav.innerHTML = data.NAME ;
  loginNav.style.display = "none";
  registerNav.style.display = "none";
}


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
// Opiniones
document.getElementById("item-opiniones").addEventListener("click", () => {
  fetch("./Views/opiniones/index.html")
    .then((r) => r.text())
    .then((html) => {
      mainContent.innerHTML = html;

      // carga el JS como módulo e inicializa
      import("./Views/opiniones/index.js").then((m) => m.initProducto());
    });
});
document.getElementById("item-admin").addEventListener("click", () => {
  fetch("./Views/administracion/index.html")
    .then((r) => r.text())
    .then((html) => {
      mainContent.innerHTML = html;

      // carga el JS como módulo e inicializa
      import("./Views/administracion/index.js").then((m) => m.initAdmin());
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


/** 
 *
 * Escuchadores del boton del login y register
 * 
 *  */
loginNav.addEventListener("click" , () => {

  fetch("./loginModalContent.html").then(r => r.text()).then(html => {
    modalRegisterContent.innerHTML = html
  })
})


registerNav.addEventListener("click" , () => {

  fetch("./registerModalContent.html").then(r => r.text()).then(html => {
    modalRegisterContent.innerHTML = html
  })
})


logoutNav.addEventListener("click" , () => {

  localStorage.removeItem("userData")
  window.location.replace("/product/");
})