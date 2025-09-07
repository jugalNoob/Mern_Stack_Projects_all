



const os = require('os');
const cluster = require('node:cluster');
const process = require('node:process');
const connectDB = require('../db/conn'); // Import DB connection inside cluster file too
const numCPUs = os.cpus().length;

const startServer = (app, port) => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      let worker = cluster.fork();
      worker.send('hi there'); // Optional message
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      // Restart worker on exit
      cluster.fork();
    });

    cluster.on('disconnect', (worker) => {
      console.log(`The worker #${worker.id} has disconnected`);
    });

  } else {
    // Worker process: connect to DB and start the server
    (async () => {
      try {
        await connectDB();
        console.log(`Worker ${process.pid} connected to DB`);

        process.on('message', (message) => {
          console.log(`Worker ${process.pid} received message: ${message}`);
        });

        app.get("/io", (req, res) => {
          res.send(`Worker ${process.pid} is responding`);
        });

        const server = app.listen(port, () => {
          console.log(`Worker ${process.pid} is running at http://localhost:${port}`);
        });

        server.on('error', (error) => {
          console.error('Server failed to start:', error);
        });
      } catch (error) {
        console.error(`Worker ${process.pid} failed to connect to DB or start server:`, error);
        process.exit(1);
      }
    })();
  }
};

module.exports = startServer;