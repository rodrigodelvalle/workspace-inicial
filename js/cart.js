document.addEventListener('DOMContentLoaded', function () {
  //modo dark y light del nav
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
  // Llama a sumaDePrecios() al cargar la página.
  sumaDePrecios();
});

document.addEventListener("DOMContentLoaded", function () {
  const URL_info = 'https://japceibal.github.io/emercado-api/user_cart/25801.json';
  fetch(URL_info)
    .then(response => response.json())
    .then(data => {
      mostrarLista(); 
      //El if chequea si el inner html esta vacío, 
      //si esta vacio llama a la función showCartInfo en data.articles en la posición 0
      if (document.getElementById("productosCart").innerHTML.trim() === "") {
        showCartInfo(data.articles[0]);
      }
      let cantidades = document.getElementsByClassName('cant');
      for (let i = 0; i < cantidades.length; i++) { //Recorre los elementos que tienen la clase "cant"
        cantidades[i].addEventListener('input', recalcular);       // Asignar el evento 'input' a todos los elementos con la clase 'cant' después de cargar el contenido
        cantidades[i].addEventListener('change', sumaDePrecios); //A esos eventos se le ejcuta las funciones recalcular y sumaDePrecios
      }
    });

});

//Función para agregar productos al carrito de compras
//Crea a una fila la agrega a la tabla de los productos  
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

