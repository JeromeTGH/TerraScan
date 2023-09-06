import React, { useEffect, useState } from 'react';
import styles from './_Transactions.module.scss';
import { getTransactions } from './getTransactions';
import { metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { tblCorrespondanceMessages } from '../../application/AppParams';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { tblValidators } from '../../application/AppData';
// import { expanded_datetime_ago, metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
// import { LeftArrowIcon, RightArrowIcon } from '../../application/AppIcons';

const Transactions = (props) => {

    const navigate = useNavigate();

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblTransactions, setTblTransactions] = useState();
    const [msgErreur, setMsgErreur] = useState();
    

    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {

        setIsLoading(true);
        setTblTransactions([]);

        // Récupération des 100 dernières transactions de ce compte
        getTransactions(props.accountAddress).then((res) => {
            if(res['erreur']) {
                setTblTransactions(null);
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblTransactions(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }, [props.accountAddress])


    // Fonction exécutée à chaque click sur un bouton view donné
    const handleClickViewTx = (txHash) => {
        navigate('/transactions/' + txHash);
    }

    // Affichage
    return (
        <div className={styles.container}>
            <div className={styles.transactions}>
                <div className={styles.blockTitle}>
                    <div className={styles.textTitle}>Latest transactions</div>
                </div>
                {msgErreur ?
                    <div className={"erreur " + styles.message}>{msgErreur}</div>
                :
                    isLoading ?
                        <div className={styles.message}>Loading "transactions" from blockchain (lcd), please wait ...</div>
                    :
                        tblTransactions ?
                            <table className={styles.tblTransactions}>
                                <thead>
                                    <tr>
                                        <th>Date/Time</th>
                                        <th>Operation</th>
                                        <th>Amount</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tblTransactions.map((element, index) => {
                                        return <tr key={index}>
                                            <td>{metEnFormeDateTime(element.datetime)}</td>
                                            <td>{tblCorrespondanceMessages[element.msgType] ? tblCorrespondanceMessages[element.msgType] : element.msgType}</td>
                                            <td>
                                                <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.amount)}</span>
                                                <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.amount)}</span>
                                                <span> {element.unit}</span>
                                            </td>
                                            <td><button onClick={() => handleClickViewTx(element.txHash)}>View</button></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        :
                            <div className={styles.message}>No transaction found.</div>
                }
            </div>
        </div>
    );
};

export default Transactions;