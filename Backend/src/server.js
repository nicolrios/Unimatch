require('dotenv').config();
const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE CONEXIÓN NEO4J ---
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    { disableLosslessIntegers: true }
);

// --- 1. PERFIL: SINCRONIZACIÓN Y NORMALIZACIÓN DE NODOS ---
app.post('/api/profile/sync', async (req, res) => {
    const { clerkId, name, university, topics, career, bio } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MERGE (u:Usuario {id: $clerkId})
            SET u.name = $name, u.university = trim($university), 
                u.career = trim($career), u.bio = $bio
            WITH u
            OPTIONAL MATCH (u)-[r:INTERESADO_EN]->(:Tema) DELETE r
            WITH u
            UNWIND (CASE WHEN $topics = [] THEN [null] ELSE $topics END) AS temaNombre
            WITH u, temaNombre WHERE temaNombre IS NOT NULL
            MERGE (t:Tema {nombre: toUpper(trim(temaNombre))})
            MERGE (u)-[:INTERESADO_EN]->(t)
            RETURN u
        `, { clerkId, name, university, topics: topics || [], career, bio });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 2. BUSCADOR: FILTRADO INSENSIBLE A MAYÚSCULAS/MINÚSCULAS ---
app.get('/api/matches/search', async (req, res) => {
    const { clerkId, topic } = req.query;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})
            MATCH (target:Usuario)-[:INTERESADO_EN]->(t:Tema)
            WHERE t.nombre CONTAINS toUpper(trim($topic)) 
              AND target.id <> $clerkId
              AND NOT (me)-[:SOLICITUD]-(target)
            RETURN DISTINCT target {.*} AS user
            LIMIT 12
        `, { clerkId, topic });
        res.json({ results: result.records.map(r => r.get('user')) });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 3. MATCHES: ENVIAR SOLICITUD ---
app.post('/api/matches/request', async (req, res) => {
    const { fromId, toId } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MATCH (a:Usuario {id: $fromId}), (b:Usuario {id: $toId})
            MERGE (a)-[r:SOLICITUD {status: 'pendiente', desde: $fromId}]->(b)
            RETURN r
        `, { fromId, toId });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 4. MATCHES: ACEPTAR SOLICITUD ---
app.post('/api/matches/accept', async (req, res) => {
    const { fromId, toId } = req.body;
    const session = driver.session();
    try {
        await session.run(`
            MATCH (a:Usuario {id: $fromId})-[r:SOLICITUD]->(b:Usuario {id: $toId})
            SET r.status = 'aceptado'
            RETURN r
        `, { fromId, toId });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 5. PANEL CENTRAL: SUGERENCIAS NORMALIZADAS POR AFINIDAD (CARRERA Y TEMAS) ---
app.get('/api/matches/panel/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (me:Usuario {id: $clerkId})
            
            // Buscamos usuarios que no tengan solicitudes previas conmigo
            OPTIONAL MATCH (s:Usuario)
            WHERE s.id <> $clerkId AND NOT (me)-[:SOLICITUD]-(s)
            
            // Contamos temas en común
            OPTIONAL MATCH (me)-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(s)
            WITH me, s, count(t) as temasEnComun
            WHERE s IS NOT NULL
            
            // Puntuamos afinidad ignorando si usaron mayúsculas, minúsculas o espacios de más
            WITH s, temasEnComun, me,
                 (CASE WHEN toUpper(trim(s.career)) = toUpper(trim(me.career)) THEN 2 ELSE 0 END + temasEnComun) as pesoAfinidad
            WHERE pesoAfinidad > 0
            
            ORDER BY pesoAfinidad DESC
            WITH me, collect(DISTINCT s {.*})[0..6] as sugFinales
            
            // Solicitudes recibidas
            OPTIONAL MATCH (remitente:Usuario)-[:SOLICITUD {status: 'pendiente'}]->(me)
            WITH sugFinales, collect(DISTINCT remitente {.*}) as req, me
            
            // Enlaces confirmados activos
            OPTIONAL MATCH (me)-[:SOLICITUD {status: 'aceptado'}]-(amigo:Usuario)
            
            RETURN sugFinales as sug, req, collect(DISTINCT amigo {.*}) as active
        `, { clerkId });
        
        const record = result.records[0];
        res.json({
            suggestions: record.get('sug') || [],
            requests: record.get('req') || [],
            active: record.get('active') || []
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

// --- 6. CONTADOR DE NOTIFICACIONES ---
app.get('/api/notifications/count/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (u:Usuario {id: $clerkId})
            OPTIONAL MATCH (p:Usuario)-[r:SOLICITUD {status: 'pendiente'}]->(u)
            RETURN count(r) as total
        `, { clerkId });
        res.json({ count: result.records[0].get('total') });
    } catch (e) { res.status(500).json({ error: e.message }); }
    finally { await session.close(); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 UniMatch Backend en puerto ${PORT}`));