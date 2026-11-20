
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: String,
    categoria: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Producto", productoSchema);
