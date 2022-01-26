import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { Message } from './types/message'

const app = express()

app.use(cors())
app.use(express.json())

const serverHttp = http.createServer(app)
const io = new Server(serverHttp, {
	cors: {
		origin: 'http://localhost:8080',
		methods: ['GET', 'POST']
	}
})

io.on('connection', (socket) => {
	console.log(`SocketID: ${socket.id}`)

	socket.on('test_room', (data) => {
		socket.join(data)
	})

	socket.on('send_message', (data: Message) => {
		socket.to(data.room).emit('receive_message', data)
	})

	socket.on('disconnect', () => console.log('User Disconnected'))
})

serverHttp.listen(3000, () => console.log('Server running 👌'))
