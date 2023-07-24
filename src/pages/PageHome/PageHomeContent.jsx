import React, { useEffect, useState } from 'react';
import { formateLeNombre } from '../../application/AppUtils';
import { tblCorrespondanceValeurs } from '../../application/AppParams';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import styles from './PageHomeContent.module.scss';

const PageHomeContent = (props) => {

    // Variables React
    const [coinsTotalSupply, setCoinsTotalSupply] = useState({});
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');

    useEffect(() => {

        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());

        // Extraction de la total Supply de chaque coin (USTC, LUNC, ...)
        const tblTotalSupplyParCoin = []
        props.infosSupply.forEach((element) => {
            if(tblCorrespondanceValeurs[element.denom])
                tblTotalSupplyParCoin[tblCorrespondanceValeurs[element.denom]] = formateLeNombre(parseInt(element.amount/1000000), " ");
        })
        setCoinsTotalSupply(tblTotalSupplyParCoin);
        
    }, [props.infosSupply])

    return (
        <div>
            <h1>Dashboard</h1>
            <p className={styles.datetimeupdate}>Last data update : {datetimeDernierUpdate}</p>
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
                                    return <>
                                        {(clef==='LUNC' || clef==='USTC') ? null :
                                            <tr className={styles.coinMineur}>
                                                <td>{valeur}</td>
                                                <td>{clef}</td>
                                            </tr>
                                        }
                                    </>
                                }) : null}
                            </tbody>
                        </table>

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