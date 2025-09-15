const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔥 Client connected: ${socket.id}`);

    // Join CPU or Network rooms based on client request
    socket.on("join_cpu", () => {
      socket.join("cpu");
      console.log(`Client ${socket.id} joined CPU room`);
    });

    socket.on("join_network", () => {
      socket.join("network");
      console.log(`Client ${socket.id} joined Network room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initSocket };



// const { Server } = require("socket.io");

// function initSocket(server) {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:3000", // React frontend
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`[Socket.IO] Client connected: ${socket.id}`);

//     socket.on("disconnect", () => {
//       console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
//     });
//   });

//   return io;
// }

// module.exports = { initSocket };
