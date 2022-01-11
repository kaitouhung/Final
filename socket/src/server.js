const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room-postId", ({ postId }) => {
    socket.join(postId);

    socket.on("add-comment", (newComment) => {
      socket.broadcast.to(postId).emit("new-comment", newComment);
    });

    socket.on("delete-comment", (commentId) => {
      socket.broadcast.to(postId).emit("delete-commentId", commentId);
    });

    socket.on("update-comment", (newComment) => {
      socket.broadcast.to(postId).emit("update-newcomment", newComment);
    });
  });

  socket.on("join-room-topicId", ({ topicId }) => {
    socket.join(topicId);
    console.log(topicId);

    socket.on("add-topic-comment", (newTopicComment) => {
      console.log(newTopicComment);
      socket.broadcast.to(topicId).emit("new-topic-comment", newTopicComment);
    });

    // socket.on("delete-topic-comment", (commentId) => {
    //   socket.broadcast.to(postId).emit("delete-topic-commentId", commentId);
    // });

    // socket.on("update-topic-comment", (newTopicComment) => {
    //   socket.broadcast.to(postId).emit("update-topic-newTopiccomment", newTopicComment);
    // });
  });
});
