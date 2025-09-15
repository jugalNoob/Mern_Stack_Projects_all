import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:9000", {
  withCredentials: true,
});

function Dashboard() {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("dashboard_data", (payload) => {
      console.log("[Socket.IO] Dashboard update received:", payload);
      setData(payload); // replace old data
    });

    return () => {
      socket.off("dashboard_data");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>📊 Live Dashboard</h2>
      <p style={{ fontSize: "16px" }}>
        Status:{" "}
        <span
          style={{
            color: connected ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </span>
      </p>

      <div style={{ marginTop: "20px" }}>
        {!data ? (
          <p style={{ color: "#888" }}>No data yet...</p>
        ) : (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              maxWidth: "800px",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "20px" }}>
              {data.type}{" "}
              <span style={{ fontSize: "14px", color: "#666" }}>
                at {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            </h3>

            {/* CPU Section */}
            {data.data.cpuUsage && (
              <>
                <h4 style={{ marginTop: "15px", marginBottom: "8px" }}>🖥️ CPU Usage</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {data.data.cpuUsage.map((core, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "10px",
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        textAlign: "center",
                      }}
                    >
                      <strong>Core {core.core}</strong>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          color: "#2563eb",
                        }}
                      >
                        {core.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Network Section */}
            {data.data.networkInfo && (
              <>
                <h4 style={{ marginTop: "20px", marginBottom: "8px" }}>🌐 Network Info</h4>
                <div
                  style={{
                    background: "#f3f4f6",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <p><strong>Hostname:</strong> {data.data.networkInfo.hostname}</p>
                  <p><strong>Platform:</strong> {data.data.networkInfo.platform}</p>
                  <p><strong>Uptime:</strong> {Math.floor(data.data.networkInfo.uptime / 60)} min</p>
                  <p><strong>CPUs:</strong> {data.data.networkInfo.cpus}</p>
                  <p><strong>Total Memory:</strong> {(data.data.networkInfo.memory.total / (1024 ** 3)).toFixed(2)} GB</p>
                  <p><strong>Free Memory:</strong> {(data.data.networkInfo.memory.free / (1024 ** 3)).toFixed(2)} GB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
