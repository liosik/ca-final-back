const express = require('express')
const cors = require('cors')
const {v4: uuid} = require("uuid")
const app = express()
const mainRouter = require('./routes/mainRouter')
const session = require('express-session')
require('dotenv').config()
const {Server} = require("socket.io")
const http = require("http")
const threadSchema = require("./schemas/threadSchema")
const mongoose = require("mongoose")
const server = http.createServer(app)

//MONGODB CONNECTION WITH DOT.ENV
mongoose.connect(process.env.MONGO_KEY).then(() => {
    console.log("Database Connection OK")
}).catch(e => {
    console.log(e)
    console.log("connection failed")
})
const origin = "http://localhost:3000"
//SOCKET
const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("connected", socket.id)

    socket.on("join_thread", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })
    socket.on("new_comment", async (data) => {
        setTimeout(async () => {
            const threads = await threadSchema.find()
            socket.to(data.id).emit("update_thread", threads)
            console.log(threads)
        }, 1000)

    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
})
//SOCKET END
app.use(express.json())


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))
//app = express serveriui
app.listen(4000)
//server = socketams
server.listen(4001)

app.use('/', mainRouter)

