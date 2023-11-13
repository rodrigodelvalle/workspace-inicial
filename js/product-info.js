document.addEventListener('DOMContentLoaded', () => {  
    /*Funcion iniciada al cargar la página y regirá el navbar, se ejecutará la función para mostrar productos, y regirá tema oscuro y claro.
    Requiere la variable idProduct para fijar otras dos variables adicionales: "URL_ID_PRODUCTS", "PRODUCT_INFO_COMMENTS_URL". 
    Estas a su vez se utilizan para realizar fetchs. Y se ejecutan las funciones "showProducts" que mostrara los datos delk fetch dentro de la página y la función "shownComments" que mostrará los comentarios dentro de la página.
    Se estable variables "nav" y "mode" y se utilizan para el tono de la navbar . "mode" se establece desde contenido de local storage para modo Light y Dark. */                                                                        
    let idProduct = localStorage.getItem("IdProduct");                                                                             //Se define la variable idProduct para multiples usos: generar el URL, buscar comentarios, etc
    let URL_ID_PRODUCTS = "https://japceibal.github.io/emercado-api/products/" + idProduct + ".json";
    const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/" + idProduct + ".json";
    fetch(URL_ID_PRODUCTS)
        .then(res => res.json())
        .then(data => showProduct(data));

    fetch(PRODUCT_INFO_COMMENTS_URL)
        .then(res => res.json())
        .then(data => showComments(data));
    
    /*Sección que se ejecuta para cargar los prodcutos relacionados*/    
    showRelatedProducts();    

    //Sección que regula el modo ocuro y claro
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

    
});


