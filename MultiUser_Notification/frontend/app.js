// cd project-root
// npm create vite@latest client -- --template react
// cd client
// npm install socket.io-client axios



import { useEffect, useState } from "react";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:9000", {
  withCredentials: true,
});

export default function App() {
  const [messages, setMessages] = useState([]);
  const userId = "user123"; // 🔑 dynamic in real app (JWT/session)

  useEffect(() => {
    // Register user when connected
    socket.emit("registerUser", { userId });

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("📩 Notification received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🔔 Notifications for {userId}</h1>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            [{m.timestamp || new Date().toLocaleTimeString()}] {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
