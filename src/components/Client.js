import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {
    return (
        <div className="Client">
            <Avatar name={username} size={40} round={"12px"}/>
            <span className="userName">{username}</span>
        </div>
    )
}


export default Client