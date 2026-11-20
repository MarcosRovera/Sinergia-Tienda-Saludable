import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Cliente from "../models/cliente.js";
import Pedido from "../models/pedido.js";

const router = Router();

//  Iniciar sesión (post)
router.post("/login", async (req, res) => {
    
    try {
        
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({
                mensaje: "Email y contraseña son obligatorios"
            });
        }

        const cliente = await Cliente.findOne({
            email: email.toLowerCase().trim()
        });

        if (!cliente) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const contraseñaValida = await bcrypt.compare(
            contraseña,
            cliente.passwordHash
        );

        if (!contraseñaValida) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = jwt.sign(
            {
                id: cliente.id,
                email: cliente.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            mensaje: "Login exitoso",
            token,
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                email: cliente.email
            }
        });
        

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al iniciar sesión",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const clientes = await Cliente.find().select("-passwordHash");

        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los clientes"
        });
    }
});

// GET  Obtener un cliente por ID
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const cliente = await Cliente.findOne({ id }).select("-passwordHash");

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
//  Actualizar 
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombre, apellido, email, telefono } = req.body;

        const cliente = await Cliente.findOneAndUpdate(
            { id },
            {
                nombre,
                apellido,
                email: email?.trim().toLowerCase(),
                telefono: Number(telefono)
            },
            { new: true, runValidators: true }
        ).select("-passwordHash");

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Cliente actualizado correctamente",
            cliente
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar el cliente"
        });
    }
});
//  (Delete)
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const cliente = await Cliente.findOne({ id });

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        const tienePedidos = await Pedido.exists({
            id_cliente: id
        });

        if (tienePedidos) {
            return res.status(409).json({
                error: "No se puede eliminar el cliente porque tiene pedidos asociados"
            });
        }

        await Cliente.deleteOne({ id });

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente",
            cliente
        });

    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el cliente"
        });
    }
});

// nuevo cliente
router.post("/", async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña, telefono } = req.body;

        if (!nombre || !apellido || !email || !contraseña || !telefono) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const emailExiste = await Cliente.findOne({
            email: emailNormalizado
        });

        if (emailExiste) {
            return res.status(409).json({
                error: "Este correo electrónico ya está registrado"
            });
        }

        const ultimoCliente = await Cliente.findOne().sort({ id: -1 });
        const nuevoId = ultimoCliente ? ultimoCliente.id + 1 : 1;

        const passwordHash = await bcrypt.hash(contraseña, 10);

        const nuevoCliente = await Cliente.create({
            id: nuevoId,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: emailNormalizado,
            passwordHash,
            telefono: Number(telefono)
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            cliente: {
                id: nuevoCliente.id,
                nombre: nuevoCliente.nombre,
                apellido: nuevoCliente.apellido,
                email: nuevoCliente.email
            }
        });

    } catch (error) {
        console.error("Error al registrar cliente:", error);

        res.status(500).json({
            error: "Error al registrar el usuario"
        });
    }
});

export default router;
