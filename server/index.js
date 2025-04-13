import express from "express";
import { createServer } from "http";
import { join } from "path";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
// const io = new Server(server);

app.use(express.static(join(process.cwd(), "..", "client")));


app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }));
  
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

app.get("/", (req, res) => {
  res.sendFile(join(process.cwd(), "..", "client", "index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new user", (username) => {
    socket.username = username;
    console.log(`${username} joined`);
    socket.broadcast.emit("user joined", username);
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });
});

server.listen(3000, () => {
  console.log("Server is running at http://192.168.0.109:3000");
});
