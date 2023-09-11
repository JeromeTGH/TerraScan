import React, { useEffect, useState } from 'react';
import { LockIcon } from '../../application/AppIcons';
import styles from './PageStaking.module.scss';
import Chart from 'react-apexcharts';

import { appName, chainID, chainLCDurl } from '../../application/AppParams';
import { Coins, LCDClient } from '@terra-money/terra.js';
import { formateLeNombre } from '../../application/AppUtils';
import Decimal from 'decimal.js';
import StyledBox from '../../sharedComponents/StyledBox';

const PageStaking = () => {

    // Variables React
    const [luncTotalSupply, setLuncTotalSupply] = useState();
    const [nbStakedLunc, setNbStakedLunc] = useState();
    const [msgErreur, setMsgErreur] = useState();


    // Récupération des infos supply/staking, au démarrage
    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Staking - ' + appName;

        // Connexion au LCD
        const lcd = new LCDClient({
            URL: chainLCDurl,
            chainID: chainID,
            isClassic: true
        });


        // Récupération de la "total supply" du LUNC
        lcd.bank.total({'pagination.limit': 9999}).then(rawTotalSupplies => {
            if(rawTotalSupplies[0]) {
                const lstTotalSupplies = (new Coins(rawTotalSupplies[0])).toData();
                const idxLunc = lstTotalSupplies.findIndex(element => element.denom === "uluna");
   
                if(idxLunc > -1) {
                    setLuncTotalSupply(parseInt(lstTotalSupplies[idxLunc].amount/1000000));
                    setMsgErreur(null);

                        // Récupération du nombre de LUNC stakés (bonded)
                        lcd.staking.pool().then(rawStakingPool => {
                            if(rawStakingPool) {
                                const bondedTokens = (new Decimal(rawStakingPool.bonded_tokens.amount)).toFixed(0);
                                setNbStakedLunc(parseInt(bondedTokens/1000000));
                                setMsgErreur(null);
                            } else {
                                setLuncTotalSupply(null);
                                setNbStakedLunc(null);
                                setMsgErreur('ERROR : Failed to fetch [staking pool] ...');
                            }
                        }).catch(err => {
                            setLuncTotalSupply(null);
                            setNbStakedLunc(null);
                            setMsgErreur('ERROR : Failed to fetch [staking pool] ...');
                            console.log(err);
                        })

                } else {
                    setLuncTotalSupply(null);
                    setNbStakedLunc(null);
                    setMsgErreur('ERROR : Failed to fetch [total supplies] ...');
                }
            } else {
                setLuncTotalSupply(null);
                setNbStakedLunc(null);
                setMsgErreur('ERROR : Failed to fetch [total supplies] ...');
            }
        }).catch(err => {
            setLuncTotalSupply(null);
            setNbStakedLunc(null);
            setMsgErreur('ERROR : Failed to fetch [total supplies] ...');
            console.log(err);
        })


    }, [])


    // Affichage
    return (
        <>
            <h1><span><LockIcon /><strong>Staking</strong></span></h1>
            <div className={styles.pgStaking}>
                <StyledBox title="Data" color="green" className={styles.tblStaking}>
                    {luncTotalSupply && nbStakedLunc ?
                        <table>
                            <tbody>
                                <tr>
                                    <td>LUNC total supply : </td>
                                    <td><strong>{formateLeNombre(luncTotalSupply, ' ')}</strong> LUNC</td>
                                </tr>
                                <tr>
                                    <td>Staked LUNC : </td>
                                    <td><strong>{formateLeNombre(nbStakedLunc, ' ')}</strong> LUNC</td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><hr /></td>
                                </tr>

                                <tr>
                                    <td>Staking rate : </td>
                                    <td><strong>{((nbStakedLunc/luncTotalSupply)*100).toFixed(2)} %</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    : null }
                </StyledBox>
                <StyledBox title="Chart" color="blue" className={styles.stakingChart}>
                    {luncTotalSupply && nbStakedLunc ?
                            <div>
                                <Chart
                                    type="radialBar"
                                    width={"100%"}
                                    // height={300}
                                    series={[((nbStakedLunc/luncTotalSupply)*100).toFixed(2)]}
                                    options={{
                                        labels: ['Staked LUNC'],
                                        colors:['var(--primary-fill)', 'pink'],         // Couleurs de la série et textes labels associés (data-labels)
                                        chart: {
                                            foreColor: 'var(--primary-text-color)'      // Couleur des valeurs (data-values)
                                        },
                                        plotOptions: {
                                            radialBar: {
                                                track: {
                                                background: 'var(--unprimary-fill)'   // Couleur de fond de l'anneau, lorsque "non coloré"
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        :
                            msgErreur ? <p className="erreur">{msgErreur}</p> : <p>Loading data from blockchain (lcd) ...</p>
                    }
                </StyledBox>
            </div>
        </>
    );
};

export default PageStaking;