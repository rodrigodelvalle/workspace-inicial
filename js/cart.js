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
window.addEventListener('load', function () {
  // Llama a sumaDePrecios() u otras acciones que desees realizar al cargar la página.
  sumaDePrecios();
});

document.addEventListener("DOMContentLoaded", function () {
  const URL_info = 'https://japceibal.github.io/emercado-api/user_cart/25801.json';
  fetch(URL_info)
    .then(response => response.json())
    .then(data => {
      mostrarLista();
      if (document.getElementById("productosCart").innerHTML.trim() === "") {
        showCartInfo(data.articles[0]);
      }
      let cantidades = document.getElementsByClassName('cant');
      for (let i = 0; i < cantidades.length; i++) { //Recorre los elementos que tienen la clase "cant"
        cantidades[i].addEventListener('input', recalcular);       // Asignar el evento 'input' a todos los elementos con la clase 'cant' después de cargar el contenido
        cantidades[i].addEventListener('change', sumaDePrecios);
      }
    });

});
// document.addEventListener("DOMContentLoaded", () => {
//   let carrito = JSON.parse[localStorage.getItem("arrayProductos")];
//   getJSONData(URL_info).then(function (resultObj) {
//     const objet = carrito.findIndex((product) => product.id == resultObj.data.articles[0].id)
//     if (carrito == null) {   
//       console.log("hola")   
//       carrito.push(data.articles[0]);
//       mostrarLista(carrito)
//     } else { 
//       mostrarLista(carrito) }
//   })

function showCartInfo(data) {
  let htmlContentToAppend = `
    <tr>
      <td scope="row"><img class="img-fluid" src="${data.image}"></td>
      <td>${data.name}</td>
      <td class="precio">${data.currency} ${data.unitCost}</td>
      <td class="col"><input id="inputCart" type="number" min="1" class="cant form-control w-50 mx-auto" value="${data.count}"></td>
      <td class="res"><b>${data.currency} ${data.unitCost}</b></td>
      <td><button id="rodri" class="delete-item-btn"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
    </tr>
  `;
  document.getElementById("productosCart").innerHTML = htmlContentToAppend;
}

function mostrarLista() {
  // Obtener productos del localStorage
  let arrayProductos = JSON.parse(localStorage.getItem('arrayProductos'));
  if (arrayProductos) {
    let content = "";
    for (let i = 0; i < arrayProductos.length; i++) {
      content += `
        <tr id="item${i}">
          <td scope="row"><img class="img-fluid" src="${arrayProductos[i].images[0]}"></td>
          <td>${arrayProductos[i].name}</td>
          <td class="precio">${arrayProductos[i].currency} ${arrayProductos[i].cost}</td>
          <td class="col"><input type="number" min="1" class="cant form-control w-50 mx-auto inputCart" value="1"></td>
          <td class="res"><b>${arrayProductos[i].currency} ${arrayProductos[i].cost}</b></td>
          <td><button id=${arrayProductos[i].name} class="delete-btn" data-index="${i}"><i class="fa fa-trash" aria-hidden="true" onclick="borracion(${i})"></i></button></td> 
        </tr>
      `;
    } //se agregó el id=${arrayProductos[i].name arriba//
    document.getElementById("productosCart").innerHTML += content;

  }
}
function borracion(index) {                                                                //Función que obtiene el array de productos actual, elimina el valor "index" proporcionado por la misma etiqueta como variable
  var obtenidoDeLocalStorage = JSON.parse(localStorage.getItem('arrayProductos'))          //Posteriormente reemplaza el localstorage actual con el nuevo, luego elimina todos los valores de la etiqueta con id="productosCart"
  obtenidoDeLocalStorage.splice(index, 1)                                                   //Ejecuta la función mistrarLista() para volver a cargar los productos
  localStorage.setItem('arrayProductos', JSON.stringify(obtenidoDeLocalStorage))
  document.getElementById("productosCart").innerHTML = "";
  mostrarLista()

}

function convertirAUSD(precio, currency) {
  if (currency === 'UYU') {
    const tasaCambio = 0.0243; // La tasa de cambio real 
    return parseFloat(precio) * tasaCambio;
  } else {
    return parseFloat(precio);
  }
}

function recalcular() {
  let cantidades = document.getElementsByClassName('cant');
  let precios = document.getElementsByClassName('precio');
  let preciosTotales = document.getElementsByClassName('res');
  let sumaFinal = document.getElementById('totalForm');
  let sumaTotal = 0;

  for (let i = 0; i < cantidades.length; i++) {
    let cantidad = parseInt(cantidades[i].value);
    let precio = convertirAUSD(precios[i].textContent.replace(/\D/g, ''), precios[i].textContent.split(' ')[0]); // Obtener la moneda 
    let precioTotal = cantidad * precio;
    sumaTotal += precioTotal;
    precioTotal = Math.floor(precioTotal);
    preciosTotales[i].innerHTML = "<b>USD " + precioTotal + "</b>"; // Siempre muestra en USD
  }

  sumaFinal.innerHTML = "USD " + sumaTotal.toFixed(2); // Muestra el subtotal en USD
}

