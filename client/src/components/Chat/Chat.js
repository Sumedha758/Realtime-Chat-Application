import React, {useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;


const Chat =({ location }) =>{
     const [name, setName] = useState('');
     const [room,setRoom] =useState('');
     const [message, setMessage] =useState('');
     const [messages, setMessages] =useState([]);
     const [users, setUsers] = useState('');


    //  const ENDPOINT ='localhost:5000';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io('https://react-nodejs-chat-application.herokuapp.com/', { transports : ['websocket', 'polling', 'flashsocket']});
        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, (error) => {
            if(error) {
                alert(error);
              }
        });

        return () => {
          socket.disconnect();

          socket.off();
        }

    }, ['https://react-nodejs-chat-application.herokuapp.com/', location.search]);

    useEffect(() => {
        socket.on('message', (message)=> {
            setMessages([...messages, message]);
        });

    }, [messages]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });

    },[]);

    function sendMessage(event) {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message,messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;