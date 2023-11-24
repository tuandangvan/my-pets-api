// import { Server } from "socket.io";
// const socketServer = (server) => {
//     const io = new Server(server,{ cors: "https://localhost:3001" });
//     console.log("Running socket!");
//     let onlineUsers = []
//     io.on("connection", (socket) => {
//         console.log("new connection", socket.id)
//         socket.on("addNewUser", (userId) => {
//             !onlineUsers.some(user => userId === user.userId) &&
//                 onlineUsers.push({
//                     userId,
//                     socketId: socket.id
//                 })
//             console.log("localUser", onlineUsers)
//             io.emit("getOnlineUsers", onlineUsers)
//         })
//         socket.on("sendMessage", (message) => {
//             console.log("message", message.newMessage)
//             const listUser = message.recipientIds?.filter(recipientId => onlineUsers.some(user => user.userId === recipientId._id))
//                 .map(recipientId => {
//                     const matchingUserToCheck = onlineUsers.find(user => user.userId === recipientId._id);
//                     return {
//                         userId: matchingUserToCheck.userId,
//                         socketId: matchingUserToCheck.socketId
//                     };
//                 });
//             console.log("userReadding", listUser)

//             if (listUser?.length > 0) {
//                 listUser.forEach(user => {
//                     io.to(user.socketId).emit("getMessage", message.newMessage);
//                     console.log("user.socketId", user.socketId, "newMessage", message.newMessage)
//                 });
//                 console.log("done")
//             }
//         })
//         socket.on("disconnect", () => {
//             onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
//             io.emit("getOnlineUsers", onlineUsers)
//         })
//     });
// }

// module.exports = socketServer;

import { Server } from "socket.io";
const socketServer = (server) => {
  const io = new Server(server, { cors: "https://localhost:8050" });
  console.log("Running socket!");
  let onlineUsers = [];
  // Lắng nghe kết nối từ các client
  io.on("connection", (socket) => {
    console.log("A client connected");
    socket.on("addNewUser", (userId) => {
      !onlineUsers.some((user) => userId === user.userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id
        });
      console.log("localUser", onlineUsers);
      io.emit("getOnlineUsers", onlineUsers);
    });

    // Lắng nghe sự kiện 'comment' từ client
    socket.on("comment", (data) => {
      console.log("New comment:", data);
      console.log("localUser", onlineUsers);

      // Phát sự kiện 'comment' đến tất cả các client kết nối
      io.emit("comment", data);
    });

    // Xử lý sự kiện khi client disconnect
    socket.on("disconnect", () => {
      console.log("A client disconnected");
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("localUser", onlineUsers);
    });
  });
};

module.exports = socketServer;
