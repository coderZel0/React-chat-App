import {React,useState,useContext, useEffect} from 'react'
import './rooms.css'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Button } from '@material-ui/core';
import {context} from '../App';

const OpenRooms = () => {
    const [hovering,setHovering] =  useState(false);
    const [showform,setShowForm] = useState(false);
    const [showJoinform,setJoinForm] = useState(false);
    const [roomname,setRoom] = useState('');
    const [roomid,setId] = useState('');

    const {socket,currRoom,setCurrentRoom} = useContext(context);

    const onArrowClick =()=>{
       setHovering((state)=>!state);
       setShowForm(false);
       setJoinForm(false);
    }
    const displayForm =({type})=>{
        if(type==="join"){
            setJoinForm((state)=>!state);
            setShowForm(false);
        }
        else if(type==="create"){
            setShowForm((state)=>!state);
            setJoinForm(false);
        }
        
    }
    const createRoom = ()=>{
        socket.emit("createRoom",{Name:roomname,Owner:socket.id,type:"public",max:100,current:0});
    }
    const joinRoom = (id)=>{
        if(currRoom){
            socket.emit('leaveRoom',currRoom.roomId);
        }
        socket.emit('joinRoom',id);
        socket.on('roomJoined',(room)=>{
            setCurrentRoom(room);
            console.log(room);
        })
    }
    const handleSubmit =(e)=>{
        e.preventDefault();
    }

    useEffect(()=>{
        socket.on('roomJoined',(room)=>{
            setCurrentRoom(room);
        })
    },[])

    return (
        <div className="rooms">
            <div className="heading">
                <h2>Open Rooms</h2>

                
                <div className="options">
                    <div className='iconArrowdown' onClick={()=>onArrowClick()}><KeyboardArrowDownIcon size="medium"/></div>
                    <div className={`menu ${hovering?"visible":null}`}>
                        <div className="option">
                            <Button onClick={()=>displayForm({type:"create"})} variant="contained" color="primary">Create Room</Button>
                            <div className="formContainer">
                                <div className={`form ${showform?"formVisible":null}`}>
                                    <form onSubmit={(e)=>handleSubmit(e)}>
                                        <div className="roomLabel">
                                            <label htmlFor="roomname">Name:</label>
                                            <input value={roomname} onChange={(e)=>setRoom(e.target.value)} type="text" id="roomname"/>
                                        </div>
                                        <div className='createButton'>
                                            <Button onClick={()=>createRoom()} variant="contained" color="secondary">Create</Button>
                                        </div>                               
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="option">
                            <Button onClick={()=>displayForm({type:"join"})} variant="contained" color="primary">Join Room</Button>
                            <div className="formContainer">
                                <div className={`form joinform ${showJoinform?"formVisible":null}`}>
                                    <form onSubmit={(e)=>handleSubmit(e)}>
                                        <div className="roomLabel">
                                            <label htmlFor="roomid">ID:</label>
                                            <input value={roomid} onChange={(e)=>setId(e.target.value)} type="text" id="roomid"/>
                                        </div>
                                        <div className='createButton'>
                                            <Button onClick={()=>joinRoom(roomid)} type="submit" variant="contained" color="secondary">Join</Button>
                                        </div>                               
                                    </form>
                                </div>
                            </div>
                        </div>
                            
                    </div>                      
                </div>

            </div>
            <div>
                <h4>Room1</h4>
                <h4>Room1</h4>
                <h4>Room1</h4>
                <h4>Room1</h4>
            </div>
            
            <div>
                <div>
                    <h2>Your Rooms</h2>
                </div>
            </div>
        </div>
    )
}

export default OpenRooms
