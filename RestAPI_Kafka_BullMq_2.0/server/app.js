
const express = require("express");
const connectDB = require("./db/conn");
const router = require("./routes/router");
const startServer = require('./Cluster/clust');
const redisClient = require("./Redis/redisClient");
const TimeDate = require("./rateLimite/rate"); // Correct import
const cors = require('cors');
const app = express();
const port = 9000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};



// Apply middlewares before starting cluster workers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(TimeDate); // Apply the middleware globally
app.use(router);



// Start cluster (workers will listen)
startServer(app, port);




// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});


module.exports = app; // Export only `app`