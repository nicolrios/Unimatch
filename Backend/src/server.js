require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del Driver (Usa bolt+s:// en Render para mayor estabilidad)
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

// Verificar conexión inicial
(async () => {
    try {
        await driver.verifyConnectivity();
        console.log("✅ Conexión establecida con Neo4j Aura satisfactoriamente");
    } catch (error) {
        console.error("❌ Error de conexión inicial:", error.message);
    }
})();

// --- RUTAS ---

// 1. Sincronización de Perfil
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    if (!clerkId) return res.status(400).json({ error: "clerkId requerido" });
    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, u.career = $career
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema) DELETE r
            WITH u
            UNWIND (CASE WHEN $topics = [] THEN [null] ELSE $topics END) AS temaNombre
            WITH u, temaNombre WHERE temaNombre IS NOT NULL
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics: topics || [], imageUrl, career });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally { await session.close(); }
});

// 2. Motor de Sugerencias (Matches por Intereses)
app.get('/api/matches/suggestions/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario {id: $clerkId})-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(sugerencia:Usuario)
            WHERE u <> sugerencia
            RETURN sugerencia, count(t) AS temasEnComun, collect(t.nombre) AS temasNombres
            ORDER BY temasEnComun DESC LIMIT 6
        `, { clerkId });
        const suggestions = result.records.map(record => ({
            ...record.get('sugerencia').properties,
            commonTopicsCount: record.get('temasEnComun'),
            commonTopics: record.get('temasNombres')
        }));
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally { await session.close(); }
});

// 3. Búsqueda Global (Nombre o Carrera)
app.get('/api/users/search', async (req, res) => {
    const { q } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario)
            WHERE toLower(u.name) CONTAINS toLower($q) OR toLower(u.career) CONTAINS toLower($q)
            RETURN u LIMIT 12
        `, { q: q || "" });
        const users = result.records.map(record => record.get('u').properties);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally { await session.close(); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));