import React, { useEffect } from 'react';
import styles from './PageGraphs.module.scss';
import { GraphBarIcon } from '../../application/AppIcons';
import BlockTotalSupplies from './BlockTotalSupplies';
import { appName } from '../../application/AppParams';

const PageGraphs = () => {

    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Graphs - ' + appName;

    }, [])


    return (
        <>
            <h1><GraphBarIcon /><span><strong>Graphs</strong> (historical charts)</span></h1>
            <p>Service started in ~september/october 2023 (so no history before)</p>
            <div className={styles.blocksGraphsPage}>
                <BlockTotalSupplies />
            </div>
        </>
    );
};

export default PageGraphs;