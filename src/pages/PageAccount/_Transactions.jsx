import React, { useEffect, useState } from 'react';
import styles from './_Transactions.module.scss';
import { getTransactions } from './getTransactions';
// import { Link } from 'react-router-dom';
// import { tblValidators } from '../../application/AppData';
// import { expanded_datetime_ago, metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
// import { LeftArrowIcon, RightArrowIcon } from '../../application/AppIcons';

const Transactions = (props) => {

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
                            <>
                                <div className={styles.amountAndReleaseInfos}>
                                    <div>(suite)</div>
                                    {/* <div>
                                        <span>There are </span>
                                        <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(tblUndelegation.balance)}</span>
                                        <span className='partieDecimale'>{retournePartieDecimaleFixed6(tblUndelegation.balance)}</span>
                                        <span> LUNC</span>
                                    </div>
                                    <div>undelegating from validator <Link to={'/validators/' + tblUndelegation.valoperAddress}>{tblUndelegation.valMoniker}</Link> {tblValidators[tblUndelegation.valoperAddress].status !== 'active' ? <span className={styles.jailed}>JAILED</span> : null}</div>
                                    <br />
                                    <div>They will be <strong>released in {expanded_datetime_ago(tblUndelegation.releaseDatetime, true)}</strong> ({metEnFormeDateTime(tblUndelegation.releaseDatetime)})</div> */}
                                </div>
                            </>
                        :
                            <div className={styles.message}>No transaction found.</div>
                }
            </div>
        </div>
    );
};

export default Transactions;