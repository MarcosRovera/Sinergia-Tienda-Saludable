import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import clientesRoutes from "./routes/clientes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/clientes", clientesRoutes);
app.use("/productos", productosRoutes);
app.use("/pedidos", pedidosRoutes);



app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});