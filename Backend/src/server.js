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

// --- SINCRONIZACIÓN: Guarda usuario y crea relaciones con Temas ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, u.career = $career
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema)
            DELETE r
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics, imageUrl, career: career || "" });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// --- SUGERENCIAS: Busca personas con temas IGUALES (ej: UML) ---
app.get('/api/matches/suggestions/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(other:Usuario)
            WHERE me <> other
            WITH other, collect(t.nombre) AS temasEnComun, count(t) AS cantidad
            RETURN other.id AS id, other.name AS name, other.university AS university, 
                   other.career AS career, other.imageUrl AS imageUrl, temasEnComun
            ORDER BY cantidad DESC LIMIT 10
        `, { clerkId });

        res.json(result.records.map(r => ({
            id: r.get('id'), name: r.get('name'), university: r.get('university'),
            career: r.get('career'), imageUrl: r.get('imageUrl'), 
            commonTopics: r.get('temasEnComun'),
            matchPercentage: 50 + (r.get('temasEnComun').length * 10)
        })));
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// --- BÚSQUEDA: Filtra por texto o carrera ---
app.get('/api/matches/search', async (req, res) => {
    const { q, clerkId } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario)
            WHERE u.id <> $clerkId 
            AND (u.name =~ '(?i).*' + $query + '.*' OR u.career =~ '(?i).*' + $query + '.*' OR $query = "")
            OPTIONAL MATCH (u)-[:INTERESADO_EN]->(t:Tema)
            RETURN u.id AS id, u.name AS name, u.university AS university, 
                   u.career AS career, u.imageUrl AS imageUrl, collect(t.nombre) AS topics
            LIMIT 20
        `, { query: q || "", clerkId: clerkId || "" });

        res.json(result.records.map(r => ({
            id: r.get('id'), name: r.get('name'), university: r.get('university'),
            career: r.get('career'), imageUrl: r.get('imageUrl'), commonTopics: r.get('topics'),
            matchPercentage: 45
        })));
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Backend en puerto ${PORT}`));