import { createServer } from "node:http"
import { Server } from "socket.io" 

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.APP_URL
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);
})

export const socket = httpServer.listen(process.env.SOCKET_IO_PORT)