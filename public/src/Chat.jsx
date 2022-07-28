import React from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = React.useRef(io("ws://localhost:4000"));

  const [value, setValue] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [activeUser, setActiveUser] = React.useState(null);

  React.useEffect(function () {
    socket.current.on("new_message", function (socket) {
      setMessages((state) => [
        ...state,
        { text: socket.text, from: socket.from },
      ]);
      setActiveUser(socket.fromId);
    });
  }, []);

  return (
    <div>
      {messages.length > 0 &&
        messages.map((message) => (
          <div>
            <b>{message.from}</b>
            {message.text}
          </div>
        ))}
      <div>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          onClick={() => {
            socket.current.emit("response", { value: value, to: activeUser });
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
