// arrays
const paginasHome = [
    {titulo: "Inicio", url: "index.html"},
    {titulo: "Snacks", url: "pages/snacks.html"},
    {titulo: "Suplementos", url: "pages/suplementos.html"},
    {titulo: "Sin Tacc", url: "pages/Sin_Tacc.html"},
    {titulo: "🛒", url: "pages/carrito.html"},
]
const paginas = [
    {titulo: "Inicio", url: "../index.html"},
    {titulo: "Snacks", url: "snacks.html"},
    {titulo: "Suplementos", url: "suplementos.html"},
    {titulo: "Sin Tacc", url: "Sin_Tacc.html"},
    {titulo: "🛒", url: "carrito.html"},
]



//------------LOGOUT--------------------


function logout() {
    sessionStorage.removeItem("cliente");
    sessionStorage.removeItem("loggedIn");
    localStorage.removeItem("carrito");

    if (window.location.pathname.includes("/pages/")) {
        window.location.href = "login.html";
    } else {
        window.location.href = "pages/login.html";
    }
}
//------------------navbar---------------------
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
        
    const logoutBtn = navbar.querySelector(".btn");
    navbar.insertBefore(navLinks, logoutBtn);
}
//------------------navbar home---------------------
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
//------------------productos---------------------
const ruta =  "http://localhost:3000/productos";
const productosContainer = document.getElementById("contenedor-productos");

if (productosContainer) {
    fetch(ruta)
        .then(response => response.json())
        .then(productos => {
            let ListaProductos = productos;
            const esIndex = window.location.pathname.includes("index.html");
            const rutaImagen = window.location.pathname.includes("/pages/")
            ? "../"
            : "";
            const pagina = window.location.pathname;

            let categoria = "";
            if (pagina.includes("suplementos.html")) categoria = "suplementos";
            if (pagina.includes("snacks.html")) categoria = "snacks";
            if (pagina.includes("Sin_Tacc.html")) categoria = "sin tacc";

            if (esIndex) {
                const suplementos = productos.filter(p => p.categoria.toLowerCase() === "suplementos").slice(0, 2);
                const snacks = productos.filter(p => p.categoria.toLowerCase() === "snacks").slice(0, 2);
                const sinTacc = productos.filter(p => p.categoria.toLowerCase() === "sin tacc").slice(0, 2);

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
                    <p> $ ${parseInt(producto.precio).toLocaleString()}</p>    
                    <div class="cantidad">
                        <button class="menos">-</button>
                        <span class="contador">1</span>
                        <button class="mas">+</button>
                    </div>        
                    <button class="btn btn-second">Agregar al carrito</button>
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
                const Btncarrito = card.querySelector(".btn-second");
                Btncarrito.addEventListener("click", () => {
                    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                    const productoEnCarrito = carrito.find(p => p.id === producto.id);
                    if (productoEnCarrito) {
                        productoEnCarrito.cantidad += cantidad;
                    } else {
                    carrito.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        cantidad: cantidad
                    });
                    }
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    console.log(carrito);
                    alert("Producto agregado al carrito");
                    cantidad = 1;
                    contador.textContent = cantidad;   
                });

                
                productosContainer.appendChild(card);
            });
        });
}


//------------------carrito---------------------
const carritoContainer = document.getElementById("carrito-container");

    if (carritoContainer) {

        let carrito =
            JSON.parse(localStorage.getItem("carrito")) || [];

        carrito.forEach(producto => {

            const card = document.createElement("div");
            card.className = "carrito-item";

            card.innerHTML = `
                <div class="left">
                    <h4>${producto.nombre}</h4>
                </div>
                <div class="middle">
                    <p> $ ${parseInt((producto.precio * producto.cantidad)).toLocaleString()}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
                <button class="btn btn-third">Eliminar</button>
            `;

            const btn = card.querySelector(".btn-third");

            btn.addEventListener("click", () => {

                carrito = carrito.filter(p => p.id !== producto.id);

                localStorage.setItem("carrito", JSON.stringify(carrito));

                location.reload();
            });

            carritoContainer.appendChild(card);
        });

        const vaciar = document.getElementById("vaciarCarrito");

        if (vaciar) {
            vaciar.addEventListener("click", () => {
                                localStorage.removeItem("carrito");
                location.reload();
            });
        }
    }

