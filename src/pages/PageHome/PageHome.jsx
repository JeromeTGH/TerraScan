import React, { useEffect, useState } from 'react';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import { DashboardIcon, ParamsIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import SectionTotalSupplies from './SectionTotalSupplies';
import SectionStaking from './SectionStaking';
import SectionLatestBlocks from './SectionLatestBlocks';

const PageHome = () => {

    // Variables react
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
            <div className={styles.tbl13}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><ParamsIcon /></strong><span><strong>Overview</strong></span></h2>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <SectionLatestBlocks />
                    </div>
                </OutlinedBox>
            </div>
            <div className={styles.tbl31}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <SectionStaking />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <SectionTotalSupplies />
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHome;