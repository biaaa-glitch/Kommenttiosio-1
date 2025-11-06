const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("🟢 User connected");

  socket.on("setUsername", (user) => {
    socket.data.username = user.nick;
    socket.data.color = user.color;
  });

  socket.on("chatMessage", (msg) => {
    const payload = {
      nick: socket.data.username || "Anon",
      color: socket.data.color || "#fff",
      text: typeof msg === "string" ? msg : String(msg),
      time: Date.now()
    };
    io.emit("chatMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));