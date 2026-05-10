const pool = require('../config/postgres');

const createUser = async (userData) => {
    const { nombre, email, password, universidad, carrera } = userData;
    const query = `
        INSERT INTO users (nombre, email, password, universidad, carrera)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [nombre, email, password, universidad, carrera];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = { createUser };