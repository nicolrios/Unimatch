const redisClient = require('../config/redis');
const driver = require('../config/neo4j'); // Suponiendo que ya tenés neo4j configurado

const searchTopics = async (tema) => {
    const cacheKey = `search:${tema}`;

    // 1. Nos fijamos si ya está en Redis (el caché)
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
        console.log("⚡ Devolviendo resultado desde Redis (Caché)");
        return JSON.parse(cachedResult);
    }

    // 2. Si no está, lo buscamos en Neo4j (Consultas Cypher)
    console.log("🔍 Buscando en Neo4j...");
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:Usuario)-[:ESTUDIA]->(t:Tema {nombre: $tema})
             RETURN u.nombre AS nombre, u.universidad AS universidad`,
            { tema }
        );

        const users = result.records.map(record => ({
            nombre: record.get('nombre'),
            universidad: record.get('universidad')
        }));

        // 3. Guardamos el resultado en Redis por 1 hora (3600 segundos) para la próxima vez
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));

        return users;
    } finally {
        await session.close();
    }
};

module.exports = { searchTopics };