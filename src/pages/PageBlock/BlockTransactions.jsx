import React, { useEffect, useState } from 'react';
import styles from './BlockTransactions.module.scss';
import { getTransactions } from './getTransactions';
import { Link } from 'react-router-dom';

const BlockTransactions = (props) => {

    // Variables React
    const [tableBlockTransactions, setTableBlockTransactions] = useState();
    const [msgErreurTableBlockTransactions, setMsgErreurTableBlockTransactions] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getTransactions(props.blockNumber).then((res) => {
            if(res['erreur']) {
                setMsgErreurTableBlockTransactions(res['erreur']);
                setTableBlockTransactions({});
            }
            else {
                setMsgErreurTableBlockTransactions('');
                setTableBlockTransactions(res);
            }
        })
    }, [props])
    
    return (
        <div className={"boxContainer " + styles.transactionsBlock}>
            {tableBlockTransactions ? 
                tableBlockTransactions.length > 0 ? 
                    <table className={styles.tblTransactions}>
                    <thead>
                        <tr>
                            <th>Tx Hash</th>
                            <th>Code</th>
                            <th>Tx Type</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                            <tbody>
                        {tableBlockTransactions.map((valeur, clef) => {
                            return <tr key={clef}>
                                <td><Link to={"/transactions/" + valeur[0]}>{valeur[0]}</Link></td>
                                <td>{valeur[1] === 0 ? <span className='succes'>OK</span> : <span className='erreur'>FAILURE</span>}</td>
                                <td>{valeur[3]}</td>
                                <td>
                                    {valeur[3] === 'MsgSend' ? <Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link> : null}
                                    {valeur[3] === 'MsgDelegate' ? <Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link> : null}
                                    {valeur[3] === 'MsgUndelegate' ? <Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link> : null}
                                    {valeur[3] === 'MsgBeginRedelegate' ? <Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link> : null}
                                    {valeur[3] === 'MsgVote' ? <Link to={"/accounts/" + valeur[4]}>{valeur[4]}</Link> : null}
                                    {valeur[3] === 'MsgWithdrawDelegatorReward' ? <Link to={"/validators/" + valeur[4]}>{valeur[6]}</Link> : null}
                                    {valeur[3] !== 'MsgSend'
                                        && valeur[3] !== 'MsgDelegate'
                                        && valeur[3] !== 'MsgUndelegate'
                                        && valeur[3] !== 'MsgBeginRedelegate'
                                        && valeur[3] !== 'MsgVote'
                                        && valeur[3] !== 'MsgWithdrawDelegatorReward'
                                        ? "--" : null
                                    }
                                </td>
                                <td>
                                    {valeur[3] === 'MsgSend' ? <Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link> : null}
                                    {valeur[3] === 'MsgDelegate' ? <Link to={"/validators/" + valeur[5]}>{valeur[6]}</Link> : null}
                                    {valeur[3] === 'MsgUndelegate' ? <Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link> : null}
                                    {valeur[3] === 'MsgBeginRedelegate' ? <Link to={"/validators/" + valeur[5]}>{valeur[6]}</Link> : null}
                                    {valeur[3] === 'MsgVote' ? <Link to={"/proposals/" + valeur[5]}>Proposal #{valeur[5]}</Link> : null}
                                    {valeur[3] === 'MsgWithdrawDelegatorReward' ? <Link to={"/accounts/" + valeur[5]}>{valeur[5]}</Link> : null}
                                    {valeur[3] !== 'MsgSend'
                                        && valeur[3] !== 'MsgDelegate'
                                        && valeur[3] !== 'MsgUndelegate'
                                        && valeur[3] !== 'MsgBeginRedelegate'
                                        && valeur[3] !== 'MsgVote'
                                        && valeur[3] !== 'MsgWithdrawDelegatorReward'
                                        ? "--" : null
                                    }                                  
                                </td>
                            </tr>
                        })}
                    </tbody>
                    </table>
                : <p>No transaction.</p>
                : <p>Loading data from blockchain ...</p>
            }
            <div className="erreur">{msgErreurTableBlockTransactions}</div>
        </div>
    );
};

export default BlockTransactions;