import React, { useEffect, useState } from 'react';
import styles from './BlockBurn.module.scss';
import { BurnIcon } from '../../application/AppIcons';
import { formateLeNombre, metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import { tblCorrespondanceCompte } from '../../application/AppParams';
import { loadLatestBurns } from '../../dataloaders/loadLatestBurns';

const BlockBurn = () => {

    // Constantes
    const minLuncToShow = 10000;    // Nombre de LUNC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const minUstcToShow = 100;      // Nombre d'USTC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const nbLineToShow = 40;                // Nombre de lignes "filtrées" (que MsgSend, d'un certain montant), à afficher
    const nbElementsParPagination = 10;     // Nombre d'éléments à afficher par pagination

        
    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreurGettingTransactions, setMsgErreurGettingTransactions] = useState();
    const [tblTxsBurn, setTblTxsBurn] = useState([]);
    const [burnTblPagination, setBurnTblPagination] = useState(0);

    // Fonction de sélection de page, pour la liste des burns
    const handleClickBurnPagination = (val) => {
        setBurnTblPagination(val);
    }
    

    // Exécution au démarrage
    useEffect(() => {
        setIsLoading(true);

        loadLatestBurns(minLuncToShow, minUstcToShow, nbLineToShow).then((res) => {
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
        <div className={"boxContainer " + styles.burnBlock}>
            <h2 className={styles.h2burn}><strong><BurnIcon /></strong><span><strong>{nbLineToShow} Latest Burns</strong></span></h2>
            {msgErreurGettingTransactions ?
                <div className="erreur ">{msgErreurGettingTransactions}</div>
            :
                <>
                    <div className={styles.comments}>(only MsgSend, with amounts &gt;{formateLeNombre(minLuncToShow, '.')} LUNC or &gt;{formateLeNombre(minUstcToShow,'.')} USTC, are shown here)</div>
                    <div className={styles.burnDiv}>
                        <table className={styles.tblOfLastBurns}>
                            <thead>
                                <tr>
                                    <th>Date/Time</th>
                                    <th>TxHash</th>
                                    <th>Rounded&nbsp;amount</th>
                                    <th>Account</th>
                                    <th>Owner</th>
                                    <th>Memo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ?
                                    <tr><td colSpan="6">Loading from blockchain (FCD), please wait ...</td></tr>
                                :
                                    tblTxsBurn.slice(burnTblPagination*nbElementsParPagination, burnTblPagination*nbElementsParPagination + nbElementsParPagination).map((valeur, index) => {
                                        return <tr key={index}>
                                            <td>{metEnFormeDateTime(valeur[1].datetime)}</td>
                                            <td><Link to={"/transactions/" + valeur[1].txHash}>
                                                {valeur[1].txHash.substring(0,8)}...{valeur[1].txHash.slice(-8)}
                                            </Link></td>
                                            <td>{valeur[1].amount}</td>
                                            <td><Link to={"/accounts/" + valeur[1].account}>{valeur[1].account}</Link></td>
                                            <td>{tblCorrespondanceCompte[valeur[1].account] ? tblCorrespondanceCompte[valeur[1].account] : '-'}</td>
                                            <td>{valeur[1].memo ? valeur[1].memo : '-'}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='pagination'>
                        <span>Page :</span>
                        {Array(parseInt(Object.entries(tblTxsBurn).length/nbElementsParPagination) + ((Object.entries(tblTxsBurn).length/nbElementsParPagination)%1 > 0 ? 1 : 0)).fill(1).map((el, i) =>
                            <span key={i} className={i === burnTblPagination ? 'paginationPageSelected' : 'paginationPageUnselected'} onClick={() => handleClickBurnPagination(i)}>{i+1}</span>
                        )}
                    </div>
                </>
            }
        </div>
    );
};

export default BlockBurn;