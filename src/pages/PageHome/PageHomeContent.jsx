import React, { useEffect, useState } from 'react';
import { formateLeNombre } from '../../application/AppUtils';
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import styles from './PageHomeContent.module.scss';
import { DashboardIcon } from '../../application/AppIcons';
import { Dec } from '@terra-money/terra.js';

const PageHomeContent = (props) => {

    // Variables React
    const [coinsTotalSupply, setCoinsTotalSupply] = useState({});
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');
    const [maxMintInflation, setMaxMintInflation] = useState('...');

    useEffect(() => {

        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());

        // Extraction de la total Supply de chaque coin (USTC, LUNC, ...)
        const tblTotalSupplyParCoin = []
        props.infosTotalSupply.forEach((element) => {
            if(tblCorrespondanceValeurs[element.denom])
                tblTotalSupplyParCoin[tblCorrespondanceValeurs[element.denom]] = formateLeNombre(parseInt(element.amount/1000000), " ");
        })
        setCoinsTotalSupply(tblTotalSupplyParCoin);

        // Récupération du pourcentage d'inflation
        const max_inflation_rate = new Dec(props.infosMintingParams['inflation_max']);
        setMaxMintInflation(parseFloat(max_inflation_rate.toString()).toFixed(2));

    }, [props.infosTotalSupply, props.infosMintingParams])

    return (
        <div>
            <h1><DashboardIcon /><span>Dashboard</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <br />
            <div className={styles.tbl421}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong>Total Supplies</strong> (latest)</h2>
                        <table>
                            <tbody>
                                <tr className={styles.coinMajeur}>
                                    <td>{coinsTotalSupply['LUNC'] ? coinsTotalSupply['LUNC'] : "..."}</td>
                                    <td>LUNC</td>
                                </tr>
                                <tr className={styles.coinMajeur}>
                                    <td>{coinsTotalSupply['USTC'] ? coinsTotalSupply['USTC'] : "..."}</td>
                                    <td>USTC</td>
                                </tr>
                                {coinsTotalSupply ? Object.entries(coinsTotalSupply).map(([clef, valeur]) => {
                                    return (clef==='LUNC' || clef==='USTC') ? null : (
                                            <tr className={styles.coinMineur} key={clef}>
                                                <td>{valeur}</td>
                                                <td>{clef}</td>
                                            </tr> 
                                    )}) : null }
                            </tbody>
                        </table>

                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong>Parameters</strong></h2>
                        <p>Inflation (max) = {maxMintInflation} %</p>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2>Transactions</h2>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2>Transactions</h2>
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHomeContent;