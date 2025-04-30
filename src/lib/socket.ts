import { AppConfig } from '@/config'
import { io, type Socket } from 'socket.io-client'

let socket: Socket

export const connectSocket = (token: string, projectId: string) => {
  console.log('URL', AppConfig.API_URL_SOCKET)
  socket = io(AppConfig.API_URL_SOCKET, {
    auth: { token, project_id: projectId },
    transports: ['websocket'],
    autoConnect: false
  })
  socket.connect()
  return socket
}

export const getSocket = () => socket
