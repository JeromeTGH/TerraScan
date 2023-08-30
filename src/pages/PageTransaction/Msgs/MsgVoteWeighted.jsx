import React from 'react';
import { Link } from 'react-router-dom';

const MsgVoteWeighted = (props) => {
    return (
        <>
            <tr>
                <td>On proposal :</td>
                <td><Link to={"/proposals/" + props.txMessage['ProposalID']}>#{props.txMessage['ProposalID']}</Link></td>
            </tr>
            <tr>
                <td>Vote choices :</td>
                <td><pre>{JSON.stringify(props.txMessage['VoteChoices'], null, 2)}</pre></td>
            </tr>
            {props.txMessage['ValidatorAddress'] ?
                <tr>
                    <td>Voter :</td>
                    <td>
                        <p>validator <Link to={"/validators/" + props.txMessage['ValidatorAddress']}>{props.txMessage['ValidatorMoniker']}</Link></p>
                        <p>through his account <Link to={"/accounts/" + props.txMessage['VoterAddress']}>{props.txMessage['VoterAddress']}</Link></p>
                    </td>
                </tr>
            :
                <tr>
                    <td>Voter's account :</td>
                    <td><Link to={"/accounts/" + props.txMessage['VoterAddress']}>{props.txMessage['VoterAddress']}</Link></td>
                </tr>
            }
        </>
    );
};

export default MsgVoteWeighted;