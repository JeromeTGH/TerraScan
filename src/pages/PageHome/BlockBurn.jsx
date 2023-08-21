import React, { useEffect, useState } from 'react';
import { getBurnTbl } from './getBurnTbl';
import styles from './BlockBurn.module.scss';
import { BurnIcon } from '../../application/AppIcons';
import { metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import { tblCorrespondanceCompte } from '../../application/AppParams';

const BlockBurn = () => {

    // Constantes
    const minLuncToShow = 10000;    // Nombre de LUNC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const minUstcToShow = 100;      // Nombre d'USTC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const nbLineToShow = 40;       // Nombre de lignes "filtrées" (que MsgSend, d'un certain montant), à afficher

        
    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreurGettingTransactions, setMsgErreurGettingTransactions] = useState();
    const [tblTxsBurn, setTblTxsBurn] = useState([]);


    // Chargement au démarrage
    useEffect(() => {
        setIsLoading(true);

        getBurnTbl(minLuncToShow, minUstcToShow, nbLineToShow).then((res) => {
            if(res['erreur']) {
                // Erreur
                setMsgErreurGettingTransactions(res['erreur']);
                setTblTxsBurn([]);
            }
            else {
                // OK
                setIsLoading(false);
                setMsgErreurGettingTransactions('');
                setTblTxsBurn(res);
            }
        })
    }, [])


    
    // Affichage
    return (
        <div className={styles.generalites}>
            <h2 className={styles.h2burn}><strong><BurnIcon /></strong><span><strong>{nbLineToShow} Latest Burns</strong></span></h2>
            {msgErreurGettingTransactions ?
                <div className="erreur ">{msgErreurGettingTransactions}</div>
            :
                isLoading ?
                    <div>Loading from blockchain (FCD), please wait ...</div>
                :
                <>
                    <div className={styles.comments}>(only amounts &gt;100.000 LUNC or &gt;100 USTC are shown here)</div>
                    <div className={styles.burnDiv}>
                    <table className={styles.tblOfLastBurns}>
                        <thead>
                            <tr>
                                <th>Date/Time</th>
                                <th>TxHash</th>
                                <th>Rounded&nbsp;amount</th>
                                <th>Account</th>
                                <th>Memo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tblTxsBurn.map((valeur, index) => {
                                return <tr key={index}>
                                    <td>{metEnFormeDateTime(valeur[1].datetime)}</td>
                                    <td><Link to={"/transactions/" + valeur[1].txHash}>
                                        {valeur[1].txHash.substring(0,8)}...{valeur[1].txHash.slice(-8)}
                                    </Link></td>
                                    <td>{valeur[1].amount}</td>
                                    <td><Link to={"/accounts/" + valeur[1].account}>
                                        {tblCorrespondanceCompte[valeur[1].account] ? tblCorrespondanceCompte[valeur[1].account] : valeur[1].account}
                                    </Link></td>
                                    <td>{valeur[1].memo ? valeur[1].memo : '-'}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    </div>
                </>
            }
        </div>
    );
};

export default BlockBurn;