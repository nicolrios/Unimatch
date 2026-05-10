const userModel = require('../models/user.model');

const register = async (req, res) => {
    try {
        const newUser = await userModel.createUser(req.body);
        res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

module.exports = { register };