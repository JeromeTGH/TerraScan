import React, { useEffect, useState } from 'react';
import styles from './BlockLuncTotalSupplies.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { getLuncTotalSupplies } from './getLuncTotalSupplies';


const BlockLuncTotalSupplies = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();

    const [timeunit, setTimeunit] = useState();
    const [tblLuncTotalSupplies, setTblLuncTotalSupplies] = useState();
    const [tblDatetimeTotalSupplies, setTblDatetimeTotalSupplies] = useState();


    // Fonction de sélection d'unité de temps
    const handleClickOnTimeUnits = (val) => {
        setTimeunit(val);
        loadDataWithThisTimeunit(val);
    }

    // Fonction de filtrage des valeurs
    const loadDataWithThisTimeunit = (valFiltre) => {
        setIsLoading(true);
        setTblLuncTotalSupplies([]);
        setTblDatetimeTotalSupplies([]);

        getLuncTotalSupplies(valFiltre).then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblLuncTotalSupplies(res['LuncSupplies']);
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
        <StyledBox title="LUNC total supply" color="blue" className={styles.totalSuppliesBlock}>
            <div className={styles.tblTimeunits}>
                <button className={timeunit === 'H1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H1')}><strong>H1</strong></button>
                <button className={timeunit === 'H4' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H4')}><strong>H4</strong></button>
                <button className={timeunit === 'D1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('D1')}><strong>D1</strong></button>
                <button className={timeunit === 'W1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('W1')}><strong>W1</strong></button>
                <button className={timeunit === 'M1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('M1')}><strong>M1</strong></button>
            </div>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "LUNC total supplies history" from API, please wait ...</div>
                :
                    <div className={styles.charts}>
                        <div className={styles.chart}>
                            <Chart
                                series={[{
                                    name: "LUNC total supply",
                                    type: "line",
                                    data: tblLuncTotalSupplies
                                }]}
                                width={"100%"}
                                height={"100%"}
                                options={{
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
                                            text: 'LUNC',
                                        },
                                    },
                                    xaxis: {
                                        title: {
                                            text: 'Datetime',
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

export default BlockLuncTotalSupplies;