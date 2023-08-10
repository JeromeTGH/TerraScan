import React from 'react';
import { Link } from 'react-router-dom';

const MsgWithdrawDelegatorReward = (props) => {
    return (
        <>
            <tr>
                <td>From :</td>
                <td>validator <Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></td>
            </tr>
            <tr>
                <td>To :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['DelegatorAddress']}>{props.txMessage['DelegatorAddress']}</Link></td>
            </tr>
            <tr>
                <td>Withdraw rewards :</td>
                <td>{props.txMessage['withdrawRewards'].map((element, index) => {
                    return <span key={index}>{element}<br /></span>
                })}</td>
            </tr>
        </>
    );
};

export default MsgWithdrawDelegatorReward;