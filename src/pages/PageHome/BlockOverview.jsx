import React, { useEffect, useState } from 'react';
import { OverviewIcon, QuestionIcon } from '../../application/AppIcons';
import { getOverviewInfos } from '../../sharedFunctions/getOverviewInfos';
import styles from './BlockOverview.module.scss';
import { metEnFormeGrandNombre } from '../../application/AppUtils';


const BlockOverview = () => {

    // const tip1 = "<u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)";

    const [overviewInfos, setOverviewInfos] = useState();
    const [msgErreurOverviewInfos, setMsgErreurOverviewInfos] = useState();

    const [stakingRatio, setStakingRatio] = useState(0);

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
                setStakingRatio(pourcentageDeStaking);
            }
        })
    }, [])

    return (
        <>
            <h2><strong><OverviewIcon /></strong><span><strong>Overview</strong></span></h2>

            <div className={styles.overviews}>
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>LUNC total supply</u> =</div>
                        <div><strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncTotalSupply'], 3) : "..."}</strong> (100%) <QuestionIcon /></div>                
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Staked LUNC</u> =</div>
                        <div><strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncBonded'], 3) : "..."}</strong> ({stakingRatio}%) <QuestionIcon /></div>
                    </div>
                    {/* <br /> */}
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Staking unbonding time</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['UnbondingTime'] : "..."} days</strong> <QuestionIcon /></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Nb validators (active/max)</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['NbBondedValidators'] : "..."}/{overviewInfos ? overviewInfos['NbMaxValidators'] : "..."}</strong> <QuestionIcon /></div>
                    </div>
                </div>
                <br />
                <table className={styles.progressbartbl}>
                    <tbody>
                        <tr>
                            <td className={styles.progressbartext}>Staking&nbsp;ratio&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                    <div className={styles.barre} style={{width: stakingRatio + "%"}}><span>{stakingRatio}%</span></div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.progressbartext}>Validators&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                <div className={styles.barre} style={{width: overviewInfos ? (overviewInfos['NbBondedValidators']/overviewInfos['NbMaxValidators']*100) + "%" : "0%" }}><span>{overviewInfos ? overviewInfos['NbBondedValidators'] : "..."}/{overviewInfos ? overviewInfos['NbMaxValidators'] : "..."}</span></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Inflation (max mint)</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['InflationMax'] : "..."}%</strong> <QuestionIcon /></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Tobin tax ("tax burn")</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['TobinTaxMax'] : "..."}%</strong> <QuestionIcon /></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Tobin tax split</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['TobinTaxSplitToBeBurn'] : "..."}% burn / {overviewInfos ? overviewInfos['TobinTaxSplitToDistributionModule'] : "..."}% to DM</strong> <QuestionIcon /></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>DM split</u> =</div>
                        <div><strong>{overviewInfos ? overviewInfos['DistributionModuleSplitToStakers'] : "..."}% to stakers / {overviewInfos ? overviewInfos['DistributionModuleSplitToCommunityPool'] : "..."}% to CP</strong> <QuestionIcon /></div>
                    </div>
                </div>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Amount of coins in "Community Pool"</u> :</div>
                        <div></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div></div>
                        <div>
                            <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['AmountOfLuncInCP'], 3) : "..."}</strong> LUNC&nbsp;/&nbsp;
                            <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['AmountOfUstcInCP'], 3) : "..."}</strong> USTC
                        </div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<u>Amount of coins in "Oracle Pool"</u> :</div>
                        <div></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div></div>
                        <div>
                            <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['AmountOfLuncInOP'], 3) : "..."}</strong> LUNC&nbsp;/&nbsp;
                            <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['AmountOfUstcInOP'], 3) : "..."}</strong> USTC
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.comments}>
                <br />
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)<br />
                <u>Nb validators</u> : number of validator, active (status=bonded) vs max (fixed parameter, on the blockchain)<br />
                <u>Amount of coins in CP/OP</u> : amount of "majors coins" (i.e. LUNC and USTC) in CommunityPool and OraclePool<br />
                <u>Acronyms</u> : DM=Distribution Module, CP=Community Pool
                <br />
            </div>
            <div className="erreur">{msgErreurOverviewInfos}</div>
        </>
    );
};

export default BlockOverview;