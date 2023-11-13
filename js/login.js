
window.onload = function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario
        
        localStorage.clear(); //Limpia lo almacenado en el local

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let rememberMe = document.getElementById("remember").checked;
        
        sessionStorage.setItem("username", username); //Almacenamiento del nombre de usuario en el session

        
        if (username.length > 30 || password.length > 30) {
            alert("La contraseña no puede tener más de 30 caracteres."); //Longitud de usuario y contraseña
        } else {
            if (rememberMe) { //Checkbox para seleccionar almacenar nombre de usuario en local
                localStorage.setItem("username", username);
            } else {
                sessionStorage.setItem("username", username);
            }
            Swal.fire({ //Alerta de login exitoso
                title:'Bienvenid@ a E-mercado: ' + username,
                icon: 'success'
              }).then(() => { window.location.href = "index.html";
            })
        }
    });
};