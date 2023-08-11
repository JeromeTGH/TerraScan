import React from 'react';
import styles from './BlockTxMessages.module.scss';
import { MessageIcon } from '../../application/AppIcons';
import MsgSend from './MsgSend';
import MsgVote from './MsgVote';
import MsgDelegate from './MsgDelegate';
import MsgUndelegate from './MsgUndelegate';
import MsgBeginRedelegate from './MsgBeginRedelegate';
import MsgExecuteContract from './MsgExecuteContract';
import MsgAggregateExchangeRateVote from './MsgAggregateExchangeRateVote';
import MsgAggregateExchangeRatePrevote from './MsgAggregateExchangeRatePrevote';
import MsgWithdrawDelegatorReward from './MsgWithdrawDelegatorReward';
import MsgWithdrawValidatorCommission from './MsgWithdrawValidatorCommission';
import MsgSubmitProposal from './MsgSubmitProposal';

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


                    


                </tbody>
            </table>
        </div>
    );
};

export default BlockTxMessages;