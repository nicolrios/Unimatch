require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Driver con configuración de tiempo de espera extendido
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { 
        connectionTimeout: 30000, // 30 segundos para esperar a que Aura despierte
        maxConnectionLifetime: 3 * 60 * 60 * 1000 // 3 horas de vida de conexión
    }
);

app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    // El "Fix" crítico: Creamos la sesión dentro de la ruta para forzar 
    // una nueva búsqueda de servidores (Discovery) en cada intento.
    const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });
    
    try {
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
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Fallo de sincronización:", error.message);
        // Enviamos un mensaje claro al Frontend
        res.status(503).json({ error: "La base de datos está despertando. Por favor, reintenta en 10 segundos." });
    } finally {
        await session.close();
    }
});

const PORT = 10000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en puerto ${PORT}`));