//Función que obtiene el arreglo de los productos del carrito que estan en el localStorage
//Recorre el arreglo con un for y para cada producto del arreglo crea una fila con la información y lo agrega a la tabla 
function mostrarLista() {
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
          <td><button id=${arrayProductos[i].name} class="delete-btn" data-index="${i}"><i class="fa fa-trash" aria-hidden="true" onclick="borrado(${i})"></i></button></td> 
        </tr>
      `;
    } //se agregó el id=${arrayProductos[i].name arriba//
    document.getElementById("productosCart").innerHTML += content;

  }
}

 //Función que obtiene el array de productos actual, elimina el valor "index" proporcionado por la misma etiqueta como variable
function borrado(index) {                 
   //Reemplaza el localstorage actual con el nuevo, luego elimina todos los valores de la etiqueta con id="productosCart"                                              
  var obtenidoDeLocalStorage = JSON.parse(localStorage.getItem('arrayProductos')) 
  //Ejecuta la función mostrarLista() para volver a cargar los productos        
  obtenidoDeLocalStorage.splice(index, 1)                                                   
  localStorage.setItem('arrayProductos', JSON.stringify(obtenidoDeLocalStorage))
  document.getElementById("productosCart").innerHTML = "";
  mostrarLista()

}

//Función que permite la conversión de precios entre pesos UYU a dólares estadounidenses.
function convertirAUSD(precio, currency) {
  if (currency === 'UYU') {
    const tasaCambio = 0.0243; // La tasa de cambio real 
    return parseFloat(precio) * tasaCambio;
  } else {
    return parseFloat(precio);
  }
}

// Función que suma todos los costos en la tabla y devuelve un string con el total
function recalcular() {
  let cantidades = document.getElementsByClassName('cant');
  let precios = document.getElementsByClassName('precio');
  let preciosTotales = document.getElementsByClassName('res');
  let sumaFinal = document.getElementById('totalForm');
  let sumaTotal = 0;

//Recorre todos los items con la clase 'cant', multiplica la cantidad que hay de un producto por su precio
//para obtener el precio final de un producto, luego suma los totales de multiples productos para saber el precio final del carrito 
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

//Función que suma los precios en "Costos"
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

  //Función que actualiza el Subtotal de los costos
  function actualizarSubtotal() {
    let subtotal = 0;

    for (let i = 0; i < cantidades.length; i++) {
      let valorUSD = convertirAUSD(precios[i].textContent.replace(/\D/g, ''), precios[i].textContent.split(' ')[0]);
      let cantidad = parseInt(cantidades[i].value);
      subtotal += cantidad * valorUSD;
    }

    return subtotal;
  }

  //Función que obtiene el subtotal de costos y calcula el precio final según el tipo de envio
  //Calcula el valor del precio de cada envio
  function actualizarPrecioFinal() {
    let subtotal = actualizarSubtotal();
    let premium = document.getElementById("premium");
    let express = document.getElementById("express");
    let estandar = document.getElementById("estandar");
    let envio = 0;

    //Calcula el envio según que radio button este presionado
    if (premium.checked) {
      envio = subtotal * 0.15;
    } else if (express.checked) {
      envio = subtotal * 0.07;
    } else if (estandar.checked) {
      envio = subtotal * 0.05;
    }

    let total = subtotal + envio;

    // Actualiza los elementos en el HTML
    let sumaFinal = document.getElementById('totalForm');
    let precioFinal = document.getElementById('precioFinal');
    let valorEnvio = document.getElementById('envio');

    sumaFinal.innerHTML = "USD " + subtotal.toFixed(2);
    precioFinal.innerHTML = "<b>USD " + total.toFixed(2) + "</b";
    valorEnvio.innerHTML = "USD " + envio.toFixed(2);
  }

  // Actualiza los cambios en las cantidades en tiempo real
  for (let i = 0; i < cantidades.length; i++) {
    cantidades[i].addEventListener('input', () => {
      actualizarPrecioFinal();
    });
  }

  let premium = document.getElementById("premium");
  let express = document.getElementById("express");
  let estandar = document.getElementById("estandar");

  //Al hacer click en los radio buttons ejecuta la función, agregando el evento correspondiente  
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

// Funcion para mostrar el modal compras
document.getElementById("openModal").addEventListener("click", function () {
  document.getElementById("paymentModal").style.display = "block";
});
// Funcion para cerrar el modal compras
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("paymentModal").style.display = "none";
  localStorage.removeItem('selectedMethod');
});
// Funcion para guardar los datos de la compra
document.getElementById("paymentMethod").addEventListener("change", function () {
  var selectedMethod = this.value;

  //Estructuras if y else if que controlan cual opción esta seleccionada en la modal 
  //Dependiendo de la opción oculta los elementos de la otra opción
  //Si no hay niguna opción seleccionada manda una alerta para que se seleccione el metodo de pago 
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

//Dependiendo que opción selecciona muestra en pantalla el nombre del metodo de pago
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

//Chequea algunas validaciones del formulario del modal 
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

//Estructura de boostrap que valida los formularios, si no se cumple con las validaciones evita el envio del formulario
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

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


//Función que chequea si el modal esta completado antes de enviar el formulario 
function envios() {
    document.getElementById("titleFormaDePago").classList.add("text-danger");
    document.getElementById("titleFormaDePago").innerHTML = "Por favor, ingrese un metodo de pago.";
  }

//Funcion para validar que se haya seleccionado una opcion en el select del modal 
//Aporte feedback a traves de alertas 
const envioForm = document.getElementById("formDatosEnvio");
const paymentForm = document.getElementById("paymentForm");

envioForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  event.stopPropagation();

  if (!paymentForm.checkValidity()) {
    envios();
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Debes completar todos los campos.',
    });
  } else if (!envioForm.checkValidity()) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Debes completar todos los campos.',
    });
  } else {
    Swal.fire({
      title: 'Genial',
      text: 'Tu compra se realizó con éxito.',
      icon: 'success',
      showCancelButton: true, 
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
    //Funcion de sweet alert para que espere a colocar ok antes de enviarse el formulario
    //Espera a que se resuelva la promesa del alert con una funcion asincronica y espera un tiempo antes de enviar el formulario

        // Una simulación de espera de 1000 milisegundo 
        await new Promise(resolve => setTimeout(resolve, 1000));
        //Aqui se envia el form
        envioForm.submit();
      }
    });
  }
});


  //Aporte feedback a traves de alertas 
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
envios();
   
    }else {
      
      event.preventDefault()
    }
    
  })