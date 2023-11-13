document.addEventListener("DOMContentLoaded", function () {
    /*Se ejecuta al iniciar la página */
    const catID = localStorage.getItem("catID");
    const URL_PRODUCTS = "https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json";
    let productsCar = document.getElementById("containerItems");
    let nameCat = "";

    //Array que contiene elementos obtenidos de api (fetch)
    //let productsArray = [];


    fetch(URL_PRODUCTS)
        /*Se realiza un fetch para obtener los datos del API */
        .then(res => res.json())
        .then(data => {
            originalData = data.products;
            nameCat = data.name;
            namesCategory(data);
            showCategory(originalData);

        });

        /*Esta fracción de código se encarga de regir el modo Dark y Light del navbar */
        let nav = document.getElementById("navIndex")
        let mode = localStorage.getItem('mode')
        if(mode === 'dark'){
            nav.removeAttribute('style')    
            nav.classList.add('bg-body-tertiary')
            nav.setAttribute('data-bs-theme', 'dark')
            
        }
        if(mode === 'light'  || !mode){
            nav.removeAttribute('data-bs-theme')
            nav.classList.remove('bg-body-tertiary')
            nav.setAttribute('style','background-color: rgba(255, 192, 74, 0.684);')
        }
        if(nav.hasAttribute('data-bs-theme')){
            botonCambiar.classList.add('active')
        }
});

  let originalData = [];

    function namesCategory(items) {
        /*La función permite mostrar la categoria con el agregado de una etiqueta h1*/
        let names = document.getElementById("categoryName")
        let htmlContentToAppend = ` <h1>${items.catName}</h1>
    <p class="lead">Verás aquí lo que estas buscando.</p> `
        names.innerHTML = htmlContentToAppend
    }

    function showCategory(itemsArray) {
        /*Esta función permite mostrar a los items individuales mediante el agregado de etiquetas con variables obtenidas desde el fetch */
        this.productsArray = itemsArray;
        let htmlContentToAppend = "";
        for (let i = 0; i < itemsArray.length; i++) {
            htmlContentToAppend += `
                <div onclick="setProductId(${itemsArray[i].id})" class="list-group-item list-group-item-action cursor-active">
                    <div class="row">
                        <div class="col-3">
                            <img src="${itemsArray[i].image}" alt="${itemsArray[i].description}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">${itemsArray[i].name} - ${itemsArray[i].currency}  ${itemsArray[i].cost}</h4>
                                <small class="text-muted">${itemsArray[i].soldCount} artículos</small>
                            </div>
                            <p class="mb-1">${itemsArray[i].description}</p>
                        </div>
                    </div>
                </div>
                `
        }

        document.getElementById("containerItemsProducts").innerHTML = htmlContentToAppend;
    }
    let botonFiltrarRango = document.getElementById("rangeFilterCount"); //Establece el botón de filtrado de precio máximo y mínimo
    botonFiltrarRango.addEventListener("click", function () {
        /*Función que regula el filtrado de precio máximo y mínimo */
        const minPrice = document.getElementById("rangeFilterCountMin").value;
        const maxPrice = document.getElementById("rangeFilterCountMax").value;
        let filtrarPrecio = originalData.filter(product => {
            if (minPrice !== undefined && maxPrice !== undefined) {
                return product.cost >= minPrice && product.cost <= maxPrice;
            } else if (minPrice !== undefined) {
                return product.cost >= minPrice;
            } else if (maxPrice !== undefined) {
                return product.cost <= maxPrice;
            }
            return true;
        });
        filtrarPrecio.sort((a, b) => a.cost - b.cost);  //sort que regula el orden de los productos
        showCategory(filtrarPrecio);

    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        /*Función que regula el botón "limpiar" de la página. Al hacer click, se limpiarán los valores "minPrice" y "maxPrice". 
        Posteriormente ejecuta showCategory para volver a mostrar los items */
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;
        showCategory(originalData);
    });

    const searchInput = document.getElementById("productSearch"); //Se crea la constante searchInput que tomará el valor de string colocado en la barra buscador

   
    searchInput.addEventListener("input", function () {
        /*Esta función permite buscar items por su nombre y descripción. */
        const searchText = searchInput.value.toLowerCase().trim();  //Tomará el valor escrito en la barra de busqueda. Se le sacará los espación de los extremos y se pasará a minúscula.

        let filteredProducts = originalData.filter(product => {
            const productName = product.name.toLowerCase();
            const productDescription = product.description.toLowerCase();
            return productName.includes(searchText) || productDescription.includes(searchText);
        });

        showCategory(filteredProducts);   //Ejecuta la función para volver a mostrar los resultados

    });

    /*Creación de 3 botones para su uso posterior en funciones */
    let btnDesc = document.getElementById("sortByCount1");
    let btnAsc = document.getElementById("sortByCount2");
    let relevant = document.getElementById("sortByRel");

    btnDesc.addEventListener('click', function () {
        /*Botón que al hacer click ordenará de manera descendente el precio (El mayor precio queda primero)  */
        let itemsArray = originalData.slice();

        itemsArray.sort(function (a, b) {
            return b.cost - a.cost;
        });

        showCategory(itemsArray);
    });

    btnAsc.addEventListener('click', function () {
        /*Botón que al hacer click ordenará de manera ascendente el precio (El menor precio queda primero)  */
        let itemsArray = originalData.slice();

        itemsArray.sort(function (a, b) {
            return a.cost - b.cost;
        });

        showCategory(itemsArray);
    });

    relevant.addEventListener('click', function () {
        /*Botón que al hacer click ordenará de manera descendente por número de productos relacionados (El mayor precio queda primero)  */
        let itemsArray = originalData.slice();

        itemsArray.sort(function (a, b) {
            return b.soldCount - a.soldCount;
        });

        showCategory(itemsArray);
    });

function setProductId(id) {
    /*Permite el acceso de items al hacer click en etiquetas mediante "onlick" dentro de la etiquetas del .html.
    El objeto seteado en local storage se utilizará como varible dentro del onclick */
    localStorage.setItem("IdProduct", id);
    window.location = "product-info.html";
}

