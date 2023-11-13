document.addEventListener('DOMContentLoaded', function () {
  //modo dark del nav
  let nav = document.getElementById("navIndex")
  let mode = localStorage.getItem('mode')
  if (mode === 'dark') {
    nav.removeAttribute('style')
    nav.classList.add('bg-body-tertiary')
    nav.setAttribute('data-bs-theme', 'dark')
  }
  if (mode === 'light' || !mode) {
    nav.removeAttribute('data-bs-theme')
    nav.classList.remove('bg-body-tertiary')
    nav.setAttribute('style', 'background-color: rgba(255, 192, 74, 0.684);')
  }
  if (nav.hasAttribute('data-bs-theme')) {
    botonCambiar.classList.add('active')
  }
})

//Traigo las id de los input para guardarlos despues
let primerNombre = document.getElementById("primerNombre");
let segundoNombre = document.getElementById("segundoNombre");
let primerApellido = document.getElementById("primerApellido");
let segundoApellido = document.getElementById("segundoApellido");
let email = document.getElementById("email");
let telefono = document.getElementById("telefono");


document.addEventListener('DOMContentLoaded', function () {
  let datosUsuario = JSON.parse(localStorage.getItem("guardarDatos"));
  primerNombre.value = datosUsuario.nombre1;
  segundoNombre.value = datosUsuario.nombre2;
  primerApellido.value = datosUsuario.apellido1;
  segundoApellido.value = datosUsuario.apellido2;
  email.value = datosUsuario.email;
  telefono.value = datosUsuario.telefono;

})

if (localStorage.getItem("username") || sessionStorage.getItem("username")) {
  var emailInput = document.getElementById("email");
  emailInput.value = localStorage.getItem("username") || sessionStorage.getItem("username");
}

let form = document.getElementById("perfilUsuario");

// Agregar evento de clic al botón de guardar
form.addEventListener("submit", function () {
  // Obtener valores
  let guardarVariables = {
    nombre1: primerNombre.value,
    nombre2: segundoNombre.value,
    apellido1: primerApellido.value,
    apellido2: segundoApellido.value,
    email: email.value,
    telefono: telefono.value
  };

  localStorage.setItem("guardarDatos", JSON.stringify(guardarVariables));
  //localStorage.setItem ("file", reader.result);
  //localStorage.getItem ("file");
});

// Funcion para validar datos de Perfil de usuario
function validate() {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  })
}
document.addEventListener('DOMContentLoaded', function () {
  validate();
}, false);

// Selección de Elementos del DOM
const inputFile = document.getElementById('inputFile');
const imagenContainer = document.getElementById('imagenContainer');
const imagenPredeterminada = document.getElementById('imagenPredeterminada');

// Evento de Cambio en el Archivo de Entrada
inputFile.addEventListener('change', e => {
  // Lectura del Archivo Seleccionado
  const file = inputFile.files[0];
  const reader = new FileReader();

  // Evento de Carga del FileReader
  reader.addEventListener('load', () => {
    // Creación y Mostrado de la Nueva Imagen
    const img = new Image();
    img.src = reader.result;
    img.style.width = '100%';
    img.style.height = 'auto';

    // Gestión de Imágenes en el Contenedor
    while (imagenContainer.firstChild) {
      imagenContainer.removeChild(imagenContainer.firstChild);
    }
    imagenContainer.appendChild(img);

    // Almacenamiento Local de la Nueva Imagen
    localStorage.setItem("profilePic", reader.result);
  });

  if (file) {
    // Leer el archivo como URL
    reader.readAsDataURL(file);
  }
});

// Verificación y Carga de Imagen al Iniciar
const storedImage = localStorage.getItem('profilePic');
if (storedImage !== null && storedImage !== "") {
  // Creación y Mostrado de Imagen al Iniciar
  const img = new Image();
  img.src = storedImage;
  img.style.width = '100%';
  img.style.height = 'auto';

  // Gestión de Imágenes Predeterminadas
  imagenContainer.appendChild(img);
  if (imagenContainer.contains(imagenPredeterminada)) {
    imagenContainer.removeChild(imagenPredeterminada);
  }
} else {
  // Gestión de Imágenes Predeterminadas
  imagenContainer.appendChild(imagenPredeterminada);
}
