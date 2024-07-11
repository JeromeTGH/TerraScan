import React from 'react';
import { Link } from 'react-router-dom';

const MsgExecuteContract = (props) => {
    return (
        <>
            <tr>
                <td>Contract :</td>
                <td><Link to={"/smartcontracts/" + props.txMessage['Contract']}>{props.txMessage['Contract']}</Link></td>
            </tr>
            <tr>
                <td>Sender :</td>
                <td><Link to={"/accounts/" + props.txMessage['Sender']}>{props.txMessage['Sender']}</Link></td>
            </tr>
            {props.txMessage['Coins'] && props.txMessage['Coins'] !== '---' ? 
                <tr>
                    <td>Coins :</td>
                    <td>{props.txMessage['Coins']}</td>
                </tr>
            : null}
            {props.txMessage['Funds'] && props.txMessage['Funds'] !== '---' ? 
                <tr>
                    <td>Funds :</td>
                    <td>{props.txMessage['Funds']}</td>
                </tr>
            : null}
            {props.txMessage['Msg'] ?
                <tr>
                    <td>Msg :</td>
                    <td><pre>{JSON.stringify(props.txMessage['Msg'], null, 2)}</pre></td>
                </tr>
            : null}
            {props.txMessage['ExecuteMsg'] ?
                <tr>
                    <td>Execute msg :</td>
                    <td><pre>{JSON.stringify(props.txMessage['ExecuteMsg'], null, 2)}</pre></td>
                </tr>
            : null}
        </>
    );
};

export default MsgExecuteContract;