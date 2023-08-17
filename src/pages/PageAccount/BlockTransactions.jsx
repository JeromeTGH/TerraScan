import React, { useEffect, useState } from 'react';
import styles from './BlockTransactions.module.scss';
import { ExchangeIcon } from '../../application/AppIcons';
import { getTransactionsAccount } from './getTransactionsAccount';
import { Link } from 'react-router-dom';

const BlockTransactions = (props) => {
    
    // Variables React
    const [tableOfTransactions, setTableOfTransactions] = useState();
    const [msgErreurGettingTransactions, setMsgErreurGettingTransactions] = useState();

    // Chargement au démarrage
    useEffect(() => {
        getTransactionsAccount(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setMsgErreurGettingTransactions(res['erreur']);
                setTableOfTransactions([]);
            }
            else {
                setMsgErreurGettingTransactions('');
                setTableOfTransactions(res);
            }
        })
    }, [props.accountAddress])

    // Affichage
    return (
        <div className={"boxContainer " + styles.transactionsBlock}>
            <h2><ExchangeIcon /><span>Latest Transactions</span></h2>
            <table className={styles.tblTransactions}>
                <thead>
                    <tr>
                        <th>DateTime</th>
                        <th>TxHash</th>
                        <th>Operation</th>
                        <th>Height</th>
                    </tr>
                </thead>
                {tableOfTransactions ? 
                        tableOfTransactions.length > 0 ? (
                            <tbody>
                                {tableOfTransactions.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td>{valeur[0]}</td>
                                        <td><Link to={"/transactions/" + valeur[1]}>{valeur[1].substring(0,8) + "..." + valeur[1].slice(-8)}</Link></td>
                                        <td><span>{valeur[3]}</span><br />{valeur[4] === 0 ? <span className='succes'>(SUCCESS)</span> : <span className='erreur'>(FAILED)</span>}</td>
                                        <td><Link to={"/blocks/" + valeur[2]}>{valeur[2]}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        ) : (
                            <tbody><tr><td colSpan="7">No transaction.</td></tr></tbody>
                        )
                    : (
                        <tbody><tr><td colSpan="7">Loading data from blockchain (fcd), please wait ...</td></tr></tbody>
                    )}
            </table>
            <div className={styles.comments}><u>Note</u> : only the last 100 transactions are displayed here (max)</div>
            <br />
            <div className="erreur">{msgErreurGettingTransactions}</div>
        </div>
    );
};

export default BlockTransactions;