import {React,useState,useEffect,useRef,useContext} from 'react'
import Message from './Message'
import './messageBox.css'
import {context} from '../App'


const MessageBox = () => {
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState({username:'',from:'',sid:null,to:'',message:''});
    const [roomMsg,setRoomMsg] = useState('');
    const [showRoomMsg,setShow] = useState(false);
    const msgBox = useRef();

    const {socket,room,setServerMess} = useContext(context);
    
    const handleChange =(e)=>{
            setMessage({...message,sid:socket.id,message:e.target.value});
    }
    const onEnter =()=>{
        if(!(message.message/* && message.sid*/)) return;
        if(!room) return;
        const mesg = message.message;
        /*const msg = {
            message:mesg,
            from:socket.id,
            to:room.roomId,
            username:'',
            sid:socket.id
        };*/
        setMessages([...messages,message]) 
        //socket.emit('globalMessage',message);
        socket.emit('message',message);
        setMessage({...message,message:''}) 
    }
    
    useEffect(()=>{
        socket.on('globalMessage',(msg)=>{
            setMessages([...messages,msg]);
            console.log('onglobal',messages);
        });
        if(!room) return;
        socket.on(`${room.roomId}`,(msg)=>{
            setMessages([...messages,msg]);
            console.log("room message",msg)
        });
    },[messages]);
    

    useEffect(()=>{
        if(!room) return;

        setMessage({...message,from:socket.id,to:room.roomId,username:''});
        setMessages([]); //when room changes messages state will will be empty again
        socket.on(`${room.roomId}RoomMsg`,(msg)=>{
            //setRoomMsg(msg.message);
            setServerMess({message:msg.message,color:'purple'});
            //setShow(true);
            console.log("server",msg);
        })

        
        
    },[room])

    useEffect(()=>{
        console.log('onchange',messages);
        msgBox.current.scrollTop = msgBox.current.scrollHeight;
    },[messages])

    return (
        <div className="msgContainer">
            
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
