const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

const addUser = (userInfo, socketId) => {
  const { id: userId } = userInfo;
  users[userId] = {
    socketId,
    userInfo,
  };
};

const removeUser = (socketId) => {
  for (const userId in users) {
    if (users[userId].socketId === socketId) {
      delete users[userId];
      break;
    }
  }
};

const findUser = (userId) => {
  return users[userId];
};

io.on("connection", (socket) => {
  socket.on("addUser", (userInfo) => {
    addUser(userInfo, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const { receiver } = data;
    const user = findUser(receiver);

    if (user) {
      socket.to(user.socketId).emit("newMessage", data);
    }
  });

  socket.on("typingMessage", ({ receiver, sender }) => {
    const user = findUser(receiver);

    if (user) {
      socket.to(user.socketId).emit("typingNewMessage", { sender, receiver });
    }
  });

  socket.on("stopTypingMessage", ({ receiver, sender }) => {
    const user = findUser(receiver);

    if (user) {
      socket
        .to(user.socketId)
        .emit("stopTypingNewMessage", { sender, receiver });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
