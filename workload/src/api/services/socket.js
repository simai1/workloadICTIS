// function socketConnect() {
//   const socketUrl =
//     "wss://workload.sfedu.ru/socket.io/?EIO=4&transport=websocket";

//   const socket = new WebSocket(socketUrl);

//   socket.onopen = () => {
//     console.log("Socket connected");
//   };
//   console.log("socket ", socket);

//   socket.onmessage = (event) => {
//     // console.log("Received message:", event.data);
//     console.log("event:", event);
//   };

//   socket.on("notificationCreated", (notification) => {
//     console.log("Test", notification);
//   });

//   socket.onmessage("notificationCreated", (data) => {
//     console.log("notificationCreated ", data);
//   });

//   socket.onerror = (error) => {
//     console.error("Socket error:", error);
//   };

//   socket.onclose = () => {
//     console.log("Socket disconnected");
//   };
// }

// export default socketConnect;

// import { io } from "socket.io-client";

// function socketConnect() {
//   const socketUrl = "https://workload.sfedu.ru";
//   const socket = io(socketUrl);
//   socket.connect();

//   socket.on("connect", () => {
//     console.log("Socket connected");
//   });
//   socket.on("notificationCreated", (data) => {
//     console.log("notificationCreated", data);
//   });

//   socket.on("event", (data) => {
//     console.log("Received event:", data);
//     // обрабатывайте полученные данные
//   });
//   console.log(socket);

//   socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });
// }

// export default socketConnect;

import socketIO from "socket.io-client";

function socketConnect() {
  const socketUrl = "https://workload.sfedu.ru";
  const socket = socketIO.connect(socketUrl);
}

export default socketConnect;
