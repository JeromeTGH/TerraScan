import React from 'react';
import { Link } from 'react-router-dom';

const MsgModifyWithdrawAddress = (props) => {
    return (
        <>
            <tr>
                <td>Delegator address :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['delegator_address']}>{props.txMessage['delegator_address']}</Link></td>
            </tr>
            <tr>
                <td>Withdraw address :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['withdraw_address']}>{props.txMessage['withdraw_address']}</Link></td>
            </tr>
        </>
    );
};

export default MsgModifyWithdrawAddress;