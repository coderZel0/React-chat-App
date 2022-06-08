import MessageBox from './components/MessageBox';
import {useEffect,useState,createContext} from 'react';
import './App.css';
import {io} from "socket.io-client";
import SidePanel from './components/SidePanel';
import JoinRoom from './components/JoinRoom';

export const context = createContext();

function App() {
  const [socket,setSocket] = useState()
  const [serverMessage,setServerMess] = useState({message:'',color:''});
  const [currentRoom,setCurrentRoom] = useState();
  const [show,setShow] = useState(false);
  const SERVER = 'https://mysterious-plateau-78455.herokuapp.com';
  const DEV_SERVER= "http://localhost:5000";
  

  let skt;
  useEffect(()=>{
      skt = io(SERVER);
      setSocket(skt);
      setCurrentRoom();
      skt.on("server",(msg)=>setServerMess({message:msg.message,color:''}));

  },[]);
  useEffect(()=>{
    if(!socket) return;
    
  },[socket])
  
  useEffect(()=>{
    setShow(true);
    const time =setTimeout(()=>setShow(false),4000);
    return ()=>{clearTimeout(time)};
  },[serverMessage])
  return (
    <div className="App">
      <div className={`serverMessages ${show?"":"hide"}`} style={{background:`${serverMessage.color}`}}>
        {serverMessage && <h3>{serverMessage.message}</h3>} 
      </div>
      {socket && <context.Provider value={{socket:socket,currentRoom:currentRoom,setCurrentRoom:setCurrentRoom}}>
          <SidePanel />
        </context.Provider>}
      <context.Provider value={{socket,room:currentRoom,setServerMess}}>
          {(socket && currentRoom)?<MessageBox />:<JoinRoom/>}
        </context.Provider>
    </div>
  );
}

export default App;
