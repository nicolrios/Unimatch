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

// --- 1. ENVIAR SOLICITUD DE MATCH ---
app.post('/api/matches/request', async (req, res) => {
    const { fromId, toId } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MATCH (a:Usuario {id: $fromId}), (b:Usuario {id: $toId})
            MERGE (a)-[r:SOLICITUD {status: 'pendiente', fecha: datetime()}]->(b)
            RETURN r
        `, { fromId, toId });
        res.json({ success: true, message: "Enlace en espera" });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 2. ACEPTAR SOLICITUD DE MATCH ---
app.post('/api/matches/accept', async (req, res) => {
    const { fromId, toId } = req.body; // toId soy yo (quien acepta)
    const session = driver.session();
    try {
        await session.run(`
            MATCH (a:Usuario {id: $fromId})-[r:SOLICITUD]->(b:Usuario {id: $toId})
            SET r.status = 'aceptado', r.fecha_match = datetime()
            RETURN r
        `, { fromId, toId });
        res.json({ success: true, message: "Match concretado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 3. CONTADOR DE NOTIFICACIONES ---
app.get('/api/notifications/count/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario {id: $clerkId})
            OPTIONAL MATCH (remitente)-[r:SOLICITUD {status: 'pendiente'}]->(u)
            RETURN count(r) as total
        `, { clerkId });
        res.json({ count: result.records[0].get('total') });
    } finally { await session.close(); }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));