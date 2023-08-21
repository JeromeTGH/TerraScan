import React from 'react';
import { Link } from 'react-router-dom';

const MsgGrantAuthorization = (props) => {
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
                <td>Grant :</td>
                <td><pre>{JSON.stringify(props.txMessage['grant'], null, 2)}</pre></td>
            </tr>

        </>
    );
};

export default MsgGrantAuthorization;