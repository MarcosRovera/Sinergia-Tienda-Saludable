
import { Router } from "express";

import Producto from "../models/producto.js";
import Pedido from "../models/pedido.js";
import verificarToken from "../middleware/auth.middleware.js";

const router = Router();

// POST nuevo pedido con autenticacion
router.post("/", verificarToken, async (req, res) => {
    try {
        const { direccion, productos: productosPedido } = req.body;

        // Validar datos obligatorios
        if (
            !direccion ||
            !Array.isArray(productosPedido) ||
            productosPedido.length === 0
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios del pedido"
            });
        }

        // Obtener el cliente desde el token JWT
        const id_cliente = Number(req.usuario.id);

        // Agrupar productos repetidos para evitar descontar stock incorrectamente
        const cantidades = new Map();

        for (const item of productosPedido) {
            const id_producto = Number(item.id_producto);
            const cantidad = Number(item.cantidad);

            if (
                !Number.isInteger(id_producto) ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {
                return res.status(400).json({
                    error: "Los productos y sus cantidades no son válidos"
                });
            }

            cantidades.set(
                id_producto,
                (cantidades.get(id_producto) || 0) + cantidad
            );
        }

        // Verificar productos, stock y calcular el total
        let total = 0;
        const productosActualizados = [];

        for (const [id_producto, cantidad] of cantidades) {
            const producto = await Producto.findOne({ id: id_producto });

            if (!producto) {
                return res.status(404).json({
                    error: `El producto ${id_producto} no existe`
                });
            }

            if (cantidad > producto.stock) {
                return res.status(400).json({
                    error: `No hay suficiente stock del producto ${producto.nombre}`
                });
            }

            total += producto.precio * cantidad;

            productosActualizados.push({
                producto,
                cantidad
            });
        }

        // Descontar el stock una vez validados todos los productos
        for (const item of productosActualizados) {
            item.producto.stock -= item.cantidad;

            if (item.producto.stock === 0) {
                item.producto.disponible = false;
            }

            await item.producto.save();
        }

        // Generar el ID del nuevo pedido
        const ultimoPedido = await Pedido.findOne().sort({ id: -1 });
        const nuevoId = ultimoPedido ? ultimoPedido.id + 1 : 1001;

        // Crear el pedido en MongoDB
        const nuevoPedido = await Pedido.create({
            id: nuevoId,
            id_cliente,
            fecha: new Date().toISOString(),
            total,
            direccion,
            entregado: false,
            productos: Array.from(cantidades, ([id_producto, cantidad]) => ({
                id_producto,
                cantidad
            }))
        });

        res.status(201).json({
            mensaje: "Pedido creado correctamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);

        res.status(500).json({
            error: "Error al crear el pedido"
        });
    }
});

// PUT - Marcar un pedido como entregado
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { entregado } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "El ID no es válido" });
        }

        if (typeof entregado !== "boolean") {
            return res.status(400).json({
                error: "El campo entregado debe ser verdadero o falso"
            });
        }

        const pedido = await Pedido.findOneAndUpdate(
            { id },
            { entregado },
            { new: true, runValidators: true }
        );

        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        res.status(200).json({
            mensaje: "Estado del pedido actualizado correctamente",
            pedido
        });

    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({ error: "Error al actualizar el pedido" });
    }
});

export default router;
