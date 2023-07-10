import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';

const EditorPage = () => {

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const {roomID} = useParams();
    const reactNavigator = useNavigate();
    const [clients,setclients] = useState([]);


    useEffect(()=>{
        const init=async()=>{
            socketRef.current=await initSocket();
            socketRef.current.on('connect_error',(err)=>handleErrors(err));
            socketRef.current.on('connect_failed',(err)=>handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later');
                reactNavigator('/');
            }


            socketRef.current.emit(ACTIONS.JOIN,{
                roomID,
                username: location.state?.username, 
            });


            // listening for joined eventt
            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=>{
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined`);
                }
                setclients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code: codeRef.current,
                    socketId,
                });
            });

            // listening for disconnection
            socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                toast.success(`${username} has left the room`);
                setclients((prev)=>{
                    return prev.filter(client=>client.socketId !== socketId);
                });
            });

        }
        init();

        return ()=>{
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }

    },[]);

    async function copyRoomID(){
        try{
            await navigator.clipboard.writeText(roomID);
            toast.success(`Room-id copied to clipboard`);
        }catch(err){
            toast.error(`Error copying to clipboard`);
            console.error(err);
        }
    }

    function leaveRoom(){
        reactNavigator('/');
    }

    if(!location.state){
        return <Navigate to="/"/>;
    }

    return (
        <div className="mainWrap">
            <div className="leftSide">
                <div className="leftInner">
                    <div className="logo">
                        <img className='logo-img' src="/code-sync.png" alt="logo" />
                    </div>
                    <h4>Connected users</h4>
                    <div className="clientList">
                        {
                            clients.map((client)=>(
                                <Client key={client.socketId} username={client.username}/>
                            ))
                        }
                    </div>
                </div>
                <button className='btn copy-btn' onClick={copyRoomID}>Copy Room-ID</button>
                <button className='btn leave-btn'onClick={leaveRoom}>Leave</button>
            </div>
            <div className="editorSide">
                <Editor socketRef={socketRef} roomID={roomID} onCodeChange={(code)=>{codeRef.current = code;}}/>
            </div>
        </div>
    );
};

export default EditorPage;