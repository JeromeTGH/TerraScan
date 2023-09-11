import React, { useEffect, useState } from 'react';
import styles from './_Transactions.module.scss';
import { getTransactions } from './getTransactions';
import { metEnFormeAmountPartieEntiere, metEnFormeDateTime, retournePartieDecimaleFixed6 } from '../../application/AppUtils';
import { tblCorrespondanceMessages } from '../../application/AppParams';
import { Link } from 'react-router-dom';
import { EyeIcon } from '../../application/AppIcons';
import StyledBox from '../../sharedComponents/StyledBox';


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
        <StyledBox title="Available" color="blue">
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>
                        <div>Loading "transactions" from blockchain (fcd), please wait ...</div>
                        <br />
                        <div><strong><u>Note</u> : this may sometimes take longer than normal here, please wait ...</strong></div>
                    </div>
                :
                    (tblTransactions && tblTransactions.length > 0) ?
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
                                        <td>
                                            {tblCorrespondanceMessages[element.msgType] ? tblCorrespondanceMessages[element.msgType] : element.msgType}
                                            {element.errorCode !== 0 ? <> <span className='failed'>FAILED</span></> : null}
                                        </td>
                                        <td className={styles.amounts}>
                                            {element.amount ? 
                                                <>
                                                    <span className='partieEntiere'>{metEnFormeAmountPartieEntiere(element.amount)}</span>
                                                    <span className='partieDecimale'>{retournePartieDecimaleFixed6(element.amount)}</span>
                                                    <img src={'/images/coins/' + element.unit + '.png'} alt={element.unit + ' logo'} />
                                                </>
                                            :
                                                <>&nbsp;</>
                                            }
                                        </td>
                                        <td className={styles.view}><Link to={'/transactions/' + element.txHash}><EyeIcon /></Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    :
                        <div>No transaction found.</div>
            }
        </StyledBox>
    );
};

export default Transactions;