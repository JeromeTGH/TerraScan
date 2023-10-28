import React, { useEffect } from 'react';
import styles from './PageGraphs.module.scss';
import { GraphBarIcon } from '../../application/AppIcons';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
import BlockLuncTotalSupplies from './BlockLuncTotalSupplies';
import BlockUstcTotalSupplies from './BlockUstcTotalSupplies';
import BlockNbStakedLunc from './BlockNbStakedLunc';
import BlockStakingRatio from './BlockStakingRatio';
import BlockCommunityPool from './BlockCommunityPool';

const PageGraphs = () => {

    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Graphs - ' + appName;

    }, [])


    return (
        <>
            <h1><GraphBarIcon /><span><strong>Graphs</strong> (historical charts)</span></h1>
            <StyledBox title="Datas" color="green">
                <span>Service started <strong>since sept/oct 2023</strong> (so <u>no history before</u>)</span>
            </StyledBox>
            <div className={styles.blocksGraphsPage}>
                <BlockLuncTotalSupplies />
                <BlockUstcTotalSupplies />
                <BlockNbStakedLunc />
                <BlockStakingRatio />
                <BlockCommunityPool />
            </div>
        </>
    );
};

export default PageGraphs;