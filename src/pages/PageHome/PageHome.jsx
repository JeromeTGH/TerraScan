import React, { useEffect, useState } from 'react';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import { HomeIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import BlockTotalSupplies from './BlockTotalSupplies';
import BlockStaking from './BlockStaking';
import BlockLatestBlocks from './BlockLatestBlocks';
import BlockOverview from './BlockOverview';

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
            <h1><HomeIcon /><span><strong>Homepage</strong> (dashboard)</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <br />
            <div className={styles.tbl13}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <BlockOverview />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <BlockLatestBlocks />
                    </div>
                </OutlinedBox>
            </div>
            <div className={styles.tbl31}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <BlockStaking />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <BlockTotalSupplies />
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHome;