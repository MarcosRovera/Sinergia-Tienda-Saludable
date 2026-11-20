
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import Cliente from "../models/cliente.js";
import Producto from "../models/producto.js";
import Pedido from "../models/pedido.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrarDatos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Conectado a MongoDB");

        const leerJSON = async (archivo) => {
            const ruta = path.join(__dirname, "../data", archivo);
            const contenido = await readFile(ruta, "utf-8");
            return JSON.parse(contenido);
        };

        const clientesJSON = await leerJSON("clientes.json");
        const productosJSON = await leerJSON("productos.json");
        const pedidosJSON = await leerJSON("pedidos.json");

        // Convertir las contraseñas a hashes
        const clientes = await Promise.all(
            clientesJSON.map(async (cliente) => {
                const passwordHash = await bcrypt.hash(
                    cliente.contraseña,
                    10
                );

                return {
                    id: cliente.id,
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    email: cliente.email,
                    passwordHash,
                    telefono: cliente.telefono
                };
            })
        );

        // Evitar duplicados al repetir la migración
        await Cliente.deleteMany({});
        await Producto.deleteMany({});
        await Pedido.deleteMany({});

        await Cliente.insertMany(clientes);
        await Producto.insertMany(productosJSON);
        await Pedido.insertMany(pedidosJSON);

        console.log("Migración completada correctamente");
        console.log(`Clientes: ${clientes.length}`);
        console.log(`Productos: ${productosJSON.length}`);
        console.log(`Pedidos: ${pedidosJSON.length}`);

    } catch (error) {
        console.error("Error durante la migración:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrarDatos();
