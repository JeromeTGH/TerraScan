import React from 'react';
import { Link } from 'react-router-dom';

const MsgFundCommunityPool = (props) => {
    return (
        <>
            <tr>
                <td>Depositor :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['Depositor']}>{props.txMessage['Depositor']}</Link></td>
            </tr>
            <tr>
                <td>Amount :</td>
                <td>{props.txMessage['Amount']}</td>
            </tr>
            <tr>
                <td>Recipient :</td>
                <td>community pool, through account <Link to={"/accounts/" + props.txMessage['Recipient']}>{props.txMessage['Recipient']}</Link></td>
            </tr>
        </>
    );
};

export default MsgFundCommunityPool;