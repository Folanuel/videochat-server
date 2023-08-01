const app = require('express')();

const server = require('http').createServer(app);

const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("Server is running");
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

	// socket.on('message', message => {
    // console.log('Received message:', message);
    // io.emit('message', message);
	// });


	socket.on('send-message', (message) => {
    console.log(`Received message: ${message.body}`);
    io.emit('message', message);
	});
});



server.listen(process.env.PORT||3030, () => console.log("server is running on port 3030"));