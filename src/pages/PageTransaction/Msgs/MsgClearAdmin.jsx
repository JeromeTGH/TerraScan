import React from 'react';
import { Link } from 'react-router-dom';

const MsgClearAdmin = (props) => {
    return (
        <>
            <tr>
                <td>Contract :</td>
                <td><Link to={"/accounts/" + props.txMessage['contract']}>{props.txMessage['contract']}</Link></td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['sender']}>{props.txMessage['sender']}</Link></td>
            </tr>
        </>
    );
};

export default MsgClearAdmin;