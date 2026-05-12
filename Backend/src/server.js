require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

app.use(cors());
app.use(express.json());

app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = $university, u.imageUrl = $imageUrl, u.career = $career
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema) DELETE r
            WITH u
            UNWIND (CASE WHEN $topics = [] THEN [null] ELSE $topics END) AS temaNombre
            WITH u, temaNombre WHERE temaNombre IS NOT NULL
            MERGE (t:Tema {nombre: temaNombre})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { 
            clerkId, 
            name: name || "Sin nombre", 
            university: university || "Sin universidad", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "Sin carrera" 
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});

app.listen(10000, () => console.log("Servidor y Chat corriendo en puerto 10000"));