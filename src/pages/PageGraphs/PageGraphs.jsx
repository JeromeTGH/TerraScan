import React, { useEffect, useState } from 'react';
import styles from './PageGraphs.module.scss';
import { GraphBarIcon } from '../../application/AppIcons';
import { appName } from '../../application/AppParams';
import StyledBox from '../../sharedComponents/StyledBox';
import BlockLuncTotalSupplies from './BlockLuncTotalSupplies';
import BlockUstcTotalSupplies from './BlockUstcTotalSupplies';
import BlockNbStakedLunc from './BlockNbStakedLunc';
import BlockStakingRatio from './BlockStakingRatio';
import BlockCommunityPool from './BlockCommunityPool';
import BlockOraclePool from './BlockOraclePool';
import { loadCommonDatas } from './loadCommonDatas';

const PageGraphs = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();
    const [commonDatas, setCommonDatas] = useState();

    useEffect(() => {

        // Changement du "title" de la page web
        document.title = 'Graphs - ' + appName;

        // Récupération de données générales
        setIsLoading(true);
        setCommonDatas([]);
        setMsgErreur("");

        loadCommonDatas().then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setCommonDatas(res);
                setIsLoading(false);
                setMsgErreur("");
            }
        })

    }, [])


    return (
        <>
            <h1><GraphBarIcon /><span><strong>Graphs</strong> (historical charts)</span></h1>
            <StyledBox title="Datas" color="green">
                <span>Service started <strong>since October 2023</strong> (so <u>no history before</u>)</span>
            </StyledBox>
            {msgErreur ?
                    <StyledBox title="ERROR" color="red"><div className='erreur'>{msgErreur}</div></StyledBox>
                :
                    isLoading ?
                        <StyledBox title="Loading" color="blue"><br /><div>Loading data from blockchain (lcd), please wait ...</div><br /></StyledBox>
                    :
                        <div className={styles.blocksGraphsPage}>
                            <BlockLuncTotalSupplies commonDatas={commonDatas} />
                            <BlockUstcTotalSupplies commonDatas={commonDatas} />
                            <BlockNbStakedLunc commonDatas={commonDatas} />
                            <BlockStakingRatio commonDatas={commonDatas} />
                            <BlockCommunityPool commonDatas={commonDatas} />
                            <BlockOraclePool commonDatas={commonDatas} />
                        </div>
            }
            
        </>
    );
};

export default PageGraphs;