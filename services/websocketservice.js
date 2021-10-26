import { io } from "socket.io-client"

const webSocketServerURL = process.env.NEXT_PUBLIC_WS_SERVER_URL

// export const socket = io(webSocketServerURL)
export const socket = io()