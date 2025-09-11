1️⃣ Server (server.js)

No major changes from before; we just broadcast user positions:

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = 9000;

// Store connected users
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", ({ userId, lat, lng }) => {
    users.set(userId, { socketId: socket.id, lat, lng });
    io.emit("usersUpdate", Array.from(users.entries()).map(([id, data]) => ({
      userId: id,
      lat: data.lat,
      lng: data.lng,
    })));
  });

  socket.on("updateLocation", ({ userId, lat, lng }) => {
    if (users.has(userId)) {
      users.get(userId).lat = lat;
      users.get(userId).lng = lng;
      io.emit("usersUpdate", Array.from(users.entries()).map(([id, data]) => ({
        userId: id,
        lat: data.lat,
        lng: data.lng,
      })));
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, data] of users.entries()) {
      if (data.socketId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    io.emit("usersUpdate", Array.from(users.entries()).map(([id, data]) => ({
      userId: id,
      lat: data.lat,
      lng: data.lng,
    })));
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));



import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

const socket = io("http://localhost:9000");

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function App() {
  const [users, setUsers] = useState([]);
  const userId = "user_" + Math.floor(Math.random() * 1000);

  useEffect(() => {
    // Register user on initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("registerUser", {
          userId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }

    // Update location every 5 sec
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("updateLocation", {
          userId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }, 5000);

    socket.on("usersUpdate", (data) => setUsers(data));

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {users.map((user) => (
          <Marker key={user.userId} position={[user.lat, user.lng]}>
            <Popup>{user.userId}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
