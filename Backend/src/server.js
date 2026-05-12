require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();

// Configuración de CORS abierta para evitar bloqueos del navegador
app.use(cors());
app.use(express.json());

// Configuración del Driver de Neo4j
// Nota: La URI en Render debe ser bolt+s:// o neo4j+s://
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    {
        disableLosslessIntegers: true // Mejora la compatibilidad de números con JS
    }
);

// Verificar conexión al iniciar (verás esto en los Logs de Render)
const verificarConexion = async () => {
    try {
        await driver.verifyConnectivity();
        console.log("✅ Conexión establecida con Neo4j Aura satisfactoriamente");
    } catch (error) {
        console.error("❌ Error de conexión inicial:", error.message);
    }
};
verificarConexion();

// --- RUTA PRINCIPAL DE SINCRONIZACIÓN ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
    
    if (!clerkId) {
        return res.status(400).json({ error: "clerkId es requerido" });
    }

    const session = driver.session();
    
    try {
        console.log("🚀 Iniciando escritura para el usuario:", clerkId);

        // Ejecución directa de la consulta Cypher
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
            name: name || "Estudiante", 
            university: university || "", 
            topics: topics || [], 
            imageUrl: imageUrl || "", 
            career: career || "" 
        });

        console.log("✅ Sincronización exitosa en la base de datos");
        res.status(200).json({ success: true });

    } catch (error) {
        console.error("❌ Fallo crítico en Neo4j:", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close(); // Siempre cerramos la sesión
    }
});

// Ruta de prueba para saber si el servidor responde
app.get('/', (req, res) => res.send('UniMatch API - Online 🚀'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});