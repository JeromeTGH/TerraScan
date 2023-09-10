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
import BlockBurn from './BlockBurn';
import { loadCommonAppDatas } from './PageHome.loader';

const PageHome = () => {

    // Variables react
    const [totalSupplies, setTotalSupplies] = useState();
    const [lastblockInfos, setLastblockInfos] = useState();

    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Home - ' + appName;

        // Chargement des données communes
        loadCommonAppDatas().then((res) => {
            setTotalSupplies(res['totalSupplies']);
            setLastblockInfos(res['latestBlock']);
        })

    }, [])


    // Et affichage de la page, au final
    return (
        <>
            <h1><HomeIcon /><span><strong>Home</strong> (dashboard)</span></h1>
            <div className={styles.blocksHomepage}>
                <BlockSearch />
                <BlockBurn />
                <BlockOverview totalSupplies={totalSupplies} lastblockInfos={lastblockInfos} />
                <BlockLatestBlocks lastblockInfos={lastblockInfos} />
                <BlockAccounts />
                <BlockValidators />
                <BlockTotalSupplies totalSupplies={totalSupplies} />
            </div>
        </>
    );
};

export default PageHome;