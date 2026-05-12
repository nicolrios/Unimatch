require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();

// Configuración de Neo4j
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Middleware: CORS abierto para evitar el error de "Enlace de datos"
app.use(cors()); 
app.use(express.json());

// --- RUTA: SINCRONIZACIÓN DE PERFIL ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

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
            university: university || "No especificada", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "General" 
        });
        res.status(200).json({ success: true, message: "Perfil sincronizado en la red" });
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        await session.close();
    }
});

// --- RUTA: DASHBOARD DE MATCHES ---
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

app.get('/', (req, res) => res.send('UniMatch API Online 🚀'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));