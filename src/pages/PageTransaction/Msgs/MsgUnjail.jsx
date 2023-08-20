import React from 'react';

const MsgUnjail = (props) => {
    return (
        <>
            <tr>
                <td>Address :</td>
                <td>{props.txMessage['Address']}</td>
            </tr>
        </>
    );
};

export default MsgUnjail;