import React, { useEffect, useState } from 'react';
import gridplace from './BlockStakingRatio.module.scss';
import styles from './BlockCharts.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { metEnFormeGrandNombre } from '../../application/AppUtils';
import { getStakingRatio } from './getStakingRatio';
import { AppContext } from '../../application/AppContext';


const BlockStakingRatio = (props) => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();

    const [timeunit, setTimeunit] = useState();
    const [tblStakingRatio, setTblStakingRatio] = useState([]);
    const [tblDatetimeLuncStaking, setTblDatetimeLuncStaking] = useState([]);
    const [lastValue, setLastValue] = useState('...');

    const { theme } = AppContext();


    // Fonction de sélection d'unité de temps
    const handleClickOnTimeUnits = (val) => {
        setTimeunit(val);
        loadDataWithThisTimeunit(val);
    }

    // Fonction de filtrage des valeurs
    const loadDataWithThisTimeunit = (valFiltre) => {
        setIsLoading(true);
        setTblStakingRatio([]);
        setTblDatetimeLuncStaking([]);
        setLastValue('...');

        getStakingRatio(props.commonDatas, valFiltre).then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblStakingRatio(res['StakingRatio']);
                setTblDatetimeLuncStaking(res['datetime']);
                setLastValue(res['last']);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }

    // Chargement des données
    useEffect(() => {
        handleClickOnTimeUnits('D1');
        // eslint-disable-next-line
    }, [])

    // Et affichage
    return (
        <StyledBox title="Staking Ratio" color="orange" className={gridplace.luncStakingBlock}>
            <div className={styles.entete}>
                <div className={styles.libelle}>Last : <strong>{lastValue}</strong> %</div>
                <div className={styles.tblTimeunits}>
                    <button className={timeunit === 'H1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H1')}><strong>1h</strong></button>
                    <button className={timeunit === 'H4' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H4')}><strong>4h</strong></button>
                    <button className={timeunit === 'D1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('D1')}><strong>D</strong></button>
                    <button className={timeunit === 'W1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('W1')}><strong>W</strong></button>
                    {/* <button className={timeunit === 'M1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('M1')}><strong>M1</strong></button> */}
                </div>
            </div>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                <div className={styles.charts}>
                    <div className={styles.chart}>
                        <Chart
                            series={[{
                                name: "Staking Ratio",
                                type: "area",
                                data: tblStakingRatio
                            }]}
                            width={"100%"}
                            height={"100%"}
                            options={{
                                noData: {
                                    text: isLoading ? 'Loading "StakingRatio history" from API, please wait ...' : 'No data, sorry',
                                    align: 'center',
                                    verticalAlign: 'middle',
                                    offsetX: 0,
                                    offsetY: 0,
                                    style: {
                                        color: undefined,
                                        fontSize: '0.9rem',
                                        fontFamily: undefined
                                    }
                                },
                                stroke: {
                                    width: 3,
                                    curve: 'smooth'
                                },
                                fill: {
                                    opacity: 0.2
                                },
                                labels: tblDatetimeLuncStaking,
                                chart: {
                                    toolbar: {
                                        show: false
                                    },
                                    zoom: {
                                        enabled: false
                                    },
                                    foreColor: 'var(--primary-text-color)'      // Couleur des valeurs en abscisse/ordonnée
                                },
                                yaxis: {
                                    // title: {
                                    //     text: 'Staking Ratio',
                                    // },
                                    labels: {
                                        formatter: (valeur) => (metEnFormeGrandNombre(valeur, 2) + " %")
                                    }
                                },
                                xaxis: {
                                    title: {
                                        text: 'Datetime (UTC)',
                                    },
                                },
                                tooltip: {
                                    theme: theme === "light" ? 'light' : 'dark'
                                }
                            }}
                        />
                    </div>
                </div>
            }
        </StyledBox>
    );
};

export default BlockStakingRatio;