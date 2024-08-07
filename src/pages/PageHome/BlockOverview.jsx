import React, { useEffect, useState } from 'react';
import { getOverviewInfos } from './getOverviewInfos';
import styles from './BlockOverview.module.scss';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { Link } from 'react-router-dom';
import StyledBox from '../../sharedComponents/StyledBox';
// import { calculateNextEpochDateTime } from './calculateNextEpochDateTime';

const BlockOverview = (props) => {

    // Variables React
    const [overviewInfos, setOverviewInfos] = useState();
    // const [datetimeInfos, setDatetimeInfos] = useState();
    const [msgErreurOverviewInfos, setMsgErreurOverviewInfos] = useState();
    const [stakingRatio, setStakingRatio] = useState(-1);
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');


    // Exécution au démarrage
    useEffect(() => {
        if(props.totalSupplies && props.lastblockInfos) {

            // Mémorisation de la date/heure de chargement de cette page
            const maDate = Date.now();
            setDatetimeDernierUpdate(new Date(maDate).toLocaleString());

            // const tblDateTimeInfos = calculateNextEpochDateTime(props.lastblockInfos);
            // setDatetimeInfos(tblDateTimeInfos);
    
            // Récupération des infos communes
            getOverviewInfos(props.totalSupplies, props.lastblockInfos).then((res) => {
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
        }
    }, [props.totalSupplies, props.lastblockInfos])


    // Affichage
    return (
        <StyledBox title="Overview" color="orange" className={styles.overviewBlock}>
            <div className={styles.overviews}>
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Last block height :</div>
                        <div><strong># {overviewInfos ? overviewInfos['LastBlockHeight'] : "..."}</strong></div>
                    </div>
                    <div className={styles.datetimeupdate}>(last update : {datetimeDernierUpdate})</div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Current epoch :</div>
                        <div><strong># {overviewInfos ? overviewInfos['LastBlockEpoch'] : "..."}</strong></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Next epoch :</div>
                        <div><strong>{overviewInfos ? "~ " + overviewInfos['DateEstimativeProchaineEpoch'] : "..."}</strong></div>
                    </div>
                </div>
                <br />
                <table className={styles.progressbartbl}>
                    <tbody>
                        <tr>
                            <td className={styles.progressbartext}>Current&nbsp;epoch&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                    {overviewInfos ? 
                                        (overviewInfos['PourcentageAvancementDansEpoch'] < 15) ? (
                                            <>
                                                <div className={styles.barre} style={{width: overviewInfos['PourcentageAvancementDansEpoch'] + "%"}}><span>&nbsp;</span></div>
                                                <div className={styles.apresbarre}><span>&nbsp;&nbsp;←&nbsp;&nbsp;{overviewInfos['PourcentageAvancementDansEpoch']}%</span></div>
                                            </>
                                        ) : (
                                            <div className={styles.barre} style={{width: overviewInfos['PourcentageAvancementDansEpoch'] + "%"}}><span>{overviewInfos['PourcentageAvancementDansEpoch']}%</span></div>
                                        )
                                     : (
                                        <>
                                            <div className={styles.barre} style={{width: "0%"}}><span>&nbsp;</span></div>
                                            <div className={styles.apresbarre}><span>&nbsp;Loading...</span></div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;LUNC total supply :</div>
                        <div>
                            <strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncTotalSupply'], 3) : "..."}</strong>
                            <span>{overviewInfos ?  " (100%)" : ""}</span>
                        </div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Staked LUNC :</div>
                        <div><strong>{overviewInfos ? metEnFormeGrandNombre(overviewInfos['LuncBonded'], 3) : "..."}</strong>{stakingRatio === -1 ? "" : " (" + stakingRatio + "%)"}</div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Staking unbonding time :</div>
                        <div><strong>{overviewInfos ? overviewInfos['UnbondingTime'] : "..."} days</strong></div>
                    </div>
                </div>
                <br />
                <table className={styles.progressbartbl}>
                    <tbody>
                        <tr>
                            <td className={styles.progressbartext}>Staking&nbsp;ratio&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                    {stakingRatio && stakingRatio !== -1 ? 
                                        (stakingRatio < 15) ? (
                                            <>
                                                <div className={styles.barre} style={{width: stakingRatio + "%"}}><span>&nbsp;</span></div>
                                                <div className={styles.apresbarre}><span>&nbsp;&nbsp;←&nbsp;&nbsp;{stakingRatio}%</span></div>
                                            </>
                                        ) : (
                                            <div className={styles.barre} style={{width: stakingRatio + "%"}}><span>{stakingRatio}%</span></div>
                                        )
                                     : (
                                        <>
                                            <div className={styles.barre} style={{width: "0%"}}><span>&nbsp;</span></div>
                                            <div className={styles.apresbarre}><span>&nbsp;Loading...</span></div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Nb validators (active/max) :</div>
                        <div><strong>{overviewInfos ? overviewInfos['NbBondedValidators'] : "..."}/{overviewInfos ? overviewInfos['NbMaxValidators'] : "..."}</strong></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Nakamoto Coefficient (33,33% VP) :</div>
                        <div><strong>{overviewInfos ? overviewInfos['NakamotoCoefficient'] : "..."}</strong></div>
                    </div>
                </div>
                <br />
                <table className={styles.progressbartbl}>
                    <tbody>
                        <tr>
                            <td className={styles.progressbartext}>Nakamoto&nbsp;coeff&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                    {overviewInfos && overviewInfos['NakamotoCoefficient'] ? 
                                            <div className={styles.barre} style={{width: (overviewInfos['NakamotoCoefficient']*1.5) + "%"}}><span>{overviewInfos['NakamotoCoefficient']}</span></div>
                                     : (
                                        <>
                                            <div className={styles.barre} style={{width: "0%"}}><span>&nbsp;</span></div>
                                            <div className={styles.apresbarre}><span>&nbsp;Loading...</span></div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.progressbartext}>Validators&nbsp;:</td>
                            <td className={styles.progressbarcontent}>
                                <div className={styles.progressbar}>
                                    {overviewInfos ? (
                                        <div className={styles.barre} style={{width: (overviewInfos['NbBondedValidators']/overviewInfos['NbMaxValidators']*100) + "%"}}><span>{overviewInfos['NbBondedValidators'] + "/" + overviewInfos['NbMaxValidators']}</span></div>
                                    ) : (
                                        <>
                                            <div className={styles.barre} style={{width: "0%"}}><span>&nbsp;</span></div>
                                            <div className={styles.apresbarre}><span>&nbsp;Loading...</span></div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;Inflation (mint) :</div>
                        <div><strong>{overviewInfos ? overviewInfos['InflationMax'] : "..."}%</strong></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<Link to="/proposals/11515">Burn tax</Link> :</div>
                        <div><strong>{overviewInfos ? overviewInfos['BurnTaxMax'] : "..."}%</strong></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<Link to="/proposals/11514">Burn tax split</Link> :</div>
                        <div></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div></div>
                        <div><strong>{overviewInfos ? overviewInfos['BurnTaxSplitToBeBurn'] : "..."}% burn / {overviewInfos ? overviewInfos['BurnTaxSplitToDistributionModule'] : "..."}% to DM</strong></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;<Link to="/proposals/12098">Distribution Module split</Link> :</div>
                        <div></div>
                    </div>
                    <div className={styles.descThenValue}>
                        <div></div>
                        <div><strong>{overviewInfos ? overviewInfos['DistributionModuleSplitToOraclePool'] : "..."}% to OP / {overviewInfos ? overviewInfos['DistributionModuleSplitToCommunityPool'] : "..."}% to CP</strong></div>
                    </div>
                </div>
                <div className={styles.comments}>
                    <u>Note</u> : DM=Distribution&nbsp;Module / CP=Community&nbsp;Pool / OP=Oracle&nbsp;Pool
                </div>
                <br />
                <div className={styles.boxed}>
                    <div className={styles.descThenValue}>
                        <div>→&nbsp;LUNC/USTC in Community Pool :</div>
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
                        <div>→&nbsp;LUNC/USTC in Oracle Pool :</div>
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
                <u>Suffixes</u> : T=Trillion (10<sup>12</sup> or 1.000.000.000.000), B=Billion (10<sup>9</sup> or 1.000.000.000), M=Million (10<sup>6</sup> or 1.000.000), and K=Kilo (10<sup>3</sup> or 1.000)
            </div>
            <div className="erreur">{msgErreurOverviewInfos}</div>
        </StyledBox>
    );
};

export default BlockOverview;