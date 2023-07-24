import React from 'react';

const MessageLCD = (props) => {
    return (
        <>
            <p>Message (returned by LCD): {props.message}</p>
        </>
    );
};

export default MessageLCD;