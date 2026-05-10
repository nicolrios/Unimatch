const redis = require('redis');

// Creamos el cliente de Redis
const client = redis.createClient({
    url: 'redis://localhost:6379' // Dirección por defecto
});

client.on('error', (err) => console.log('❌ Error en Redis:', err));
client.on('connect', () => console.log('✅ Conectado a Redis con éxito'));

// Conectamos
client.connect();

module.exports = client;