require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const neo4j = require('neo4j-driver');

const app = express();
const server = http.createServer(app);

// Conexión con Neo4j AuraDB
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const allowedOrigins = [
    "http://localhost:3000", 
    "https://unimatch-red-pi.vercel.app"
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// --- SINCRONIZACIÓN DE PERFIL: CORREGIDO ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "Falta ID" });

    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, 
                u.university = $university, 
                u.imageUrl = $imageUrl, 
                u.career = $career
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema)
            DELETE r
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { 
            clerkId, 
            name: name || "Estudiante", 
            university: university || "No definida", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "General" 
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ruta de Dashboard para Matches
app.get('/api/matches/dashboard/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})
            OPTIONAL MATCH (me)-[:CONECTADO_CON]-(activos:Usuario)
            OPTIONAL MATCH (pendientes:Usuario)-[r:SOLICITUD_ENVIADA]->(me) WHERE r.estado = 'pendiente'
            OPTIONAL MATCH (me)-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(sug:Usuario)
            WHERE sug.id <> $clerkId AND NOT (me)--(sug)
            RETURN 
                collect(DISTINCT {id: activos.id, name: activos.name, img: activos.imageUrl}) AS listaActivos,
                collect(DISTINCT {id: pendientes.id, name: pendientes.name, img: pendientes.imageUrl}) AS listaPendientes,
                collect(DISTINCT {id: sug.id, name: sug.name, img: sug.imageUrl, common: t.nombre}) AS listaSugeridos
        `, { clerkId });
        const rec = result.records[0];
        res.json({
            activos: rec.get('listaActivos').filter(x => x.id !== null),
            pendientes: rec.get('listaPendientes').filter(x => x.id !== null),
            sugeridos: rec.get('listaSugeridos').filter(x => x.id !== null)
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));