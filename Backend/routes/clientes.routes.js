import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const archivoClientes = "./data/clientes.json";
const router = Router();

// POST - Iniciar sesión
router.post("/login", async (req, res) => {
    try {
        const datos = await readFile(archivoClientes, "utf-8");
        const clientes = JSON.parse(datos);

        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({
                error: "Ingresá tu correo y contraseña"
            });
        }

        const cliente = clientes.find(
            cliente =>
                cliente.email === email.trim() &&
                cliente.contraseña === contraseña
        );

        if (!cliente) {
            return res.status(401).json({
                error: "Correo o contraseña incorrectos"
            });
        }

        res.status(200).json({
            mensaje: `Bienvenido ${cliente.nombre}`,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email
            }
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al iniciar sesión"
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const datos = await readFile(archivoClientes, "utf-8");
        const clientes = JSON.parse(datos);

        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los clientes"
        });
    }
});
// GET - Obtener un cliente por ID
router.get("/:id", async (req, res) => {
    try {
        const datos = await readFile(archivoClientes, "utf-8");
        const clientes = JSON.parse(datos);

        const id = Number(req.params.id);

        const cliente = clientes.find(cliente => cliente.id === id);

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.status(200).json(cliente);

    } catch (error) {
        res.status(500).json({
            error: "Error al obtener el cliente"
        });
    }
});
// PUT - Actualizar un cliente
router.put("/:id", async (req, res) => {
    try {
        const datos = await readFile(archivoClientes, "utf-8");
        const clientes = JSON.parse(datos);

        const id = Number(req.params.id);

        const indiceCliente = clientes.findIndex(
            cliente => cliente.id === id
        );

        if (indiceCliente === -1) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        const clienteActualizado = {
            ...clientes[indiceCliente],
            ...req.body,
            id: id
        };

        clientes[indiceCliente] = clienteActualizado;

        await writeFile(
            archivoClientes,
            JSON.stringify(clientes, null, 2)
        );

        res.status(200).json({
            mensaje: "Cliente actualizado correctamente",
            cliente: clienteActualizado
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el cliente"
        });
    }
});
//  Eliminar un cliente (Delete)
router.delete("/:id", async (req, res) => {
    try {
        const datosClientes = await readFile(archivoClientes, "utf-8");
        const datosPedidos = await readFile("./data/pedidos.json", "utf-8");
        const clientes = JSON.parse(datosClientes);
        const pedidos = JSON.parse(datosPedidos);
        const id = Number(req.params.id);

        const indiceCliente = clientes.findIndex(
            cliente => cliente.id === id
        );
        if (indiceCliente === -1) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        const tienePedidos = pedidos.some(
            pedido => pedido.id_cliente === id
        );
        if (tienePedidos) {
            return res.status(409).json({
                error: "No se puede eliminar el cliente porque tiene pedidos asociados"
            });
        }
        const clienteEliminado = clientes[indiceCliente];
        clientes.splice(indiceCliente, 1);
        await writeFile(
            archivoClientes,
            JSON.stringify(clientes, null, 2)
        );
        res.status(200).json({
            mensaje: "Cliente eliminado correctamente",
            cliente: clienteEliminado
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el cliente"
        });
    }
});
export default router;