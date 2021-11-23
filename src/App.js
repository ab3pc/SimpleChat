import React from "react";
import LoginForm from "./components/LoginForm";
import reducer from "./reducer";

import "./index.scss";
import socket from "./socket";
import Chat from "./components/Chat";
import axios from "axios";


function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomNumber: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });

    socket.emit("ROOM:JOIN", obj);
    const { data } = await axios.get(`/rooms/${obj.roomNumber}`);
    dispatch({
      type: "SET_DATA",
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  const addMsg = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", (message) => {
      addMsg(message);
    });
  }, []);

  window.socket = socket;


  return (
    <div className="container">
  
      {!state.joined ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <Chat {...state} addMsg={addMsg} />
      )}
    </div>
  );
}

export default App;
