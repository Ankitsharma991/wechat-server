const http = require("http");
const express = require("express");

const cors = require("cors");
const socketIO = require("socket.io");

const users = [{}];

const app = express();
const port = 5000 || process.env.PORT;
app.use(cors());

app.get("/", (req, res) => {
  console.log("Well it's working");
  res.send("HELL IT'S WORKING!!");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(user, "has Joined!");

    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });
  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message: message, id: id });
  });
  socket.on("dismiss", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
    });
    console.log(`${users[socket.id]} left`);
  });
});

server.listen(port, () => {
  console.log("Server is working on ", port);
});
