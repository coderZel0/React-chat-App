import MessageBox from './components/MessageBox';
import {useEffect,useState,createContext} from 'react';
import './App.css';
import {io} from "socket.io-client";
import SidePanel from './components/SidePanel';

export const context = createContext();

function App() {
  const [socket,setSocket] = useState()
  const [serverMessage,setServerMess] = useState('');
  const [currentRoom,setCurrentRoom] = useState();
  const [show,setShow] = useState(false);
  const SERVER = 'https://mysterious-plateau-78455.herokuapp.com/';
  

  let skt;
  useEffect(()=>{
      skt = io(SERVER);
      setSocket(skt);
      setCurrentRoom();
      skt.on("server",(msg)=>setServerMess(msg.message));

  },[]);
  useEffect(()=>{
    if(!socket) return;
    
  },[socket])
  
  useEffect(()=>{
    setShow(true);
    setTimeout(()=>setShow(false),4000);

  },[serverMessage])
  return (
    <div className="App">
      <div className={`serverMessages ${show?"":"hide"}`}>{serverMessage && <h3>{serverMessage}</h3>}</div>
      {socket && <context.Provider value={{socket:socket,currentRoom:currentRoom,setCurrentRoom:setCurrentRoom}}>
          <SidePanel />
        </context.Provider>}
      {socket && <context.Provider value={{socket,room:currentRoom}}>
          <MessageBox />
        </context.Provider>}
    </div>
  );
}

export default App;
