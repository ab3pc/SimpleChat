import axios from "axios";
import React from "react";



function LoginForm({ onLogin }) {
  const [roomNumber, setRoomNumber] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!roomNumber || !userName) {
      return alert("Wrong data!");
    }
    const obj = {
      roomNumber,
      userName,
    };
    setLoading(true);
    await axios.post("/rooms", obj);
    onLogin(obj);
  };

  return (
    <div className="login-form">
      <input
        type="number"
        placeholder="Room №"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your name, please"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button disabled={isLoading} className="btn btn-form" onClick={onEnter}>
        {isLoading ? "Loading..." :  "Enter"}
	
      </button>
    </div>
  );
}

export default LoginForm;
