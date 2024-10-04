import socketIO from "socket.io-client";

function socketConnect() {
  // const socketUrl = "https://workload.sfedu.ru/apitest";
  const socketUrl = "http://192.168.120.15:3010";
  // const socket = socketIO.connect(socketUrl);

  const socket = socketIO.connect(socketUrl);

  return new Promise((resolve) => {
    socket.on("connect", (data) => {
      // console.log("Получен ответ от сервера:", data);
    });
    socket.on("notificationCreated", (data) => {
      // console.log("notificationCreated", data);
      resolve(data);
    });
    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });
  });
}

export default socketConnect;
