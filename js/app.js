const paginas = [
    {titulo: "Inicio", url: "../index.html"},
    {titulo: "Snacks", url: "../pages/snacks.html"},
    {titulo: "Suplementos", url: "../pages/suplementos.html"},
    {titulo: "Sin Tacc", url: "../pages/Sin_Tacc.html"},
]

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