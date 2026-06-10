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


// login
//function login() {
  //  window.location.href = "../index.html";
//}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("LoginForm");

    if(form){
        form.addEventListener("submit",(e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (email && password) {
            sessionStorage.setItem("loggedIn", "true");
            window.location.href = "../index.html";
        }else {
            alert("Por favor, ingresa tu correo electrónico y contraseña.");
        }

    });
    }
});

// logout

function logout() {
    sessionStorage.removeItem("loggedIn");
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
const ruta = window.location.pathname.includes("/pages/")
  ? "../data/productos.json"
  : "data/productos.json";
const productosContainer = document.getElementById("contenedor-productos");

if (productosContainer) {
    fetch(ruta)
        .then(response => response.json())
        .then(productos => {
            let ListaProductos = productos;
            const esIndex = window.location.pathname.includes("index.html");
            const rutaImagen = esIndex ? "" : "../";
            const pagina = window.location.pathname;

            let categoria = "";
            if (pagina.includes("suplementos.html")) categoria = "Suplementos";
            if (pagina.includes("snacks.html")) categoria = "sueltos";
            if (pagina.includes("Sin_Tacc.html")) categoria = "sintacc";

            if (esIndex) {
                const suplementos = productos.filter(p => p.categoria === "Suplementos").slice(0, 2);
                const snacks = productos.filter(p => p.categoria === "sueltos").slice(0, 2);
                const sinTacc = productos.filter(p => p.categoria === "sintacc").slice(0, 2);

                ListaProductos = [...suplementos, ...snacks, ...sinTacc];
            }
            if (categoria !== "") {
                ListaProductos = productos.filter(p => p.categoria === categoria);
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
                    }
                    contador.textContent = cantidad;
                });
                productosContainer.appendChild(card);
            });
        });
}


