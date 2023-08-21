import React from 'react';
import { Link } from 'react-router-dom';

const MsgUpdateClient = (props) => {
    return (
        <>
            <tr>
                <td>Signer :</td>
                <td><Link to={"/accounts/" + props.txMessage['Signer']}>{props.txMessage['Signer']}</Link></td>
            </tr>
            <tr>
                <td>Client ID :</td>
                <td>{props.txMessage['ClientID']}</td>
            </tr>
            <tr>
                <td>Header :</td>
                <td><pre>{JSON.stringify(props.txMessage['Header'], null, 2)}</pre></td>
            </tr>
        </>
    );
};

export default MsgUpdateClient;