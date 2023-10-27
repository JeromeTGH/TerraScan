import React, { useEffect } from 'react';
import styles from './PageGraphs.module.scss';
import { GraphBarIcon } from '../../application/AppIcons';
import BlockTotalSupplies from './BlockTotalSupplies';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';

const PageGraphs = () => {

    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Graphs - ' + appName;

    }, [])


    return (
        <>
            <h1><GraphBarIcon /><span><strong>Graphs</strong> (historical charts)</span></h1>
            <StyledBox title="Datas" color="green">
                <span>Service started in sept/oct 2023 (so <u>no history before</u>)</span>
            </StyledBox>
            <div className={styles.blocksGraphsPage}>
                <BlockTotalSupplies />
            </div>
        </>
    );
};

export default PageGraphs;