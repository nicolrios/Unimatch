require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // 1. Traer módulo HTTP nativo
const { Server } = require('socket.io'); // 2. Traer Socket.io

const app = express();
const server = http.createServer(app); // 3. Crear el servidor HTTP usando Express
const io = new Server(server, {
    cors: { origin: "*" } // Permitir que cualquier frontend se conecte
});

app.use(cors());
app.use(express.json());

// 4. Importar y activar la lógica del chat
require('./sockets/chat')(io);

// ... Tus rutas de /auth, /users, etc.

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor y Chat corriendo en puerto ${PORT}`);
});