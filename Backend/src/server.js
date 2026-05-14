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
// 1. Enviar Solicitud de Match
app.post('/api/matches/request', async (req, res) => {
    const { fromId, toId } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MATCH (a:Usuario {id: $fromId}), (b:Usuario {id: $toId})
            MERGE (a)-[r:SOLICITUD_ENVIADA]->(b)
            SET r.status = 'pendiente'
            RETURN r
        `, { fromId, toId });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// 2. Obtener todo el panel de Matches (Sugerencias, Pendientes, Confirmados)
app.get('/api/matches/panel/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        // Sugerencias (Lo que ya teníamos)
        const suggRes = await session.run(`
            MATCH (u:Usuario {id: $clerkId})-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(s:Usuario)
            WHERE u <> s AND NOT (u)-[:SOLICITUD_ENVIADA]-(s)
            RETURN s, count(t) AS temasEnComun LIMIT 5
        `, { clerkId });

        // Solicitudes recibidas
        const reqRes = await session.run(`
            MATCH (remitente:Usuario)-[r:SOLICITUD_ENVIADA]->(u:Usuario {id: $clerkId})
            WHERE r.status = 'pendiente'
            RETURN remitente
        `, { clerkId });

        // Matches confirmados (Cuando ambos se enviaron o uno aceptó)
        const confirmedRes = await session.run(`
            MATCH (u:Usuario {id: $clerkId})-[r:SOLICITUD_ENVIADA]-(m:Usuario)
            WHERE r.status = 'aceptado'
            RETURN m
        `, { clerkId });

        res.json({
            suggestions: suggRes.records.map(r => r.get('s').properties),
            requests: reqRes.records.map(r => r.get('remitente').properties),
            confirmed: confirmedRes.records.map(r => r.get('m').properties)
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
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