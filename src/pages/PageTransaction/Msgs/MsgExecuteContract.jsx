import React from 'react';
import { Link } from 'react-router-dom';

const MsgExecuteContract = (props) => {
    return (
        <>
            <tr>
                <td>Contract :</td>
                <td><Link to={"/accounts/" + props.txMessage['Contract']}>{props.txMessage['Contract']}</Link></td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['Sender']}>{props.txMessage['Sender']}</Link></td>
            </tr>
            <tr>
                <td>Coins :</td>
                <td>{props.txMessage['Coins']}</td>
            </tr>
            <tr>
                <td>Execute msg :</td>
                <td><pre>{JSON.stringify(props.txMessage['ExecuteMsg'], null, 2)}</pre></td>
            </tr>
        </>
    );
};

export default MsgExecuteContract;