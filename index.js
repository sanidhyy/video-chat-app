const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

// initialize socket.io server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// use server
app.use(cors());

// PORT to be used
const PORT = process.env.PORT || 5000;

// check if server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// execute commands while connecting
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});

// set port to server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
