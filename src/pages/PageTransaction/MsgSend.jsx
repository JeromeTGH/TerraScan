import React from 'react';
import { Link } from 'react-router-dom';

const MsgSend = (props) => {
    return (
        <>
            <tr>
                <td>Amount : </td>
                <td>{props.txMessage['Amount']}</td>
            </tr>
            <tr>
                <td>From : </td>
                <td>account <Link to={props.txMessage['FromAddress']}>{props.txMessage['FromAddress']}</Link></td>
            </tr>
            <tr>
                <td>To : </td>
                <td>account <Link to={props.txMessage['ToAddress']}>{props.txMessage['ToAddress']}</Link></td>
            </tr>
        </>
    );
};

export default MsgSend;