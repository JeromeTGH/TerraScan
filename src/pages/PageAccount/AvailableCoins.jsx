import React, { useEffect, useState } from 'react';
import styles from './AvailableCoins.module.scss';
import { LCDclient } from '../../lcd/LCDclient';
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import { CoinsIcon } from '../../application/AppIcons';


const AvailableCoins = (props) => {

    // Variables
    const [isLoading, setIsLoading] = useState(true);
    const [tblCoins, setTblCoins] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // Exécution au chargement de ce component, et à chaque changement de "accountAddress"
    useEffect(() => {

        setIsLoading(true);

        // Récupération de la balance de ce compte
        const client_lcd = LCDclient.getSingleton();
        client_lcd.bank.getAccountDetails(props.accountAddress).then((res) => {
            if(res.data?.balances) {
                // Préparation du tableau réponse en retour
                const tblRetour = [];
                // Enregistrement des coins, dans l'ordre de la liste (LUNC, USTC, puis les autres)
                for(const [denom, coinName] of Object.entries(tblCorrespondanceValeurs)) {
                    const idxCoin = res.data.balances.findIndex(element => element.denom === denom);
                    if(idxCoin > -1)
                        tblRetour.push([(res.data.balances[idxCoin].amount / 1000000).toFixed(6), coinName])
                    else
                        tblRetour.push(["0.000000", coinName])
                }
                setTblCoins(tblRetour);
                setIsLoading(false);
                setMsgErreur("");                
            } else {
                setTblCoins(null);
                setIsLoading(false);
                setMsgErreur("Failes to fetch [data.balances] from LCD response, sorry");
            }
        }).catch((err) => {
            if(err.response && err.response.data)
                console.warn("err.response.data", err.response.data);
            else
                console.warn("err", err);
            setTblCoins(null);
            setIsLoading(false);
            setMsgErreur("Failes to fetch [account balance] from LCD, sorry");
        })


    }, [props.accountAddress])

    // Affichage
    return (
        <>
            <h2 className={styles.h2title}><strong><CoinsIcon />Available coins</strong>&nbsp;(not staked)</h2>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
                :
                isLoading ?
                    <div>Loading data from blockchain (lcd), please wait ...</div>
                :
                    <div className={styles.container}>
                        {tblCoins.map((element, index) => {
                            return <div key={index} className={styles.coin}>
                                <div className={styles.coinImageAndLabel}>
                                    <img src={'/images/coins/' + element[1] + '.png'} alt='' />
                                    <span>{(element[1] === 'LUNC' || element[1] === 'USTC') ? <strong>{element[1]}</strong> : element[1]}</span>
                                </div>
                                <div className={styles.coinValue}>{(element[1] === 'LUNC' || element[1] === 'USTC') ? <strong>{element[0]}</strong> : element[0]}</div>
                            </div>
                        })}
                    </div>
            }
        </>
    );
};

export default AvailableCoins;