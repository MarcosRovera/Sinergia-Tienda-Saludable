
import { Router } from "express";
import Producto from "../models/producto.js";
import Pedido from "../models/pedido.js";

const router = Router();

// POST - Crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            imagen,
            categoria,
            stock,
            disponible
        } = req.body;

        if (
            !nombre ||
            !descripcion ||
            precio === undefined ||
            !categoria ||
            stock === undefined
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios del producto"
            });
        }

        if (
            !Number.isFinite(Number(precio)) ||
            Number(precio) < 0 ||
            !Number.isInteger(Number(stock)) ||
            Number(stock) < 0
        ) {
            return res.status(400).json({
                error: "El precio o el stock no son válidos"
            });
        }

        const ultimoProducto = await Producto.findOne().sort({ id: -1 });
        const nuevoId = ultimoProducto ? ultimoProducto.id + 1 : 1;

        const nuevoProducto = await Producto.create({
            id: nuevoId,
            nombre,
            descripcion,
            precio: Number(precio),
            imagen,
            categoria,
            stock: Number(stock),
            disponible: disponible === undefined
                ? Number(stock) > 0
                : disponible
        });

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            producto: nuevoProducto
        });

    } catch (error) {
        console.error("Error al crear producto:", error);

        res.status(500).json({
            error: "Error al crear el producto"
        });
    }
});

// GET - Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find().sort({ id: 1 });

        res.status(200).json(productos);

    } catch (error) {
        console.error("Error al obtener productos:", error);

        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
});

// PUT - Actualizar un producto existente
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "El ID no es válido" });
        }

        const { nombre, descripcion, precio, imagen, categoria, stock, disponible } = req.body;

        const producto = await Producto.findOne({ id });

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Actualizar solamente los campos enviados
        if (nombre !== undefined) {
            if (typeof nombre !== "string" || !nombre.trim()) {
                return res.status(400).json({ error: "El nombre no es válido" });
            }
            producto.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            if (typeof descripcion !== "string" || !descripcion.trim()) {
                return res.status(400).json({ error: "La descripción no es válida" });
            }
            producto.descripcion = descripcion.trim();
        }

        if (precio !== undefined) {
            if (!Number.isFinite(Number(precio)) || Number(precio) < 0) {
                return res.status(400).json({ error: "El precio no es válido" });
            }
            producto.precio = Number(precio);
        }

        if (imagen !== undefined) {
            producto.imagen = imagen;
        }

        if (categoria !== undefined) {
            if (typeof categoria !== "string" || !categoria.trim()) {
                return res.status(400).json({ error: "La categoría no es válida" });
            }
            producto.categoria = categoria.trim();
        }

        if (stock !== undefined) {
            if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
                return res.status(400).json({ error: "El stock no es válido" });
            }
            producto.stock = Number(stock);

            if (disponible === undefined) {
                producto.disponible = producto.stock > 0;
            }
        }

        if (disponible !== undefined) {
            if (typeof disponible !== "boolean") {
                return res.status(400).json({ error: "El campo disponible debe ser verdadero o falso" });
            }
            producto.disponible = disponible;
        }

        await producto.save();

        res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            producto
        });

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});


// DELETE - Eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "El ID no es válido" });
        }

        const producto = await Producto.findOne({ id });

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Verificar si el producto aparece en algún pedido
        const existeEnPedido = await Pedido.exists({
            "productos.id_producto": id
        });

        if (existeEnPedido) {
            return res.status(409).json({
                error: "No se puede eliminar el producto porque está asociado a pedidos"
            });
        }

        await Producto.deleteOne({ id });

        res.status(200).json({
            mensaje: "Producto eliminado correctamente",
            producto
        });

    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
