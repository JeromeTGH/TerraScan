import React from 'react';
import styles from './BlockTxMessages.module.scss';
import { MessageIcon } from '../../application/AppIcons';
import MsgSend from './MsgSend';
import MsgVote from './MsgVote';
import MsgUnjail from './MsgUnjail';
import MsgDeposit from './MsgDeposit';
import MsgDelegate from './MsgDelegate';
import MsgUndelegate from './MsgUndelegate';
import MsgUpdateClient from './MsgUpdateClient';
import MsgExecAuthorized from './MsgExecAuthorized';
import MsgSubmitProposal from './MsgSubmitProposal';
import MsgBeginRedelegate from './MsgBeginRedelegate';
import MsgAcknowledgement from './MsgAcknowledgement';
import MsgExecuteContract from './MsgExecuteContract';
import MsgFundCommunityPool from './MsgFundCommunityPool';
import MsgInstantiateContract from './MsgInstantiateContract';
import MsgWithdrawDelegatorReward from './MsgWithdrawDelegatorReward';
import MsgAggregateExchangeRateVote from './MsgAggregateExchangeRateVote';
import MsgWithdrawValidatorCommission from './MsgWithdrawValidatorCommission';
import MsgAggregateExchangeRatePrevote from './MsgAggregateExchangeRatePrevote';

const BlockTxMessages = (props) => {

    
    return (
        <div className={"boxContainer " + styles.messagesBlock}>
            <p className="h2like"><MessageIcon /><span>Operation {props.idxElement}/{props.nbElements} : <strong>{props.txMessage['MsgDesc']}</strong></span></p>
            <table className={styles.tblMessages}>
                <tbody>
                    {props.txMessage['MsgType'] === 'MsgSend' ? <MsgSend txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgAggregateExchangeRateVote' ? <MsgAggregateExchangeRateVote txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgAggregateExchangeRatePrevote' ? <MsgAggregateExchangeRatePrevote txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgVote' ? <MsgVote txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgWithdrawDelegatorReward' ? <MsgWithdrawDelegatorReward txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgWithdrawValidatorCommission' ? <MsgWithdrawValidatorCommission txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgExecuteContract' ? <MsgExecuteContract txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgDelegate' ? <MsgDelegate txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgUndelegate' ? <MsgUndelegate txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgBeginRedelegate' ? <MsgBeginRedelegate txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgSubmitProposal' ? <MsgSubmitProposal txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgDeposit' ? <MsgDeposit txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgFundCommunityPool' ? <MsgFundCommunityPool txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgUpdateClient' ? <MsgUpdateClient txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgAcknowledgement' ? <MsgAcknowledgement txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgExecAuthorized' ? <MsgExecAuthorized txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgInstantiateContract' ? <MsgInstantiateContract txMessage={props.txMessage} /> : null}
                    {props.txMessage['MsgType'] === 'MsgUnjail' ? <MsgUnjail txMessage={props.txMessage} /> : null}
                </tbody>
            </table>
        </div>
    );
};

export default BlockTxMessages;