import http from "http";
import { Server } from "socket.io";
import app from "./app";
import config from "./config/config";

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, change this for production
  },
});

// Listen for client connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Export the Socket.IO instance
export { io };

// Start the server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
