import React, { useEffect, useState } from 'react';
import styles from './BlockBurn.module.scss';
import { EyeIcon } from '../../application/AppIcons';
import { formateLeNombre, metEnFormeAmountPartieEntiere, metEnFormeDateTime } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import { tblCorrespondanceCompte } from '../../application/AppParams';
import { loadLatestBurns } from '../../dataloaders/loadLatestBurns';
import StyledBox from '../../sharedComponents/StyledBox';

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
        <StyledBox title={'The last ' + nbLineToShow + ' burns'} color="orange" className={styles.burnBlock}>
            {msgErreurGettingTransactions ?
                <div className="erreur ">{msgErreurGettingTransactions}</div>
            :
                <>
                    <div className={styles.burnDiv}>
                        <table className={styles.tblOfLastBurns}>
                            <thead>
                                <tr>
                                    <th>Date&nbsp;&&nbsp;Time</th>
                                    <th>Amount/Coin</th>
                                    <th>Account</th>
                                    <th>Tx</th>
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
                                            <td>
                                                {valeur[1].amount.map((element, index) => {
                                                    return <div key={index}>
                                                        <span>{metEnFormeAmountPartieEntiere(element.amount, '\u00a0')}</span>
                                                        <img src={'/images/coins/' + element.denom + '.png'} alt={element.denom + ' logo'} />
                                                    </div>
                                                })}
                                            </td>
                                            <td>
                                                <Link to={"/accounts/" + valeur[1].account}>
                                                {tblCorrespondanceCompte[valeur[1].account] ? <strong>{tblCorrespondanceCompte[valeur[1].account]}</strong> : valeur[1].account}
                                                </Link>
                                            </td>
                                            <td><Link to={"/transactions/" + valeur[1].txHash}><EyeIcon /></Link></td>
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
                    <div className={styles.comments}>(only MsgSend, with amounts &gt;{formateLeNombre(minLuncToShow, '.')} LUNC or &gt;{formateLeNombre(minUstcToShow,'.')} USTC, are shown here)</div>
                </>
            }
        </StyledBox>
    );
};

export default BlockBurn;