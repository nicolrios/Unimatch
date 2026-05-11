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

const allowedOrigins = [
    "http://localhost:3000", 
    "https://unimatch-red-pi.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// RUTA 1: Sincronizar Perfil (Guarda tus temas en el grafo)
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

// RUTA 2: Sugerencias de Matches (Busca usuarios reales con temas comunes)
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

        const suggestions = result.records.map(record => ({
            id: record.get('id'),
            name: record.get('name'),
            university: record.get('university'),
            imageUrl: record.get('imageUrl'),
            commonTopics: record.get('commonTopics')
        }));
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.get('/', (req, res) => res.send('🚀 UniMatch Backend Ready'));

const PORT = process.env.PORT || 8000; 
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));