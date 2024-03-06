// import socketIO from "socket.io-client";
// export const socket = socketIO.connect("https://workload.sfedu.ru/");

import io from "socket.io-client";

const socket = io("https://workload.sfedu.ru/");

socket.on("connect", () => {
  console.log("Connected to socket");
});

export default socket;
