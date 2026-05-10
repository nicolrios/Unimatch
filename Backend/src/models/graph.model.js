const driver = require('../config/neo4j');

const createStudentNode = async (userId, nombre) => {
    const session = driver.session();
    try {
        // Creamos un nodo de tipo "Usuario"
        await session.run(
            'CREATE (u:Usuario {id: $id, nombre: $nombre})',
            { id: userId, nombre: nombre }
        );
    } finally {
        await session.close();
    }
};

const addStudyRelation = async (userId, temaNombre) => {
    const session = driver.session();
    try {
        // Esta consulta busca al usuario y al tema, y los une con "ESTUDIA"
        // MERGE evita crear duplicados
        await session.run(
            `MATCH (u:Usuario {id: $userId})
             MERGE (t:Tema {nombre: $temaNombre})
             MERGE (u)-[:ESTUDIA]->(t)`,
            { userId, temaNombre }
        );
    } finally {
        await session.close();
    }
};

module.exports = { createStudentNode, addStudyRelation };