const API_URL = "http://localhost:3000";

async function request(method, endpoint, body) {
    const opciones = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

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

    productos: () =>
        request("GET", "/productos"),

    crearPedido: (pedido) =>
        request("POST", "/pedidos", pedido)
};