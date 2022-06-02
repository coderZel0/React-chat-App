
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const genRoomID = ()=>{
    const length = 6;
    let id = '';
    for(let i=0;i<length;i++){
        id += chars.charAt(Math.random()*chars.length);
    }
    return id;
}

module.exports = genRoomID;