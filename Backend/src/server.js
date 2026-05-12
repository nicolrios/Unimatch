require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión ultra-robusta
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    {
        encrypted: 'ENCRYPTION_ON',
        trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
        maxConnectionLifetime: 3 * 60 * 1000, // 3 minutos
        connectionTimeout: 30000 // 30 segundos de espera
    }
);

// Verificar la conexión en el arranque
const checkConnection = async () => {
    try {
        await driver.verifyConnectivity();
        console.log("✅ Conectado a Neo4j Aura satisfactoriamente");
    } catch (error) {
        console.error("❌ Error de conexión inicial:", error.message);
    }
};
checkConnection();

app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    const session = driver.session({ database: 'neo4j' });
    
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
        console.error("Error en Sync:", error.message);
        res.status(500).json({ error: "La base de datos está ocupada o iniciando. Reintenta ahora." });
    } finally {
        await session.close();
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Puerto ${PORT}`));