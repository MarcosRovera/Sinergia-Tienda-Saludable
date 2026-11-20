
import { api } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("RegisterForm");

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nuevoCliente = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            email: document.getElementById("email").value.trim(),
            contraseña: document.getElementById("contraseña").value,
            telefono: Number(document.getElementById("telefono").value)
        };

        if (!Number.isFinite(nuevoCliente.telefono) ||
            nuevoCliente.telefono <= 0) {
            alert("Ingresá un teléfono válido.");
            return;
        }

        try {
            const respuesta = await api.registrar(nuevoCliente);

            if (!respuesta.ok) {
                alert(respuesta.data.error || "No se pudo crear la cuenta.");
                return;
            }

            alert("¡Cuenta creada correctamente!");

            window.location.href = "login.html";

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
