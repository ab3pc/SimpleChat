// const express = require('express');
// //Достаем Библиотеки

// const app = express();
// //создаем экспресс приложение
// const server = require('http').Server(app);
// // говорим - создай сервер http (благодаря библиотеке http)
// //и говорим что он должен работать через переменную app .Server(app) через express
// const io = require("socket.io")(server, {
// 	cors: {
// 	  origin: "*",
// 	},
//   });
// // берем наш сервер и подключаем сокеты
// //и передаем то что вернет useSocket(server) в переменную io

const express = require("express");
const port = process.env.PORT || 3000;
const { createServer } = require("http");
const { Server } = require("socket.io");




const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Указиваем что мое експресс-приложение понимает что есть запросы,
//которые могут отправлять из запросом данные в req.body

const rooms = new Map();

// настройка веб
app.get("/rooms/:id", (req, res) => {
  const { id: roomNumber } = req.params;

  const obj = rooms.has(roomNumber)
    ? {
        users: [...rooms.get(roomNumber).get("users").values()],
        messages: [...rooms.get(roomNumber).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomNumber, userName } = req.body;
  if (!rooms.has(roomNumber)) {
    rooms.set(
      roomNumber,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }

  res.send();
});

// настройка сокетов
io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomNumber, userName }) => {
    socket.join(roomNumber);
    rooms.get(roomNumber).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomNumber).get("users").values()];
    socket.broadcast.to(roomNumber).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomNumber, userName, text }) => {
	  const obj = {
		userName,
		text 
	}
    rooms.get(roomNumber).get("messages").push(obj);
	socket.broadcast.to(roomNumber).emit("ROOM:NEW_MESSAGE", obj);

  });


  socket.on("disconnect", () => {
    rooms.forEach((value, roomNumber) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(roomNumber).emit("ROOM:SET_USERS", users);
      }
    });
  });
  console.log("user connected", socket.id);
});

//Запуск нашего сервера
server.listen(port, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Server is loaded!");
});

/////////////////