const TotalCarrito = document.getElementById("totalCarrito");

if (TotalCarrito) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    TotalCarrito.textContent = total.toLocaleString();
}
//------------------ Enviar pedido al backend y WhatsApp ------------------

const btnWhatsApp = document.getElementById("enviarPedido");

if (btnWhatsApp) {
    btnWhatsApp.addEventListener("click", async () => {

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        // Obtener el cliente que inició sesión
        const cliente = JSON.parse(sessionStorage.getItem("cliente"));

        if (!cliente) {
            alert("Tenés que iniciar sesión para realizar una compra.");

            const rutaLogin = window.location.pathname.includes("/pages/")
                ? "login.html"
                : "pages/login.html";

            window.location.href = rutaLogin;
            return;
        }

        // Solicitar la dirección de entrega
        const direccion = prompt("Ingresá la dirección de entrega:");

        if (direccion === null || direccion.trim() === "") {
            return;
        }

        // Abrir una pestaña durante el clic del usuario
        const ventanaWhatsApp = window.open("about:blank", "_blank");

        // Preparar los datos del pedido
        const pedido = {
            id_cliente: Number(cliente.id),
            fecha: new Date().toISOString().slice(0, 10),
            direccion: direccion.trim(),
            productos: carrito.map(producto => ({
                id_producto: Number(producto.id),
                cantidad: Number(producto.cantidad)
            }))
        };

        try {
            const respuesta = await fetch("http://localhost:3000/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });

            const resultado = await respuesta.json();

            // Si el backend rechaza el pedido
            if (!respuesta.ok) {
                alert(resultado.error || "No se pudo registrar el pedido.");

                if (ventanaWhatsApp && !ventanaWhatsApp.closed) {
                    ventanaWhatsApp.close();
                }

                return;
            }

            // Crear el mensaje para WhatsApp
            const nombreCliente =
                `${cliente.nombre} ${cliente.apellido || ""}`.trim();

            let mensaje =
                `¡Hola! Soy ${nombreCliente} y quiero realizar este pedido en Sinergia:\n\n`;

            carrito.forEach(producto => {
                const subtotal =
                    Number(producto.precio) * producto.cantidad;

                mensaje += `- ${producto.nombre} x${producto.cantidad}`;
                mensaje += ` ($${subtotal.toLocaleString("es-AR")})\n`;
            });

            mensaje += `\nTotal: $${Number(resultado.pedido.total).toLocaleString("es-AR")}`;
            mensaje += `\nNúmero de pedido: ${resultado.pedido.id}`;
            mensaje += `\nCliente: ${nombreCliente}`;
            mensaje += `\nDirección de entrega: ${direccion.trim()}`;

            const telefono = "543515162384";

            const urlWhatsApp =
                `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

            // El pedido ya quedó registrado en el backend
            localStorage.removeItem("carrito");

            alert(
                `¡Pedido registrado correctamente!\nNúmero de pedido: ${resultado.pedido.id}`
            );

            // Abrir WhatsApp
            if (ventanaWhatsApp && !ventanaWhatsApp.closed) {
                ventanaWhatsApp.location.href = urlWhatsApp;
            }

            // Actualizar el carrito
            location.reload();

        } catch (error) {
            console.error("Error al registrar el pedido:", error);

            if (ventanaWhatsApp && !ventanaWhatsApp.closed) {
                ventanaWhatsApp.close();
            }

            alert(
                "No se pudo conectar con el servidor. Verificá que el backend esté funcionando."
            );
        }
    });
}