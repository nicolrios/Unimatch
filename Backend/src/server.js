require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión Directa optimizada
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    {
        // Forzamos a que no intente buscar otros servidores
        maxConnectionPoolSize: 10,
        connectionTimeout: 20000 
    }
);

app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    // Usamos una sesión directa
    const session = driver.session();
    
    try {
        console.log("Intentando escribir en el nodo:", clerkId);
        await session.executeWrite(tx => 
            tx.run(`
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
                clerkId, name: name || "", university: university || "", 
                topics: topics || [], imageUrl: imageUrl || "", career: career || "" 
            })
        );
        console.log("✅ Sincronización exitosa en la DB");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error real de DB:", error.message);
        res.status(500).json({ error: "Error de comunicación con la base de datos." });
    } finally {
        await session.close();
    }
});

app.listen(10000, () => console.log("🚀 Servidor en puerto 10000"));