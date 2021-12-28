const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room-postId', ({ postId }) => {
    socket.join(postId);

    socket.on('add-comment', (newComment) => {
      socket.broadcast.to(postId).emit('new-comment', newComment);
    });

    socket.on('delete-comment', (commentId) => {
      socket.broadcast.to(postId).emit('delete-commentId', commentId);
    });

    socket.on('update-comment', (newComment) => {
      socket.broadcast.to(postId).emit('update-newcomment', newComment);
    });
  });
});
