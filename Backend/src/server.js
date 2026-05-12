require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const neo4j = require('neo4j-driver');

const app = express();
const server = http.createServer(app);

// Conexión a Neo4j AuraDB
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Configuración de CORS - Asegúrate de que coincida con tu URL de Vercel
const allowedOrigins = [
    "http://localhost:3000", 
    "https://unimatch-red-pi.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// RUTA: Sincronizar Perfil
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl } = req.body;
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema)
            DELETE r
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics, imageUrl });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// RUTA: Sugerencias de Matches
app.get('/api/matches/suggestions/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})-[:INTERESADO_EN]->(tema:Tema)<-[:INTERESADO_EN]-(other:Usuario)
            WHERE me <> other
            RETURN other.id AS id, other.name AS name, other.university AS university, 
                   other.imageUrl AS imageUrl, collect(tema.nombre) AS commonTopics
            ORDER BY size(commonTopics) DESC LIMIT 10
        `, { clerkId });

        res.json(result.records.map(r => ({
            id: r.get('id'),
            name: r.get('name'),
            university: r.get('university'),
            imageUrl: r.get('imageUrl'),
            commonTopics: r.get('commonTopics')
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// RUTA: Búsqueda por materia
app.get('/api/matches/search', async (req, res) => {
    const { q, clerkId } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario)-[:INTERESADO_EN]->(t:Tema)
            WHERE t.nombre =~ '(?i).*' + $query + '.*' AND u.id <> $clerkId
            RETURN DISTINCT u.id AS id, u.name AS name, u.university AS university, 
                            u.imageUrl AS imageUrl, collect(t.nombre) AS topics
            LIMIT 20
        `, { query: q, clerkId: clerkId });

        res.json(result.records.map(r => ({
            id: r.get('id'),
            name: r.get('name'),
            university: r.get('university'),
            imageUrl: r.get('imageUrl'),
            commonTopics: r.get('topics')
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.get('/', (req, res) => res.send('🚀 UniMatch Backend Ready'));

// Render usa el puerto 10000 por defecto
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
