import React from "react";
import socket from "../socket";

function Chat({ users, messages, roomNumber, userName, addMsg }) {
  const [msgValue, setMsgValue] = React.useState("");
	const messagesRef = React.useRef(null);

	React.useEffect(() => {
		//messagesRef.current.scrollTo(0,9999);
		messagesRef.current.scroll(0, messagesRef.current.scrollHeight);

	}, [messages]);
	const handleKeyEnter = (e) => {
		if (e.keyCode == 13) {
			console.log(e.keyCode);
			onSendMessage(e);
		}
	}
	const onSendMessage = (e) => {
		
		if(!msgValue) {
			alert('Enter please some message!');
			e.preventDefault();
			return;
		}
		e.preventDefault();
		socket.emit('ROOM:NEW_MESSAGE', {
			roomNumber,
			userName,
			text: msgValue
		});
		addMsg( {
			userName,
			text: msgValue
		})
		setMsgValue('');
	}



	const handleChangeRoom = () => {
		if(window.confirm('Change ROOM ?')) {
			window.location.reload();
		}
		
	}

  return (
    <div className="chat">
      <div className="chat-users">
        <div className="chat-users-info">
			<div>Room № <b>{roomNumber} </b></div>
			<div className='change-room' onClick = {handleChangeRoom}> Change ROOM!</div>
		 </div>
		<hr />
        <b>Online ({users.length}): </b>
        <ul>
          {users.map((user, id) => (
            <li key={user + id}>{user}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages" ref = {messagesRef}>
          {messages.map((message, id) =>  (
			 
            <div key = {roomNumber + userName + id} className={messages[id].userName === userName ? 'message': 'message other'}>
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}

        </div>

        <form>
          <textarea
            value={msgValue}
            onChange={(e) => setMsgValue(e.target.value)}
			onKeyDown={handleKeyEnter}
            placeholder="Enter your message"
            rows="4"
          ></textarea>
          <button onClick={onSendMessage}  className="btn btn-chat">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
