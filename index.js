import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile("public/index.html");
});

server.listen(PORT, () => {
  console.log(`server up and running on PORT ${PORT}`);

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  bot.on("message", async function (msg) {
    const { type } = msg?.chat;
    const { id } = msg.from;

    if (type === "private") {
      const { total_count, photos } = await bot.getUserProfilePhotos(id);
      console.log(total_count);
    }

    io.emit("new_message", {
      text: msg.text,
      fromId: msg.chat.id,
      from: `${msg.from.last_name} ${msg.from.first_name}`,
    });
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("response", (socket) => {
      bot.sendMessage(socket.to, socket.value);
    });
  });
});
