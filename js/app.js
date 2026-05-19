// arrays
const paginasHome = [
    {titulo: "Inicio", url: "index.html"},
    {titulo: "Snacks", url: "pages/snacks.html"},
    {titulo: "Suplementos", url: "pages/suplementos.html"},
    {titulo: "Sin Tacc", url: "pages/Sin_Tacc.html"},
]
const paginas = [
    {titulo: "Inicio", url: "../index.html"},
    {titulo: "Snacks", url: "snacks.html"},
    {titulo: "Suplementos", url: "suplementos.html"},
    {titulo: "Sin Tacc", url: "Sin_Tacc.html"},
]
const productos = [
    {nombre: "Creatina ENA Naranja", precio: "$30.000", imagen: "productos/creatina ENA naranja.WebP", descripcion: "Creatina micronizada sabor naranja"},
    {nombre: "Proteína Whey ENA Chocolate", precio: "$53.000", imagen: "productos/whey ENA chocolate.WebP", descripcion: "Proteína WHEY con sabor a chocolate"},
    {nombre: "Creatina ENA Neutra", precio: "$30.000", imagen: "productos/creatina ENA neutra.WebP", descripcion: "Creatina micronizada sin sabor"},
]
console.log(productos);
// login
function login() {
    window.location.href = "../index.html";
}

// logout
function logout() {
    window.location.href = "login.html";
}
//navbar
const navbar = document.getElementById("navbar");

if (navbar) {
    const navLinks = document.createElement("ul");
    navLinks.className = "nav-links";
    
    paginas.forEach(pagina => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = pagina.url;
        a.textContent = pagina.titulo;
        li.appendChild(a);
        navLinks.appendChild(li);
    });
        
    // Insertar antes del botón de logout
    const logoutBtn = navbar.querySelector(".btn");
    navbar.insertBefore(navLinks, logoutBtn);
}
//navbar home
const navbarHome = document.getElementById("navbarHome");
if (navbarHome) {
    const navLinksHome = document.createElement("ul");
    navLinksHome.className = "nav-links";
    paginasHome.forEach(pagina => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = pagina.url;
        a.textContent = pagina.titulo;
        li.appendChild(a);
        navLinksHome.appendChild(li);
    });
    const logoutBtnHome = navbarHome.querySelector(".btn");
    navbarHome.insertBefore(navLinksHome, logoutBtnHome);
}
// productos
const productosContainer = document.getElementById("contenedor-productos");
if (productosContainer) {
    let ListaProductos = productos;
    const esIndex = window.location.pathname.includes("index.html");
    const rutaImagen = esIndex ? "" : "../";

    if (esIndex) {
        ListaProductos = productos.slice(0, 2);
    }
    ListaProductos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
            <img src="${rutaImagen}${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p class="description description-second">${producto.descripcion}</p>
            <p>${producto.precio}</p>    
            <div class="cantidad">
                <button class="menos">-</button>
                <span class="contador">1</span>
                <button class="mas">+</button>
            </div>        
            <button class="btn btn-second">Ver producto</button>
        `;
        let cantidad = 1;
        const contador = card.querySelector(".contador");
        const btnMas = card.querySelector(".mas");
        const btnMenos = card.querySelector(".menos");
        btnMas.addEventListener("click", () => {
            cantidad++;
            contador.textContent = cantidad;
        });
        btnMenos.addEventListener("click", () => {
            if (cantidad > 1) {
                cantidad--;
                contador.textContent = cantidad;
            }
        });
        productosContainer.appendChild(card);
    });
}
