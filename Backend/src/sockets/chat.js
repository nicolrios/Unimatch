module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('📱 Nuevo usuario conectado al chat:', socket.id);

        // El usuario se une a una "sala" privada basada en su ID de Postgres
        socket.on('join_room', (userId) => {
            socket.join(userId);
            console.log(`👤 Usuario ${userId} entró a su sala privada`);
        });

        // Escuchar cuando alguien envía un mensaje
        socket.on('send_message', (data) => {
            const { receiverId, senderId, message } = data;
            
            // Enviamos el mensaje directamente al receptor (en tiempo real)
            io.to(receiverId).emit('receive_message', {
                senderId,
                message,
                timestamp: new Date()
            });
            
            console.log(`✉️ Mensaje de ${senderId} para ${receiverId}`);
        });

        socket.on('disconnect', () => {
            console.log('👋 Usuario desconectado');
        });
    });
};