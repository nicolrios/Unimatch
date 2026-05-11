require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 1. Definimos qué dominios pueden hablar con nuestro servidor
const allowedOrigins = [
    "http://localhost:3000", // Tu PC
    "https://tu-proyecto-frontend.vercel.app" // 👈 REEMPLAZA ESTO con tu URL de Vercel
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// 2. Aplicamos el mismo filtro a las peticiones HTTP normales
app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());

// Importar y activar la lógica del chat
require('./sockets/chat')(io);

// Tus rutas de /auth, /users, etc. van aquí...

// 3. El puerto que Render nos asigne o el 8000 por defecto
const PORT = process.env.PORT || 8000; 

server.listen(PORT, () => {
    console.log(`🚀 Servidor y Chat corriendo en puerto ${PORT}`);
});