import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const archivoProductos = "./data/productos.json";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const datos = await readFile(archivoProductos, "utf-8");
        const productos = JSON.parse(datos);

        const nuevoProducto = req.body;

        if (
            !nuevoProducto.nombre ||
            !nuevoProducto.descripcion ||
            nuevoProducto.precio === undefined ||
            !nuevoProducto.categoria ||
            nuevoProducto.stock === undefined
        ) {
            return res.status(400).json({
                error: "Faltan datos obligatorios del producto"
            });
        }

        const nuevoId = productos.length > 0
            ? Math.max(...productos.map(producto => producto.id)) + 1
            : 1;

        nuevoProducto.id = nuevoId;

        if (nuevoProducto.disponible === undefined) {
            nuevoProducto.disponible = true;
        }

        productos.push(nuevoProducto);

        await writeFile(
            archivoProductos,
            JSON.stringify(productos, null, 2)
        );

        res.status(201).json({
            mensaje: "Producto creado correctamente",
            producto: nuevoProducto
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al crear el producto"
        });
    }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const datos = await readFile(archivoProductos, "utf-8");
        const productos = JSON.parse(datos);

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
});

export default router;