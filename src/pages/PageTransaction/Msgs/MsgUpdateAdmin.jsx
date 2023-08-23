import React from 'react';
import { Link } from 'react-router-dom';

const MsgUpdateAdmin = (props) => {
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
            <tr>
                <td>New admin :</td>
                <td><Link to={"/accounts/" + props.txMessage['new_admin']}>{props.txMessage['new_admin']}</Link></td>
            </tr>
        </>
    );
};

export default MsgUpdateAdmin;