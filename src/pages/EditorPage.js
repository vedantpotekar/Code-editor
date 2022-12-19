import React, { useState } from 'react';
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () => {
    const [clients,setclients] = useState([
        {socketId: 1, username: 'Vedant P'},
        {socketId: 2, username: 'Radhika'},
        {socketId: 3, username: 'Leonard'},
        {socketId: 4, username: 'Sheldon C'}
    ]);
    return (
        <div className="mainWrap">
            <div className="leftSide">
                <div className="leftInner">
                    <div className="logo">
                        <img className='logo-img' src="/code-sync.png" alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {
                            clients.map((client)=>(
                                <Client key={client.socketId} username={client.username}/>
                            ))
                        }
                    </div>
                </div>
                <button className='btn copy-btn'>Copy Room-ID</button>
                <button className='btn leave-btn'>Leave</button>
            </div>
            <div className="editorSide">
                <Editor/>
            </div>
        </div>
    );
};

export default EditorPage;