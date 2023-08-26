import React, { useEffect, useState } from 'react';
import { HomeIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import BlockSearch from './BlockSearch';
import BlockOverview from './BlockOverview';
import BlockLatestBlocksV2 from './BlockLatestBlocksV2';
import BlockValidatorsV2 from './BlockValidatorsV2';
import BlockTotalSupplies from './BlockTotalSupplies';
import BlockAccounts from './BlockAccounts';
import { appName } from '../../application/AppParams';
import BlockBurn from './BlockBurn';
import { getCommonHomeDatas } from './getCommonHomeDatas';


const PageHome = () => {

    // Variables react
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');
    const [totalSupplies, setTotalSupplies] = useState();

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Home - ' + appName;

        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());

        // Chargement des données commmunes aux sous-components de ce component
        getCommonHomeDatas().then((res) => {
            // console.log("res['totalSupplies']", res['totalSupplies']);
            setTotalSupplies(res['totalSupplies']);
        })
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
                <div className={"boxContainer " + styles.burnBlock}>
                    <BlockBurn />
                </div>
                <div className={"boxContainer " + styles.overviewBlock}>
                    <BlockOverview />
                </div>
                <div className={"boxContainer " + styles.blocksBlock}>
                    <BlockLatestBlocksV2 />
                </div>
                <div className={"boxContainer " + styles.accountsBlock}>
                    <BlockAccounts />
                </div>
                <div className={"boxContainer " + styles.validatorsBlock}>
                    <BlockValidatorsV2 />
                </div>
                <BlockTotalSupplies totalSupplies={totalSupplies} />
            </div>
        </>
    );
};

export default PageHome;