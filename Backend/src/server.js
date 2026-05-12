require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();

// Configuración del Driver con parámetros de reconexión
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { 
        maxConnectionLifetime: 60 * 60 * 1000, // 1 hora
        maxConnectionPoolSize: 50,
        connectionTimeout: 20000 // 20 segundos para dar tiempo a despertar
    }
);

app.use(cors());
app.use(express.json());

app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "clerkId es requerido" });

    // Abrimos sesión con modo de escritura explícito
    const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });
    
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
            name: name || "", 
            university: university || "", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "" 
        });
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error de Neo4j:", error.message);
        // Si el error es de conexión, avisamos al frontend
        res.status(503).json({ error: "La base de datos está iniciando. Reintenta en unos segundos." });
    } finally {
        await session.close();
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));