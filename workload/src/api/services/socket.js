import socketIO from "socket.io-client";

function socketConnect() {
  const socketUrl = "https://workload.sfedu.ru:80/authoff";
  //const socketUrl = "http://localhost:80";
  const socket = socketIO.connect(socketUrl);

  return new Promise((resolve) => {
    socket.on("connect", (data) => {
      console.log("Получен ответ от сервера:", data);
    });

    socket.on("notificationCreated", (data) => {
      console.log("notificationCreated", data);
      resolve(data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });
}

export default socketConnect;

// socket.emit("message", {
//   text: "text 1",
//   name: " alex",
// });

// socket.on("response", (data) => {
//   console.log("Получен ответ от сервера:", data);
// });
