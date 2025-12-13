/**
 * EN ESTE ARCHIVO JS MANEJAMOS LA LÓGICA DEL REGISTER INDEX.HTML QUE NOS PERMITE:
 * -VALIDAR USUARIO
 * -CREAR USUARIO
 */

const registerForm = document.getElementById("form_register");

// ESCUCHAMOS EL SUBMIT DEL FORM
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registerForm);

  // HACEMOS LLAMADO POST
  try {
    const res = await fetch(
      `http://localhost/product/servicioweb/register_user.php`,
      {
        method: "POST",
        body: formData,
      }
    );

    // OBTENEMOS RESPUESTA DEL POST
    const data = await res.json();

    console.log("dar", data)
    if (data.status === "SUCCESS") {


        console.log(data)
        localStorage.setItem("userData", JSON.stringify(data.data));
        window.location.replace("/product/");
        return;
      }
  } catch (error) {
    console.error("Error en la petición:", error);
  }
});
