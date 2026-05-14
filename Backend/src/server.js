require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true, connectionTimeout: 20000 }
);

// --- ENDPOINTS ---

// 1. Sincronización de Perfil con Estética de Temas Limpia
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, imageUrl, career } = req.body;
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
            MERGE (t:Tema {nombre: toLower(trim(temaNombre))})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics: topics || [], imageUrl, career });
        res.status(200).json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
    finally { await session.close(); }
});

// --- RUTA DE PANEL DE MATCHES COMPLETA ---
app.get('/api/matches/panel/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();

    try {
        // 1. Sugerencias: Buscamos gente que NO tenga relación previa.
        // Priorizamos temas en común, si no hay, mostramos gente de la misma carrera.
        const suggestionsQuery = `
            MATCH (u:Usuario {id: $clerkId})
            MATCH (sugerencia:Usuario)
            WHERE u <> sugerencia 
            AND NOT (u)-[:SOLICITUD]-(sugerencia)
            OPTIONAL MATCH (u)-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(sugerencia)
            WITH sugerencia, count(t) AS temasEnComun, collect(t.nombre) AS temasNombres, u
            RETURN sugerencia, temasEnComun, temasNombres
            ORDER BY temasEnComun DESC, 
                     (CASE WHEN sugerencia.career = u.career THEN 1 ELSE 0 END) DESC
            LIMIT 6
        `;

        // 2. Solicitudes Recibidas (Pendientes)
        const requestsQuery = `
            MATCH (remitente:Usuario)-[r:SOLICITUD {status: 'pendiente'}]->(u:Usuario {id: $clerkId})
            RETURN remitente
        `;

        // 3. Matches Activos (Confirmados)
        const activeQuery = `
            MATCH (u:Usuario {id: $clerkId})-[r:SOLICITUD {status: 'aceptado'}]-(m:Usuario)
            RETURN m
        `;

        const [suggRes, reqRes, activeRes] = await Promise.all([
            session.run(suggestionsQuery, { clerkId }),
            session.run(requestsQuery, { clerkId }),
            session.run(activeQuery, { clerkId })
        ]);

        res.json({
            suggestions: suggRes.records.map(r => ({
                ...r.get('sugerencia').properties,
                commonTopics: r.get('temasNombres')
            })),
            requests: reqRes.records.map(r => r.get('remitente').properties),
            active: activeRes.records.map(r => r.get('m').properties)
        });

    } catch (error) {
        console.error("Error en panel:", error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});