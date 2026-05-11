require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const neo4j = require('neo4j-driver');

const app = express();
const server = http.createServer(app);

// Configuración de Neo4j
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Configuración de CORS
const allowedOrigins = [
    "http://localhost:3000", 
    "https://unimatch-red-pi.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// --- NUEVA RUTA: Sincronización de Perfil con Neo4j ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, 
                u.university = $university,
                u.imageUrl = $imageUrl,
                u.lastUpdate = datetime()
            
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema)
            DELETE r
            
            WITH u
            UNWIND $topics AS temaNombre
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics, imageUrl });

        res.json({ success: true, message: "Grafo actualizado correctamente" });
    } catch (error) {
        console.error("Error en Neo4j:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

// Ruta de salud del servidor
app.get('/', (req, res) => {
    res.send('🚀 Servidor UniMatch en línea y conectado a Neo4j');
});

const PORT = process.env.PORT || 8000; 
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});