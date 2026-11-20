
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import clientesRoutes from "./routes/clientes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/clientes", clientesRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos", pedidosRoutes);

try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado correctamente");

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });

} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
}
