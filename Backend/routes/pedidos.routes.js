import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const archivoPedidos = "./data/pedidos.json";
const archivoClientes = "./data/clientes.json";
const archivoProductos = "./data/productos.json";

const router = Router();

// POST - Crear un nuevo pedido
router.post("/", async (req, res) => {
    try {
        const datosPedidos = await readFile(archivoPedidos, "utf-8");
        const datosClientes = await readFile(archivoClientes, "utf-8");
        const datosProductos = await readFile(archivoProductos, "utf-8");
        const pedidos = JSON.parse(datosPedidos);
        const clientes = JSON.parse(datosClientes);
        const productos = JSON.parse(datosProductos);
        const { id_cliente, fecha, direccion, productos: productosPedido } = req.body;

        if (
            id_cliente === undefined ||
            !fecha ||
            !direccion ||
            !Array.isArray(productosPedido) ||
            productosPedido.length === 0
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios del pedido"
            });
        }
        // Verificar que exista el cliente
        const clienteExiste = clientes.some(
            cliente => cliente.id === Number(id_cliente)
        );
        if (!clienteExiste) {
            return res.status(404).json({
                error: "El cliente no existe"
            });
        }
        // Verificar productos y calcular total
        let total = 0;
        for (const item of productosPedido) {
            const producto = productos.find(
                producto => producto.id === Number(item.id_producto)
            );

            if (!producto) {
                return res.status(404).json({
                    error: `El producto ${item.id_producto} no existe`
                });
            }

            if (item.cantidad <= 0) {
                return res.status(400).json({
                    error: "La cantidad debe ser mayor a 0"
                });
            }

            if (item.cantidad > producto.stock) {
                return res.status(400).json({
                    error: `No hay suficiente stock del producto ${producto.nombre}`
                });
            }
            total += producto.precio * item.cantidad;
            // Descontar el stock de los productos comprados
            for (const item of productosPedido) {
                const producto = productos.find(
                    producto => producto.id === Number(item.id_producto)
                );

                producto.stock -= Number(item.cantidad);

                if (producto.stock === 0) {
                    producto.disponible = false;
                }          
            }
            await writeFile(
                archivoProductos,
                JSON.stringify(productos, null, 2)
            );
        }

        const nuevoId = pedidos.length > 0
            ? Math.max(...pedidos.map(pedido => pedido.id)) + 1
            : 1001;
        const nuevoPedido = {
            id: nuevoId,
            id_cliente: Number(id_cliente),
            fecha,
            total,
            direccion,
            entregado: false,
            productos: productosPedido
        };
        pedidos.push(nuevoPedido);
        await writeFile(
            archivoPedidos,
            JSON.stringify(pedidos, null, 2)
        );
        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al crear el pedido"
        });
    }
});



export default router;