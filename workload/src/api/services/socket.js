import { io } from "socket.io-client";

const socketUrl = "https://workload.sfedu.ru";
const socket = io(socketUrl, {
  transports: ["websocket"], // Использовать только транспорт websocket
});
// const socket = io.connect("https://workload.sfedu.ru/");

socket.on("connect", () => {
  console.log("Connected to socket");
});

export default socket;
