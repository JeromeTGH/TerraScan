import React, { useEffect, useState } from 'react';
import gridplace from './BlockUstcTotalSupplies.module.scss';
import styles from './BlockCharts.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { getUstcTotalSupplies } from './getUstcTotalSupplies';


const BlockUstcTotalSupplies = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();

    const [timeunit, setTimeunit] = useState();
    const [tblUstcTotalSupplies, setTblUstcTotalSupplies] = useState([]);
    const [tblDatetimeTotalSupplies, setTblDatetimeTotalSupplies] = useState([]);


    // Fonction de sélection d'unité de temps
    const handleClickOnTimeUnits = (val) => {
        setTimeunit(val);
        loadDataWithThisTimeunit(val);
    }

    // Fonction de filtrage des valeurs
    const loadDataWithThisTimeunit = (valFiltre) => {
        setIsLoading(true);
        setTblUstcTotalSupplies([]);
        setTblDatetimeTotalSupplies([]);

        getUstcTotalSupplies(valFiltre).then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblUstcTotalSupplies(res['UstcSupplies']);
                setTblDatetimeTotalSupplies(res['datetime']);
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
        <StyledBox title="USTC total supply" color="blue" className={gridplace.totalSuppliesBlock}>
            <div className={styles.tblTimeunits}>
                <button className={timeunit === 'H1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H1')}><strong>1h</strong></button>
                <button className={timeunit === 'H4' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H4')}><strong>4h</strong></button>
                <button className={timeunit === 'D1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('D1')}><strong>D</strong></button>
                <button className={timeunit === 'W1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('W1')}><strong>W</strong></button>
                {/* <button className={timeunit === 'M1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('M1')}><strong>M1</strong></button> */}
            </div>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                <div className={styles.charts}>
                    <div className={styles.chart}>
                        <Chart
                            series={[{
                                name: "USTC total supply",
                                type: "line",
                                data: tblUstcTotalSupplies
                            }]}
                            width={"100%"}
                            height={"100%"}
                            options={{
                                noData: {
                                    text: isLoading ? 'Loading "LUNC history" from API, please wait ...' : 'No data, sorry',
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
                                    width: 2
                                },
                                labels: tblDatetimeTotalSupplies,
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
                                    title: {
                                        text: 'USTC',
                                    },
                                },
                                xaxis: {
                                    title: {
                                        text: 'Datetime (UTC)',
                                    },
                                }
                            }}
                        />
                    </div>
                </div>
            }
        </StyledBox>
    );
};

export default BlockUstcTotalSupplies;