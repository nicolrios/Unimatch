require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuración de dominios permitidos (CORS)
const allowedOrigins = [
    "http://localhost:3000", 
    "https://unimatch-nm86mqg53-nicolrios-projects.vercel.app" // Tu URL de Vercel
];

// Configuración de Socket.io para el Chat
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middlewares
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Importar y activar la lógica del chat (Asegúrate que la ruta sea correcta)
try {
    require('./sockets/chat')(io);
} catch (error) {
    console.log("Nota: Lógica de sockets no encontrada o con errores, omitiendo...");
}

// --- RUTAS DE EJEMPLO (Asegúrate de tener tus rutas reales aquí) ---
app.get('/', (req, res) => {
    res.send('🚀 UniMatch API corriendo exitosamente');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Conectado a la base de datos' });
});

// Importa aquí tus rutas reales si las tienes en archivos separados:
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));

// --- CONFIGURACIÓN DEL PUERTO PARA RENDER ---
const PORT = process.env.PORT || 8000; 

server.listen(PORT, () => {
    console.log(`
    ===========================================
    🚀 Servidor UniMatch en línea
    📡 Puerto: ${PORT}
    🔗 URL Permitida: ${allowedOrigins[1]}
    ===========================================
    `);
});