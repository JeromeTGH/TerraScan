import React, { useEffect, useState } from 'react';
import { formateLeNombre } from '../../application/AppUtils';
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import styles from './PageHomeContent.module.scss';
import { DashboardIcon, ParamsIcon, Stack1Icon, ChainIcon, LockIcon } from '../../application/AppIcons';
import { Dec } from '@terra-money/terra.js';
import { Link } from 'react-router-dom';

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
        <div className={styles.homepage}>
            <h1><DashboardIcon /><span>Dashboard</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <br />
            <div className={styles.tbl421}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><ChainIcon /></strong><span><strong>Latest Blocks</strong></span></h2>
                        <table className={styles.tblListOfBlocks}>
                            <thead>
                                <tr>
                                    <th>Height</th>
                                    <th>Nb&nbsp;Tx</th>
                                    <th>Validator</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.derniersBlocks ? props.derniersBlocks.map((valeur, clef) => {
                                    return (
                                        <tr key={clef}>
                                            <td><Link to={'/blocks/' + valeur[0]}>{valeur[0]}</Link></td>
                                            <td>{valeur[1]}</td>
                                            <td><Link to={'/validators/' + valeur[3]}>{valeur[4]}</Link></td>
                                        </tr> 
                                )}) : <tr><td colSpan="3">Loading ...</td></tr> }
                            </tbody>
                        </table>
                        <div className="erreur">{props.msgErreurGetDerniersBlocks}</div>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><Stack1Icon /></strong><span><strong>Total Supplies</strong> (latest)</span></h2>
                        <table className={styles.tblTotalSupplies}>
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
                        <h2><strong><LockIcon /></strong><span><strong>Staking</strong></span></h2>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><ParamsIcon /></strong><span><strong>Blockchain Parameters</strong></span></h2>
                        <p>Inflation (max mint) = {maxMintInflation} %</p>
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHomeContent;