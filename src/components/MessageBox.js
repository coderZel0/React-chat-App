import {React,useState,useEffect,useRef,useContext} from 'react'
import Message from './Message'
import './messageBox.css'
import {context} from '../App'


const MessageBox = () => {
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState({sid:null,message:''});
    const [roomMsg,setRoomMsg] = useState('');
    const [showRoomMsg,setShow] = useState(false);
    const msgBox = useRef();

    const {socket,room} = useContext(context);
    
    const handleChange =(e)=>{
            setMessage({sid:socket.id,message:e.target.value});
    }
    const onEnter =()=>{
        if(!(message.message/* && message.sid*/)) return;

        setMessages([...messages,message]) 
        socket.emit('globalMessage',message);
        setMessage({...message,message:''}) 
    }
    useEffect(()=>{
        socket.on('globalMessage',(msg)=>{
            setMessages([...messages,msg]);
            console.log('onglobal',messages);
        })
    },[messages]);

    useEffect(()=>{
        if(!room) return;
        socket.on(`${room.roomId}RoomMsg`,(msg)=>{
            setRoomMsg(msg.message);
            setShow(true);
            console.log("server",msg);
        })
        
    },[room])

    useEffect(()=>{
        console.log('onchange',messages);
        msgBox.current.scrollTop = msgBox.current.scrollHeight;
    },[messages])

    useEffect(()=>{
        const time = setTimeout(()=>{
            if(showRoomMsg){
                setShow(false);
            }
        },3000)
        return clearTimeout(time);
    },[showRoomMsg,roomMsg])

    return (
        <div className="msgContainer">
            {showRoomMsg && <div className='roomMsg'>{roomMsg && roomMsg}</div>}
            <div className="roomInfo">
                {room && <h2>{room.roomName}#{room.roomId}</h2>}
            </div>
            <div ref={msgBox} className="msgBox">
                {messages.length>0 && messages.map((msg,index)=>{
                    return <Message socket={socket} key={index} message={msg}/>
                })
                }
            </div>
            <div className="msgInput">
                <input placeholder="write a message" value ={message.message} onKeyPress={(e)=>{if(e.key==='Enter'){onEnter()}}} onChange={(e)=>{handleChange(e)}}></input>
            </div>
        </div>
    )
}

export default MessageBox
