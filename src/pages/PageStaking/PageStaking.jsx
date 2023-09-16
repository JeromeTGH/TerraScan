import React, { useEffect, useState } from 'react';
import { LockIcon } from '../../application/AppIcons';
import styles from './PageStaking.module.scss';
import Chart from 'react-apexcharts';

import { formateLeNombre } from '../../application/AppUtils';
import StyledBox from '../../sharedComponents/StyledBox';
import { getStakingInfos } from './getStakingInfos';

const PageStaking = () => {

    // Variables React
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();
    const [tblDatas, setTblDatas] = useState([]);


    // À exécuter au démarrage
    useEffect(() => {
        setIsLoading(true);
        getStakingInfos().then((res) => {
            if(res['erreur']) {
                // Erreur
                setMsgErreur(res['erreur']);
                setTblDatas([]);
            }
            else {
                // OK
                setIsLoading(false);
                setMsgErreur('');
                setTblDatas(res);
            }
        })
    }, [])


    // Affichage
    return (
        <>
            <h1><span><LockIcon /><strong>Staking</strong></span></h1>
            {msgErreur ?
                <StyledBox title="ERROR" color="red"><div className='erreur'><br />{msgErreur}<br /><br /></div></StyledBox>
            :
                isLoading ?
                    <StyledBox title="Loading" color="blue"><div><br />Loading from blockchain (LCD), please wait ...<br /><br /></div></StyledBox>
                :
                    <div className={styles.pgStaking}>
                        {tblDatas && tblDatas['StakingPercentage'] ?
                            <>
                                <StyledBox title="Data" color="green" className={styles.tblStaking}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>LUNC total supply : </td>
                                                <td><strong>{formateLeNombre(tblDatas['LuncTotalSupply'], ' ')}</strong> LUNC</td>
                                            </tr>
                                            <tr>
                                                <td>Staked LUNC : </td>
                                                <td><strong>{formateLeNombre(tblDatas['LuncBonded'], ' ')}</strong> LUNC</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2"><hr /></td>
                                            </tr>
                                            <tr>
                                                <td>Staking rate : </td>
                                                <td><strong>{(tblDatas['StakingPercentage']).toFixed(2)} %</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </StyledBox>
                                <StyledBox title="Chart" color="blue" className={styles.stakingChart}>
                                    <div>
                                        <Chart
                                            type="radialBar"
                                            width={"100%"}
                                            // height={300}
                                            series={[(tblDatas['StakingPercentage']).toFixed(2)]}
                                            options={{
                                                labels: ['Staked LUNC'],
                                                colors:['var(--primary-fill)', 'pink'],         // Couleurs de la série et textes labels associés (data-labels)
                                                chart: {
                                                    foreColor: 'var(--primary-text-color)'      // Couleur des valeurs (data-values)
                                                },
                                                plotOptions: {
                                                    radialBar: {
                                                        track: {
                                                        background: 'var(--unprimary-fill)'   // Couleur de fond de l'anneau, lorsque "non coloré"
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </>
                        :
                            <div className="erreur">No data to show ...</div>
                    }
                </div>
            }
        </>
    );
};

export default PageStaking;