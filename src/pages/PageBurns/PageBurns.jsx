import React, { useEffect, useState } from 'react';
import { BurnIcon, EyeIcon } from '../../application/AppIcons';
import { metEnFormeDateTime, truncateString } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import { appName, tblCorrespondanceCompte } from '../../application/AppParams';
import styles from './PageBurns.module.scss';
import { loadLatestBurns } from '../../dataloaders/loadLatestBurns';
import StyledBox from '../../sharedComponents/StyledBox';

const PageBurns = () => {

    // Constantes
    const minLuncToShow = 100;    // Nombre de LUNC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const minUstcToShow = 1;      // Nombre d'USTC minimum pour une transaction donnée, pour que celle-ci soit "retenue" dans le tableau d'affichage final
    const nbLineToShow = 500;     // Nombre de lignes "filtrées" (que MsgSend, d'un certain montant), à afficher

        
    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreurGettingTransactions, setMsgErreurGettingTransactions] = useState();
    const [tblTxsBurn, setTblTxsBurn] = useState([]);


    // Chargement au démarrage
    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Burns - ' + appName;

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
        <>
            <h1><span><BurnIcon /><strong>Burns</strong></span></h1>
            <StyledBox title="Burn filtering rules, for here" color="green">
                <p className={styles.note}>
                - type of transaction : <strong>MsgSend</strong><br />
                - number of displayed transactions here : <strong>{nbLineToShow}&nbsp;lines</strong><br />
                - amount of LUNC required to be displayed here : <strong>{minLuncToShow}&nbsp;LUNC</strong> min<br />
                - amount of USTC required to be displayed here : <strong>{minUstcToShow}&nbsp;USTC</strong> min
                </p>
            </StyledBox>

            <StyledBox title={nbLineToShow + ' last burns'} color="orange">
                {msgErreurGettingTransactions ?
                    <div className="erreur ">{msgErreurGettingTransactions}</div>
                :
                    <div className={styles.burnDiv}>
                        <table className={styles.tblOfLastBurns}>
                            <thead>
                                <tr>
                                    <th>Date/Time</th>
                                    <th>Amount</th>
                                    <th>Account</th>
                                    <th>Tx</th>
                                    <th>Memo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ?
                                    <tr><td colSpan="6"><br />Loading from blockchain (FCD), please wait ...<br /></td></tr>
                                :
                                    tblTxsBurn.map((valeur, index) => {
                                        return <tr key={index}>
                                            <td>{metEnFormeDateTime(valeur[1].datetime)}</td>
                                            <td>{valeur[1].amount}</td>
                                            <td>
                                                <Link to={"/accounts/" + valeur[1].account}>
                                                {tblCorrespondanceCompte[valeur[1].account] ? tblCorrespondanceCompte[valeur[1].account] : valeur[1].account.substring(0, 10) + "..." + valeur[1].account.slice(-10)}
                                                </Link>
                                            </td>
                                            <td><Link to={"/transactions/" + valeur[1].txHash}><EyeIcon /></Link></td>
                                            <td>{valeur[1].memo ? truncateString(valeur[1].memo, 25) : '-'}</td>
                                        </tr>
                                    })}
                            </tbody>
                        </table>
                    </div>
                }
            </StyledBox>
        </>
    );
};

export default PageBurns;