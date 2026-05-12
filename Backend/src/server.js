require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();

// Driver de Neo4j
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// CORS ABIERTO PARA EVITAR ERRORES DE RED
app.use(cors({ origin: "*" }));
app.use(express.json());

// RUTA DE SINCRONIZACIÓN
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "Falta el ID de usuario" });

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
            UNWIND (CASE WHEN $topics = [] THEN [null] ELSE $topics END) AS temaNombre
            WITH u, temaNombre WHERE temaNombre IS NOT NULL
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { 
            clerkId, 
            name: name || "Sin nombre", 
            university: university || "", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "" 
        });
        
        res.status(200).json({ success: true, message: "Nodo sincronizado" });
    } catch (error) {
        console.error("Error en base de datos:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.get('/', (req, res) => res.send('UniMatch API Online 🚀'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));