function sumaDePrecios() {
  let cantidades = document.getElementsByClassName('cant');
  let precios = document.getElementsByClassName('precio');
  let sumaFinal = document.getElementById('totalForm');
  let precioFinal = document.getElementById('precioFinal');
  let sumaTotal = 0;

  for (let i = 0; i < cantidades.length; i++) {
    let valorUSD = convertirAUSD(precios[i].textContent.replace(/\D/g, ''), precios[i].textContent.split(' ')[0]);
    let cantidad = parseInt(cantidades[i].value);
    let currencySymbol = precios[i].textContent.split(' ')[0];
    let precioTotal = cantidad * valorUSD;
    sumaTotal += precioTotal;
  }

  sumaFinal.innerHTML = "USD " + sumaTotal;

  function actualizarSubtotal() {
    let subtotal = 0;

    for (let i = 0; i < cantidades.length; i++) {
      let valorUSD = convertirAUSD(precios[i].textContent.replace(/\D/g, ''), precios[i].textContent.split(' ')[0]);
      let cantidad = parseInt(cantidades[i].value);
      subtotal += cantidad * valorUSD;
    }

    return subtotal;
  }

  function actualizarPrecioFinal() {
    let subtotal = actualizarSubtotal();
    let premium = document.getElementById("premium");
    let express = document.getElementById("express");
    let estandar = document.getElementById("estandar");
    let envio = 0;

    if (premium.checked) {
      envio = subtotal * 0.15;
    } else if (express.checked) {
      envio = subtotal * 0.07;
    } else if (estandar.checked) {
      envio = subtotal * 0.05;
    }

    let total = subtotal + envio;

    // Actualizar los elementos HTML
    let sumaFinal = document.getElementById('totalForm');
    let precioFinal = document.getElementById('precioFinal');
    let valorEnvio = document.getElementById('envio');

    sumaFinal.innerHTML = "USD " + subtotal.toFixed(2);
    precioFinal.innerHTML = "<b>USD " + total.toFixed(2) + "</b";
    valorEnvio.innerHTML = "USD " + envio.toFixed(2);
  }

  // Escuchar cambios en las cantidades en tiempo real
  for (let i = 0; i < cantidades.length; i++) {
    cantidades[i].addEventListener('input', () => {
      actualizarPrecioFinal();
    });
  }

  // Escuchar cambios en las opciones de envío
  let premium = document.getElementById("premium");
  let express = document.getElementById("express");
  let estandar = document.getElementById("estandar");

  premium.addEventListener('click', () => {
    actualizarPrecioFinal();
  });

  express.addEventListener('click', () => {
    actualizarPrecioFinal();
  });

  estandar.addEventListener('click', () => {
    actualizarPrecioFinal();
  });

  // Inicializar el precio final y subtotal
  actualizarPrecioFinal();
}

// Llama a la función para inicializar todo
sumaDePrecios();

premium.addEventListener('click', () => {
  let valorEnvio = document.getElementById('envio');
  let envioPremium = sumaTotal * 0.15;
  valorEnvio.innerHTML = "USD " + envioPremium.toFixed(2);
  total = sumaTotal + envioPremium;
  precioFinal.innerHTML = "<b>" + "USD " + total.toFixed(2) + "</b>";

})
express.addEventListener('click', () => {
  let valorEnvio = document.getElementById('envio');
  let envioExpres = sumaTotal * 0.07
  valorEnvio.innerHTML = "USD " + envioExpres.toFixed(2)
  total = sumaTotal + envioExpres
  precioFinal.innerHTML = "<b>" + "USD " + total.toFixed(2) + "</b>";

})
estandar.addEventListener('click', () => {
  let valorEnvio = document.getElementById('envio');
  let envioEstandar = sumaTotal * 0.05
  valorEnvio.innerHTML = "USD " + envioEstandar.toFixed(2)
  total = sumaTotal + envioEstandar

  precioFinal.innerHTML = "<b>" + "USD " + total.toFixed(2) + "</b>";
})

