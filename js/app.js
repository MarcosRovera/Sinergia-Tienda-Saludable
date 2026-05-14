// arrays
const paginasHome = [
    {titulo: "Inicio", url: "index.html"},
    {titulo: "Snacks", url: "pages/snacks.html"},
    {titulo: "Suplementos", url: "pages/suplementos.html"},
    {titulo: "Sin Tacc", url: "pages/Sin_Tacc.html"},
]
const paginas = [
    {titulo: "Inicio", url: "../index.html"},
    {titulo: "Snacks", url: "../pages/snacks.html"},
    {titulo: "Suplementos", url: "../pages/suplementos.html"},
    {titulo: "Sin Tacc", url: "../pages/Sin_Tacc.html"},
]
const productos = [
    {nombre: "Creatina ENA Naranja", precio: "$30.000", imagen: "../productos/creatina ENA naranja.WebP"},
    {nombre: "Proteína Whey ENA Chocolate", precio: "$53.000", imagen: "../productos/whey ENA chocolate.WebP"},
    {nombre: "Creatina ENA Neutra", precio: "$30.000", imagen: "../productos/creatina ENA neutra.WebP"},
]
console.log(productos);
// login
function login() {
    window.location.href = "../index.html";
}

// logout
function logout() {
    window.location.href = "pages/login.html";
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
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p>${producto.precio}</p>
            <button class="btn btn-second">Ver producto</button>
        `;
        productosContainer.appendChild(card);
    });
}