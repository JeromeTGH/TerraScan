import React from 'react';
import { Link } from 'react-router-dom';

const MsgInstantiateContract = (props) => {
    return (
        <>
            <tr>
                <td>Admin :</td>
                <td><Link to={"/accounts/" + props.txMessage['Admin']}>{props.txMessage['Admin']}</Link></td>
            </tr>
            <tr>
                <td>Code ID :</td>
                <td>{props.txMessage['CodeID']}</td>
            </tr>
            <tr>
                <td>Funds :</td>
                <td>{props.txMessage['Funds']}</td>
            </tr>
            <tr>
                <td>Init Coins :</td>
                <td>{props.txMessage['InitCoins']}</td>
            </tr>
            <tr>
                <td>Init Msg :</td>
                <td><pre>{JSON.stringify(props.txMessage['InitMsg'], null, 2)}</pre></td>
            </tr>
            <tr>
                <td>Label :</td>
                <td>{props.txMessage['Label']}</td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['Sender']}>{props.txMessage['Sender']}</Link></td>
            </tr>
        </>
    );
};

export default MsgInstantiateContract;