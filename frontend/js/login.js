import { api } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("LoginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!formulario) return;

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const contraseña = passwordInput.value;

        try {
            const respuesta = await api.login(email, contraseña);

            if (!respuesta.ok) {
                alert(respuesta.data.error || "No se pudo iniciar sesión");
                return;
            }

            const cliente = respuesta.data.cliente;

            // Guardar los datos del cliente para la sesión actual
            sessionStorage.setItem("cliente", JSON.stringify(cliente));

            alert(`¡Bienvenido, ${cliente.nombre}!`);

            // Volver a la tienda
            window.location.href = "../index.html";

        } catch (error) {
            console.error("Error al iniciar sesión:", error);

            alert(
                "No se pudo conectar con el servidor. Verificá que el backend esté funcionando."
            );
        }
    });
});