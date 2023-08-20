import React from 'react';
import { Link } from 'react-router-dom';

const MsgSubmitProposal = (props) => {
    return (
        <>
            <tr>
                <td>Proposal ID :</td>
                <td><Link to={"/proposals/" + props.txMessage['ProposalID']}>#{props.txMessage['ProposalID']}</Link></td>
            </tr>
            <tr>
                <td>Initial deposit :</td>
                <td>{props.txMessage['InitialDeposit']}</td>
            </tr>
            <tr>
                <td>Proposer :</td>
                <td>account <Link to={"/accounts/" + props.txMessage['Proposer']}>{props.txMessage['Proposer']}</Link></td>
            </tr>
            <tr>
                <td>Prop title :</td>
                <td>{props.txMessage['ContentTitle']}</td>
            </tr>
            <tr>
                <td>Prop description :</td>
                <td style={{whiteSpace: "pre-wrap"}}>{props.txMessage['ContentDescription']}</td>
            </tr>
        </>
    );
};

export default MsgSubmitProposal;