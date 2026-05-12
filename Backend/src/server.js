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

// Sincronización de Perfil (Con Carrera y Horario)
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career, horario } = req.body;
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });
    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, 
                u.career = $career, u.horario = $horario
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema)
            DELETE r
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics, imageUrl, career: career || "", horario: horario || "" });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// Búsqueda Inteligente (Algoritmo de Match por Carrera y Temas)
app.get('/api/matches/search', async (req, res) => {
    const { q, clerkId, carrera } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario)
            WHERE u.id <> $clerkId
            AND (u.name =~ '(?i).*' + $query + '.*' OR u.career =~ '(?i).*' + $query + '.*' OR $query = "")
            
            OPTIONAL MATCH (me:Usuario {id: $clerkId})-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(u)
            WITH u, collect(DISTINCT t.nombre) AS commonTopics
            
            // Lógica: Carrera igual (50 pts) + Temas comunes (15 pts c/u)
            RETURN u.id AS id, u.name AS name, u.university AS university, u.career AS career,
                   u.imageUrl AS imageUrl, commonTopics,
                   (CASE WHEN u.career = $carrera THEN 50 ELSE 0 END + size(commonTopics) * 15) AS matchPower
            ORDER BY matchPower DESC LIMIT 20
        `, { query: q || "", clerkId, carrera: carrera || "" });

        res.json(result.records.map(r => ({
            id: r.get('id'), name: r.get('name'), university: r.get('university'),
            career: r.get('career'), imageUrl: r.get('imageUrl'),
            commonTopics: r.get('commonTopics'),
            matchPercentage: Math.min(r.get('matchPower').toNumber(), 100)
        })));
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

app.get('/', (req, res) => res.send('🚀 UniMatch Backend v2 Ready'));
server.listen(process.env.PORT || 10000, () => console.log(`Puerto 10000`));