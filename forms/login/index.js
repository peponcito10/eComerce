/**
 * EN ESTE ARCHIVO JS MANEJAMOS LA LÓGICA DEL LOGIN INDEX.HTML QUE NOS PERMITE:
 * -VALIDAR USUARIO
 * -VALIDAR CONTRASEÑA
 * -HACER LLAMADO POST
 * -INICIAR SESIÓN
 * -OBTENER DATOS DEL USUARIO
 */

const loginForm = document.getElementById("form_login");



// ESCUCHAMOS EL SUBMIT DEL FORM
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const formData = new FormData(loginForm);

// HACEMOS LLAMADO POST
  try {
    const res = await fetch(`http://localhost/product/servicioweb/login_user.php`, {
      method: "POST",
      body: formData,
    });

// OBTENEMOS RESPUESTA DEL POST
    const data = await res.json();
    console.log("RESPUESTA JSON:", data);

    if(data.status === "USER_INVALID"){

        return
    }

    if(data.status === "PASSWORD_INVALID"){

        return
    }

    if(data.status === "SUCCESS"){
    localStorage.setItem("userData",JSON.stringify(data.data));
        console.log("xd")
        window.location.replace("/product/")
    return
    }
  } catch (error) {
    console.error("Error en la petición:", error);
  }
});
