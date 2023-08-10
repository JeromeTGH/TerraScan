import React from 'react';
import styles from './BlockTxMessages.module.scss';
import { MessageIcon } from '../../application/AppIcons';
import MsgSend from './MsgSend';

const BlockTxMessages = (props) => {

    
    return (
        <div className={"boxContainer " + styles.messagesBlock}>
            <h2><MessageIcon /><span>Operation {props.idxElement}/{props.nbElements}</span></h2>
            <table className={styles.tblMessages}>
                <tbody>
                    <tr>
                        <td>Type :</td>
                        <td>{props.txMessage['MsgDesc']}</td>
                    </tr>
                    {props.txMessage['MsgType'] === 'MsgSend' ? <MsgSend txMessage={props.txMessage} /> : null}










                </tbody>
            </table>
        </div>
    );
};

export default BlockTxMessages;