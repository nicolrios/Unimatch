require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const neo4j = require('neo4j-driver');

const app = express();
const server = http.createServer(app);

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const allowedOrigins = ["http://localhost:3000", "https://unimatch-red-pi.vercel.app"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// RUTA: Sincronizar Perfil
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, u.career = $career
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema) DELETE r
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
        `, { clerkId, name, university, topics, imageUrl, career: career || "" });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// RUTA: Dashboard de Matches (Activos, Pendientes, Sugeridos)
app.get('/api/matches/dashboard/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})
            
            // 1. Activos: Usuarios con los que ya hay conexión (CONECTADO_CON)
            OPTIONAL MATCH (me)-[:CONECTADO_CON]-(activos:Usuario)
            
            // 2. Pendientes: Solicitudes que otros me enviaron a mí
            OPTIONAL MATCH (pendientes:Usuario)-[r:SOLICITUD_ENVIADA]->(me)
            WHERE r.estado = 'pendiente'
            
            // 3. Sugeridos: Gente con temas comunes que NO son amigos ni tienen solicitudes
            OPTIONAL MATCH (me)-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(sug:Usuario)
            WHERE sug.id <> $clerkId 
              AND NOT (me)-[:CONECTADO_CON]-(sug) 
              AND NOT (me)-[:SOLICITUD_ENVIADA]-(sug)

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
server.listen(PORT, () => console.log(`Servidor UniMatch en puerto ${PORT}`));