// Funcion para mostrar el modal compras//
document.getElementById("openModal").addEventListener("click", function () {
  document.getElementById("paymentModal").style.display = "block";
});
// Funcion para cerrar el modal compras//
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("paymentModal").style.display = "none";
  localStorage.removeItem('selectedMethod');
});
// Funcion para guardar los datos de la compra //
document.getElementById("paymentMethod").addEventListener("change", function () {
  var selectedMethod = this.value;

  document.getElementById("creditCardDetails").classList.add("hidden");
  document.getElementById("bankTransferDetails").classList.add("hidden");
  document.getElementById("seleccionarPago").classList.add("hidden");
  if (selectedMethod === "tarjeta") {
    document.getElementById("creditCardDetails").classList.remove("hidden");
    document.getElementById("cardNumber").disabled = false;
    document.getElementById("expirationDate").disabled = false;
    document.getElementById("codigoSeguridad").disabled = false;
    document.getElementById("bankAccount").disabled = true;
    document.getElementById("btnn").disabled = false;
    localStorage.setItem('selectedMethod', selectedMethod);
  } else if (selectedMethod === "transferencia") {
    document.getElementById("bankTransferDetails").classList.remove("hidden");
    document.getElementById("cardNumber").disabled = true;
    document.getElementById("expirationDate").disabled = true;
    document.getElementById("codigoSeguridad").disabled = true;
    document.getElementById("bankAccount").disabled = false;
    document.getElementById("btnn").disabled = false;
    localStorage.setItem('selectedMethod', selectedMethod);
  } else if (selectedMethod === "seleccione") {
    document.getElementById("btnn").disabled = true;
    document.getElementById("bankTransferDetails").classList.remove;
    document.getElementById("creditCardDetails").classList.remove;

    Swal.fire({
      icon: "error",
      title: "Selecciona una opción de pago",
    });
  }
});

function mostrarPago() {
  var selectedMethod = localStorage.getItem('selectedMethod');
  var pagoSeleccionado = document.getElementById("titleFormaDePago");

  if (selectedMethod === "tarjeta") {
    pagoSeleccionado.innerHTML = "Medio de Pago: Tarjeta de crédito";
  } else if (selectedMethod === "transferencia") {
    pagoSeleccionado.innerHTML = "Medio de Pago: Transferencia bancaria";
  }
}
mostrarPago();

document.getElementById("paymentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Recopila los datos del formulario

  var cardNumber = document.getElementById("cardNumber").value;
  var expirationDate = document.getElementById("expirationDate").value;
  var bankAccount = document.getElementById("bankAccount").value;
  var codigoSeguridad = document.getElementById("codigoSeguridad").value;

  // Inicializamos una cadena vacía para almacenar el texto de la alerta
  if ((cardNumber && expirationDate && codigoSeguridad) || bankAccount) {
    Swal.fire({
      icon: "success",
      title: "Datos de pago guardados",
    });
    setTimeout(() => {
      window.location.href = "../cart.html";
    }, 2000);

  } else {
    Swal.fire({
      icon: "warning",
      title: "No se han ingresado todos los campos requeridos",
    });
  }
});
document.getElementById("paymentModal").style.display = "none";

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})()

//Validacion de radio buttons
function envios() {
  const envios = document.getElementsByName("env");
  if (localStorage.getItem("paymentForm") === null) {  // verifica que haya algo en el local, ya sea tarjeta o transferencia y si no hay debería mostrar el mensaje
    let content = "";
    content +=
    `
    <div class="text-danger">
            Por favor, ingrese un metodo de pago.
          </div>
    `
    document.getElementById("titleFormaDePago").innerHTML = content;
  } else {
  // Itera a través de los botones de radio
  for (let envio of envios) {
    // Verifica si el botón de radio está marcado
    if (envio.checked) {
      // Si está marcado, aplica la clase "is-valid" y quita la clase "is-invalid"
      envio.classList.remove("is-invalid");
      envio.classList.add("is-valid");
    } else {
      // Si no está marcado, quita la clase "is-valid" y aplica la clase "is-invalid"
      envio.classList.remove("is-valid");
      envio.removeAttribute('class');
    }
  }
}}



  const envioForm = document.getElementById("formDatosEnvio");
  const paymentForm = document.getElementById("paymentForm");
  envioForm.addEventListener('submit', function (event){
  
    if (!paymentForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes completar todos los campos.',
      })
    } else if (!envioForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes completar todos los campos.',
      })
    } else {
   alert("Genial, tu compra se realizó con exito.")
    }
    
   
  })

  let botonconfirmar = document.getElementById('btnn');
  let metodoDePago = document.getElementById("titleFormaDePago")
  let modal = document.getElementById('paymentModal');
  botonconfirmar.addEventListener('click', function (event){
    if(paymentForm.checkValidity()){
      Swal.fire({
        icon: 'success',
        title: 'Genial',
        text: 'Asignaste correctamente un metodo de pago',
      })
      metodoDePago.classList.remove('text-danger')
      mostrarPago()
      modal.style.display = "none";

    }
    if (!envioForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
     
    
    }else {
      
      event.preventDefault()
    }
    
    
  })