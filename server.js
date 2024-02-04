const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Serve static files (like HTML, CSS, JS)
app.use(express.static("public"));

// Handling the login/register page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handling the chat page
app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

// Socket.io logic for handling connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle messages
  socket.on("message", (msg) => {
    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
