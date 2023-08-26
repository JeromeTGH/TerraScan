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
import { loadGlobalAppDatas } from '../../dataloaders/loadGlobalAppDatas';
import { loadCommonAppDatas } from './PageHome.loader';

const PageHome = () => {

    // Variables react
    const [globalDataLoaded, setGlobalDataLoaded] = useState(false);
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');
    const [totalSupplies, setTotalSupplies] = useState();

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Home - ' + appName;

        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());

        // Chargement des données globales, si ce n'est pas déjà fait
        loadGlobalAppDatas().then(() => {
            setGlobalDataLoaded(true);
        })

        // Chargement des données communes
        loadCommonAppDatas().then((res) => {
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
                <BlockSearch />
                <BlockBurn globalDataLoaded={globalDataLoaded} />
                <BlockOverview globalDataLoaded={globalDataLoaded} totalSupplies={totalSupplies} />
                <BlockLatestBlocksV2 globalDataLoaded={globalDataLoaded} />
                <BlockAccounts />
                <BlockValidatorsV2 globalDataLoaded={globalDataLoaded} />
                <BlockTotalSupplies totalSupplies={totalSupplies} />
            </div>
        </>
    );
};

export default PageHome;