
import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    id_cliente: {
        type: Number,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    entregado: {
        type: Boolean,
        default: false
    },
    productos: [{
        id_producto: {
            type: Number,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }]
});

export default mongoose.model("Pedido", pedidoSchema);
