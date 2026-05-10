const neo4j = require('neo4j-driver');
require('dotenv').config();

// Creamos el "driver" (el chofer que lleva los datos a Neo4j)
const driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASSWORD || 'password' // La que pusiste al crear la DB
    )
);

// Función para verificar la conexión
const checkNeo4j = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('✅ Conectado a Neo4j con éxito');
    } catch (error) {
        console.log('❌ Error en Neo4j:', error.message);
    }
};

checkNeo4j();

module.exports = driver;