document.addEventListener("DOMContentLoaded", () => {
    /*Esta función permitira cargar productos en el carrito.
    Esta funcion generá una variable "arrayProductos" con el contenido del localstorage. Depues, al accionase al añadir al carrito en la página.
    Se generá variable constante "productExists" que sera un booleano TRUE si el el objeto se encuentra dentro de "arrayProductos" y FALSE si no se encuentra en "arrayproductos" .
    Si el booleano es FALSE, se agregará el rpducto, caso contrario, se retornará la leyenda que "Ya se encuentra en el carrito" */
    document.getElementById("comprar").addEventListener("click", () => {
        let idProduct = localStorage.getItem("IdProduct"); 
        if (idProduct) {
            let URL = "https://japceibal.github.io/emercado-api/products/" + idProduct + ".json";
            fetch(URL)
                .then(res => {
                    if (!res.ok) {                                                      //If agregado para atrapar errores
                        throw new Error('Error en la solicitud fetch');
                    }
                    return res.json();
                })
                .then(data => {
                    let arrayProductos = JSON.parse(localStorage.getItem('arrayProductos')) || [];    //generación de variable "arrayProductos"
                    
            
                    // Verificar si el producto ya está en el carrito 
                    const productExists = arrayProductos.some(product => product.id === data.id);
                    if (!productExists) {
                        arrayProductos.push(data);
                        localStorage.setItem('arrayProductos', JSON.stringify(arrayProductos));                           //se pushea la variable modificada al localstorage
                        console.log(arrayProductos);
                    } else {
                        Swal.fire({
                            title:"Ya se encuentra en el carrito"

                          })
                    }


                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.error('IdProduct no encontrado en el almacenamiento local.');
        }
    });
});


function showProduct(product) {
    /*.Función báscia que muestra los productos mediante la creación de etiquetas dentro de DOM. 
    Esta se ejecuta durante el fetch al cargarse la página.
    Requiere el argumento "product" que sera brindado por el fetch. Comienza por crear las varibles "htmlContentToAppend" y "htmlContentToAppend2" que se llenarán con el contenido del fecth.
    Teniendo estas variables, se agregarán al innerHTML en el id="carrusel" y "containerItemsInfoProduct" */
    let htmlContentToAppend = "";
    htmlContentToAppend += `
    <main class="pb-5">
        <div class="text-center p-4">
            <h2>${product.name}</h2><br><br><hr>
        </div>
            <div class="row">
                <h4>Precio</h4> 
                    <p class="mb-1">${product.currency}  ${product.cost}</p><br><br>
                <h4>Descripción</h4> 
                    <p class="mb-1">${product.description}</p><br><br>
                <h4>Categoría</h4> 
                    <p class="mb-1">${product.category}</p><br><br>
                <h4>Cantidad de vendidos</h4> 
                    <p class="mb-1">${product.soldCount}</p><br><br>
                <h4>Imágenes ilustrativas</h4> 
        `;

    let carrusel = document.getElementById("carrusel");
    let htmlContentToAppend2 = "";

    htmlContentToAppend2 += `
                <div class="carousel-inner">
                <div class="carousel-item active">
                        <img src="${product.images[0]}" class="d-block w-100" >
                </div>
                <div class="carousel-item ">
                <img src="${product.images[1]}" class="d-block w-100" >
                </div>
               <div class="carousel-item ">
             <img src="${product.images[2]}" class="d-block w-100" >
            </div>
            <div class="carousel-item ">
            <img src="${product.images[3]}" class="d-block w-100" >
               </div>
                </div>
                `;

    htmlContentToAppend += `
            </div>
        </div>
        `;

    document.getElementById("containerItemsInfoProduct").innerHTML = htmlContentToAppend;
    carrusel.innerHTML = htmlContentToAppend2;
};

function showRelatedProducts() {
    /*Función muestra los productos relacionados. 
    Se establecen las variables "idProduct"(basada en localstorage), "catID"(basada en la categoria), "URL" (el URl de la página).
    Se ejecuta un fetch. Dentro de este fetch se establece la variable "content" de manera vacía para llenarla con contenido de tipo etiquetas, y la variable "productosMostrados" que será el numero de productos relacionados a mostrar.
    La variable "productsRelated" llenado con los valores y etiquetas se agregará en el innerHTML.*/
    let idProduct = localStorage.getItem("IdProduct");
    let catID = localStorage.getItem("catID");
    let URL = "https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json";

    fetch(URL)
        .then(res => res.json())
        .then(data => {
            let content = "";
            let productosMostrados = 4;                                                                     // "productosMostrados" regira el numero de items relaciodos mostrados en la página
            for (let i = 0; i < productosMostrados && i < data.products.length; i++) {
                let product = data.products[i];
                if (parseInt(idProduct) !== product.id) {   //Se modifico a style="width: 30vw; para el content //
                    content += `
                        <div class="card" style="width: 30vw; cursor: pointer; display: inline-block"> 
                            <div onclick="setProductId(${product.id})"">
                                <img src="${product.image}" class="card-img-top">
                                    <div class="card-body">
                                        <h5 class="card-title">${product.name}</h5>
                                    </div>
                            </div>    
                        </div>               
                    `;
                }
            }
            document.getElementById("productsRelated").innerHTML = content;
        })
        .catch(error => {                                                                 //agregado para captar el error en caso de no obtener respuesta o problemas con el fetch
            console.error("Error al cargar los productos relacionados:", error);
        })
}


function showComments(itemsArray) {
    /* Función que agrega los comentarios del producto. 
    Se creará la variable "divComent", y dos constantes que depresentarán las estrelas ("iconEstrellas") o su ausencia ("icoNoEstrella").
    El número máximo de estrellas obtenibles es el valor de la constante "total", en caso de modificarse el numero de estrellasen un futuro. Este valor debe de correlacionarse con el valor máximo obtenible en el fetch*/
    let divComent = document.getElementById("containerItemsInfo")
    const iconEstrella = '<i class="fas fa-star" style="color: #ffc800;"></i>';
    const icoNoEstrella = '<i class="far fa-star" style="color: #ffc800;"></i>';
    const total = 5;                                            //Variable que establece el numero máximo de estrellas agregables que tiene que corresponderse con el númeor de estrellas posibles obtenidas en el fetch
    let htmlContentToAppend = "";
    for (let i = 0; i < itemsArray.length; i++) {              //recorrerá un valor entre 0 y el valor de llargo del array de items menos una unidad.
        let estrellas = "";                                     //En todos los casos se establecera la variable estrellas de manera vacía.
        for (let j = 1; j <= total; j++) {                      //"for" recorrerá un valor entre 1 y 5.
            if (j <= itemsArray[i].score) {                     //Si el valor coincide con uno de estos. Se agregará el valor de la variable(imagen) "iconEstrella" a la varible "estrella"
                estrellas += iconEstrella;
            } else                                              //Caso contrario, "estrella" será la variable "iconEstrella"(imagen)
                estrellas += icoNoEstrella;                     
        }

        htmlContentToAppend += `
        <div>
            <div>
            <div id="coment">
                <div class="d-flex w-100 justify-content-between">
                <p class="mb-1">${itemsArray[i].user}&#160 &#160${estrellas}</p>
                    <p class="mb-1">${itemsArray[i].dateTime} </p>
                </div>
                <br>
                <p class="mb-1">${itemsArray[i].description}</p>
            </div> 
        </div>    
        </div>
       
    `
    }

    divComent.innerHTML = htmlContentToAppend;
}



let boton = document.getElementById("enviar"); //se establece la variable boton que se obtiene de la etiqueta con id="enviar"

boton.addEventListener("click", function () {
    /*La función se utiliza para añadir comentarios por el usuario.
    La función funcionará al ocurrir un click en el botón con id="enviar". Se establecen varias variables "estrellas", "iconEstrella", "icoNoEstrella", "total", "commentarie1", "score", "nom1", "fecha". 
    Se creará el objeto "data2" con ayuda de algunas variables para su trabajo. Se determina el valor de la variable "estrella" y se agrega el valor de la imagen necesaria a la variable "estrella"(fuera del objeto y no confundirse con estrellas dentro del objeto).
    Se agrega el contenido de la etiqueta con los datos a la variable "htmlContentAppend" y se pushea al innerHTML en la id="containerItemInfo" */ 
    let estrellas = "";
    let iconEstrella = '<i class="fas fa-star" style="color: #ffc800;"></i>';
    let icoNoEstrella = '<i class="far fa-star" style="color: #ffc800;"></i>';
    let total = 5;
    let commentarie1 = document.getElementById("floatingTextarea2");
    let score = document.getElementById("select");
    let nom1 = localStorage.getItem("username");
    let fecha = dates();
    let htmlContentToAppend = "";
    let data2 = { user: nom1, estrellas: score.value, dateTime: fecha, description: commentarie1.value }
    for (let j = 1; j <= total; j++) {
        if (j <= data2.estrellas) {
            estrellas += iconEstrella;
        } else
            estrellas += icoNoEstrella;
    }

    htmlContentToAppend += `
  <div>
      <div>
      <div id="coment">
          <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">${data2.user}&#160 &#160${estrellas}</p>
              <p class="mb-1">${data2.dateTime} </p>
          </div>
          <br>
          <p class="mb-1">${data2.description}</p>
      </div> 
  </div>    
  </div>
 
`
    document.getElementById("containerItemsInfo").innerHTML += htmlContentToAppend;

    //Se límpian los valores 
    commentarie1.value = "";
    score.value = "";
});


function dates() {
    /*Función utilizada para establecer el formato de fecha para comentarios y misceláneos*/
    let date = new Date();
    let current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    let current_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let dateTime = current_date + " " + current_time;
    return dateTime;

}




