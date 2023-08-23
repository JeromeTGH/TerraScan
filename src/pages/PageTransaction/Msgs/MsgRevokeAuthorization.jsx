import React from 'react';
import { Link } from 'react-router-dom';

const MsgRevokeAuthorization = (props) => {
    return (
        <>
            <tr>
                <td>Grantee :</td>
                <td><Link to={"/accounts/" + props.txMessage['grantee']}>{props.txMessage['grantee']}</Link></td>
            </tr>
            <tr>
                <td>Granter :</td>
                <td><Link to={"/accounts/" + props.txMessage['granter']}>{props.txMessage['granter']}</Link></td>
            </tr>
            <tr>
                <td>Msg type url :</td>
                <td>{props.txMessage['msg_type_url']}</td>
            </tr>

        </>
    );
};

export default MsgRevokeAuthorization;