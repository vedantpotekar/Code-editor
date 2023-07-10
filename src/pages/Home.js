import React, { useState } from 'react';
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [roomid,setroomid]=useState('');
    const [username,setusername]=useState('');
    const navigate = useNavigate();
    const createNewRoom = (e) => {
        e.preventDefault();
        const id=uuidV4();
        setroomid(id);
        toast.success('Created a new room');
        // console.log(id);
    }

    const joinRoom = (e) => {
        if(!roomid || !username) toast.error('Room-ID and username is required');
        else{
            navigate(`/editor/${roomid}`,{
                state: {
                    username,
                }
            })
        }
    }

    const handleEnter = (e) =>{
        // console.log('event',e.code);
        if(e.code==='Enter'){
            joinRoom();
        }
    }


    return (
        <div className="homeWrapper">
            <div className="formWrapper">
                <img className="titleImg" src="/code-sync.png" alt="code-sync-title" />
                <h4 className="mainLabel">Paste invitation ROOM-ID</h4>
                <div className="inputGroup">
                    <input
                        type="text" 
                        className="inputBox" 
                        placeholder='ROOM-ID' 
                        value={roomid} 
                        onChange={(e)=>setroomid(e.target.value)}
                        onKeyUp={handleEnter}
                        />
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder='USERNAME'
                        value={username} 
                        onChange={(e)=>setusername(e.target.value)}
                        onKeyUp={handleEnter}
                        />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp; 
                        <a href="" onClick={createNewRoom} className="createNewBtn">new room</a>.
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with ❤️ by <a href="https://www.linkedin.com/in/vedant-potekar-b3a128207/">Vedant</a></h4>
            </footer>
        </div>
    );
};

export default Home;