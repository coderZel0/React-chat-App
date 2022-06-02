import React from 'react'
import './message.css'


const Message = ({message:{sid,message},socket}) => {
    const id = socket.id;
    const color = (sid!==null && sid!==id)?"cyan":"white";
    const right = (sid!==null && sid===id)?"right":null;
    console.log(message);
    return (
        <div className="message">
            <div className={`messageInner ${right}`} style={{background:`${color}`}}>
                <strong>{message}</strong>
            </div>
        </div>
    )
}

export default Message
