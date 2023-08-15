import React, { useEffect, useState } from 'react';
import { HomeIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import BlockSearch from './BlockSearch';
import BlockOverview from './BlockOverview';
import BlockLatestBlocks from './BlockLatestBlocks';
import BlockValidators from './BlockValidators';
import BlockTotalSupplies from './BlockTotalSupplies';
import BlockAccounts from './BlockAccounts';
import { appName } from '../../application/AppParams';


const PageHome = () => {

    // Variables react
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Home - ' + appName;

        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());
    }, [])


    // Et affichage de la page, au final
    return (
        <>
            <h1><HomeIcon /><span><strong>Home</strong> (dashboard)</span></h1>
            <p className="datetimeupdate">→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <div className={styles.blocksHomepage}>
                <div className={"boxContainer " + styles.searchBlock}>
                    <BlockSearch />
                </div>
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
        </>
    );
};

export default PageHome;