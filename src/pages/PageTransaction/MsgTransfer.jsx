import React from 'react';
import { Link } from 'react-router-dom';

const MsgTransfer = (props) => {
    return (
        <>
            <tr>
                <td>From :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['FromAddress']}>{props.txMessage['FromAddress']}</Link></td>
            </tr>
            <tr>
                <td>To :</td>
                <td>account "{props.txMessage['ToAddress']}"</td>
            </tr>
            <tr>
                <td>Source channel :</td>
                <td>{props.txMessage['SourceChannel']}</td>
            </tr>
        </>
    );
};

export default MsgTransfer;