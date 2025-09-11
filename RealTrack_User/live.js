const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = 9000;

// Store user info: { userId: { socketId, lastActive } }
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", ({ userId }) => {
    const now = new Date().toISOString();
    users.set(userId, { socketId: socket.id, lastActive: now });

    // Broadcast updated users
    io.emit("onlineUsers", Array.from(users.entries()).map(([id, info]) => ({
      userId: id,
      lastActive: info.lastActive
    })));
  });

  // Update last active periodically
  socket.on("heartbeat", ({ userId }) => {
    if (users.has(userId)) {
      users.get(userId).lastActive = new Date().toISOString();
    }
  });

  socket.on("disconnect", () => {
    // Mark user offline but keep lastActive
    for (const [userId, info] of users.entries()) {
      if (info.socketId === socket.id) {
        users.delete(userId);
        console.log(`❌ ${userId} disconnected`);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(users.entries()).map(([id, info]) => ({
      userId: id,
      lastActive: info.lastActive
    })));
  });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));


import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

export default function App() {
  const [users, setUsers] = useState([]);
  const userId = "user_" + Math.floor(Math.random() * 1000);

  useEffect(() => {
    // Register user with initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("registerUser", {
          userId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }

    // Update location periodically
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("updateLocation", {
          userId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      });
    }, 5000);

    // Listen for updates
    socket.on("usersUpdate", (data) => setUsers(data));

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Users Location</h1>
      <ul>
        {users.map((u) => (
          <li key={u.userId}>
            {u.userId}: Lat {u.lat}, Lng {u.lng}
          </li>
        ))}
      </ul>
    </div>
  );
}
