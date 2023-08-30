import React from 'react';
import { Link } from 'react-router-dom';

const MsgDeposit = (props) => {
    return (
        <>
            <tr>
                <td>Depositor :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['Depositor']}>{props.txMessage['Depositor']}</Link></td>
            </tr>
            <tr>
                <td>Add :</td>
                <td>{props.txMessage['Amount']}</td>
            </tr>
            <tr>
                <td>On proposal :</td>
                <td><Link to={"/proposals/" + props.txMessage['ProposalID']}>#{props.txMessage['ProposalID']} : {props.txMessage['ProposalTitle']}</Link></td>
            </tr>
        </>
    );
};

export default MsgDeposit;