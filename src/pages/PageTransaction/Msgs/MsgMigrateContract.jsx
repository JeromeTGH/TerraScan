import React from 'react';
import { Link } from 'react-router-dom';

const MsgMigrateContract = (props) => {
    return (
        <>
            <tr>
                <td>Code ID :</td>
                <td>{props.txMessage['code_id']}</td>
            </tr>
            <tr>
                <td>Contract :</td>
                <td><Link to={"/accounts/" + props.txMessage['contract']}>{props.txMessage['contract']}</Link></td>
            </tr>
            <tr>
                <td>Msg :</td>
                <td><pre>{JSON.stringify(props.txMessage['msg'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['sender']}>{props.txMessage['sender']}</Link></td>
            </tr>
        </>
    );
};

export default MsgMigrateContract;