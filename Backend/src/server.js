require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del Driver
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true, connectionTimeout: 20000 }
);

// 1. Sincronización de Perfil (Guardar Datos)
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career, bio } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, u.career = $career, u.bio = $bio
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema) DELETE r
            WITH u
            UNWIND (CASE WHEN $topics = [] THEN [null] ELSE $topics END) AS temaNombre
            WITH u, temaNombre WHERE temaNombre IS NOT NULL
            MERGE (t:Tema {nombre: toUpper(trim(temaNombre))})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics: topics || [], imageUrl, career, bio });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// 2. Panel de Matches (Sugerencias, Solicitudes y Activos)
app.get('/api/matches/search', async (req, res) => {
    const { clerkId, topic } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario {id: $clerkId})
            MATCH (target:Usuario)-[:INTERESADO_EN]->(t:Tema)
            WHERE t.nombre CONTAINS toUpper($topic) AND target.id <> $clerkId
            RETURN DISTINCT target
            LIMIT 10
        `, { clerkId, topic });
        res.json({ results: result.records.map(r => r.get('target').properties) });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));