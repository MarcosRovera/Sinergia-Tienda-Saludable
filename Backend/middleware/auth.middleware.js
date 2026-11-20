import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "Acceso denegado. No se proporcionó un token."
            });
        }

        const token = authHeader.split(" ")[1];

        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o expirado."
        });
    }
};

export default verificarToken;