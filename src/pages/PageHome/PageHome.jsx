import React, { useEffect, useState } from 'react';
import { HomeIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import BlockOverview from './BlockOverview';
import BlockLatestBlocks from './BlockLatestBlocks';
import BlockValidators from './BlockValidators';
import BlockTotalSupplies from './BlockTotalSupplies';
import BlockAccounts from './BlockAccounts';


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
            <h1><HomeIcon /><span><strong>Home</strong> (dashboard)</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <div className={styles.tblHome}>
                <div className={"boxContainer " + styles.overviewBlock}>
                    <BlockOverview />
                </div>
                <div className={"boxContainer " + styles.blocksBlock}>
                    <BlockLatestBlocks />
                </div>
                <div className={"boxContainer " + styles.accountsBlock}>
                    <BlockAccounts />
                </div>
                <div className={"boxContainer " + styles.validatorsBlock}>
                    <BlockValidators />
                </div>
                <div className={"boxContainer " + styles.suppliesBlock}>
                    <BlockTotalSupplies />
                </div>
            </div>
        </div>
    );
};

export default PageHome;