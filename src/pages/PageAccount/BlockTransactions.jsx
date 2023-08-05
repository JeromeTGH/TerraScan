import React, { useEffect, useState } from 'react';
import styles from './BlockTransactions.module.scss';
import { ExchangeIcon } from '../../application/AppIcons';
import { getTransactionsAccount } from '../../sharedFunctions/getTransactionsAccount';
import { formateLeNombre } from '../../application/AppUtils';
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
    }, [props])

    // Affichage
    return (
        <div className={"boxContainer " + styles.transactionsBlock}>
            <h2><ExchangeIcon /><span>Transactions</span></h2>
            <table className={styles.tblTransactions}>
                <thead>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                    </tr>
                </thead>
                {tableOfTransactions ? 
                        tableOfTransactions.length > 0 ? (
                            <tbody>
                                {tableOfTransactions.map((valeur, clef) => {
                                    return <tr key={clef}>
                                        <td><Link to={"/validators/" + valeur[0]}>{valeur[1]}</Link></td>
                                        <td className={valeur[2] === "Jailed" ? "erreur" : "succes"}>{valeur[2]}</td>
                                        <td>
                                            <strong>{formateLeNombre(parseInt(valeur[3]), "\u00a0")}</strong>
                                            <span className={styles.smallPart}>{"," + (valeur[3]%1).toFixed(6).replace('0.', '')}</span>
                                        </td>
                                        <td><span className={styles.percentage}>{valeur[4] + "\u00a0%"}</span></td>
                                    </tr>
                                })}
                            </tbody>
                        ) : (
                            <tbody><tr><td colSpan="4">No transaction.</td></tr></tbody>
                        )
                    : (
                        <tbody><tr><td colSpan="4">Loading data from blockchain ...</td></tr></tbody>
                    )}
            </table>
            <br />
            <div className="erreur">{msgErreurGettingTransactions}</div>
        </div>
    );
};

export default BlockTransactions;