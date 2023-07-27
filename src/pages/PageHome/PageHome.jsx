import React, { useEffect, useState } from 'react';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import { DashboardIcon, ParamsIcon, LockIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import TableOfLatestBlocks from './TableOfLatestBlocks';
import TableOfTotalSupplies from './TableOfTotalSupplies';


const PageHome = () => {

    // Variables react
    // const [ infosMintingParams, setInfosMintingParams] = useState();    // Ici les paramètres de mint (inflation, essentiellement)
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');

    useEffect(() => {
        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());
    }, [])


    // Et affichage de la page, au final
    return (
        <div className={styles.homepage}>
            <h1><DashboardIcon /><span>Dashboard</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <br />
            <div className={styles.tbl421}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <TableOfLatestBlocks />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <TableOfTotalSupplies />
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
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHome;