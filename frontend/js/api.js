
const API_URL = "http://localhost:3000";

async function request(method, endpoint, body, requiereToken = false) {
    const opciones = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Agregar JWT cuando la ruta lo requiere
    if (requiereToken) {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Debés iniciar sesión para realizar esta operación");
        }

        opciones.headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
        opciones.body = JSON.stringify(body);
    }

    const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);

    const datos = await respuesta.json().catch(() => ({}));

    return {
        ok: respuesta.ok,
        status: respuesta.status,
        data: datos
    };
}

export const api = {
    login: (email, contraseña) =>
        request("POST", "/clientes/login", { email, contraseña }),

    registrar: (cliente) =>
        request("POST", "/clientes", cliente),

    productos: () =>
        request("GET", "/productos"),

    crearPedido: (pedido) =>
        request("POST", "/pedidos", pedido, true)
};
