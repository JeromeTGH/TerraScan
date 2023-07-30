import React, { useEffect, useState } from 'react';
import { OverviewIcon } from '../../application/AppIcons';
import { getOverviewInfos } from '../../sharedFunctions/getOverviewInfos';
import styles from './BlockOverview.module.scss';
import { metEnFormeGrandNombre } from '../../application/AppUtils';


const BlockOverview = () => {

    const [overviewInfos, setOverviewInfos] = useState();
    const [msgErreurOverviewInfos, setMsgErreurOverviewInfos] = useState();

    const [stakingRate, setStakingRate] = useState(0);

    useEffect(() => {
        getOverviewInfos().then((res) => {
            if(res['erreur']) {
                setMsgErreurOverviewInfos(res['erreur']);
                setOverviewInfos([]);
            }
            else {
                setMsgErreurOverviewInfos('');
                setOverviewInfos(res);
                const pourcentageDeStaking = (res['LuncBonded'] / res['LuncTotalSupply'] * 100).toFixed(1);
                setStakingRate(pourcentageDeStaking);
            }
        })
    }, [])

    return (
        <>
            <h2><strong><OverviewIcon /></strong><span><strong>Overview</strong></span></h2>
            <div>LUNC total supply = <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncTotalSupply']) : "..."}</strong> (100%)</div>
            <div>Staked LUNC = <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncBonded']) : "..."}</strong> ({stakingRate}%)</div>
            <div className={styles.progressbarcontainer}>
                <div className={styles.progresstext}>Staking&nbsp;rate</div>
                <div className={styles.progressbar}>
                    <div className={styles.barre} style={{width: stakingRate + "%"}}><span>{stakingRate}%</span></div>
                </div>
            </div>
            <div className={styles.comments}>
                <br />
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
                <br />
            </div>
            <div className="erreur">{msgErreurOverviewInfos}</div>
        </>
    );
};

export default BlockOverview;